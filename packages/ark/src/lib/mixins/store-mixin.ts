import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { distinctUntilChanged, Observable, Subject, Subscription, tap } from 'rxjs';

import {
  ArkStore,
  ConnectionProjectionFn,
  Constructor,
  SelectKey,
  SelectStateFunction,
  StateProvider,
  StatusState,
  UpdateStateFunction,
} from '../entities';

export type StoreConstructor<State> = Constructor<ArkStore<State>>;
type Connections<State> = Partial<Record<keyof State, Subscription>>;

export function mixinStore<State>(
  stateProvider: Constructor<StateProvider<State>>,
  statusProvider?: Constructor<StateProvider<StatusState>>,
): StoreConstructor<State> {
  return class implements ArkStore<State> {
    readonly destroySubject$ = new Subject<void>();
    protected readonly viewRef = inject(ChangeDetectorRef, { optional: true }) as ViewRef | null;
    protected readonly provider: StateProvider<State>;
    protected readonly statusProvider = statusProvider ? new statusProvider() : undefined;
    protected readonly connections: Connections<State> = {};
    protected generalConnection?: Subscription;
    protected funcConnection?: Subscription;

    get value(): State {
      return this.provider.getValue();
    }

    get status$(): Observable<StatusState> {
      if (!this.statusProvider) {
        throw new Error('The store was created without status state functionality');
      }

      return this.statusProvider.selectState(state => state);
    }

    readonly destroy$ = this.destroySubject$.asObservable();

    constructor(initialState: State) {
      this.provider = new stateProvider(initialState);
      setTimeout(() => this.viewRef?.onDestroy(() => this.destroy()), 0);
    }

    update(updateObj: Partial<State>): void;
    update<Key extends keyof State>(key: Key, value: State[Key]): void;
    update(updateFn: UpdateStateFunction<State>): void;
    update<Key extends keyof State = never>(
      arg: Partial<State> | UpdateStateFunction<State> | Key,
      value?: State[Key],
    ): void {
      if (typeof arg === 'function') {
        this.provider.setState({ ...this.provider.state, ...arg(this.provider.state) });
      } else if (typeof arg === 'object') {
        this.provider.setState({ ...this.provider.state, ...arg });
      } else {
        const state: State = {
          ...this.provider.state,
        };
        state[arg] = value as State[Key];
        this.provider.setState(state);
      }
    }

    select(): Observable<State>;
    select<Key extends SelectKey<State>>(key: SelectKey<State>): Observable<State[Key]>;
    select<Result>(
      selectFunction: SelectStateFunction<State, Result>,
      distinctKeys?: SelectKey<State>[],
    ): Observable<Result>;
    select<Result>(
      arg?: SelectStateFunction<State, Result> | SelectKey<State>,
      distinctKeys?: SelectKey<State>[],
    ): Observable<Result | State> {
      if (typeof arg === 'function') {
        let result$ = this.provider.selectState<Result>(arg);

        if (distinctKeys?.length) {
          result$ = result$.pipe(
            distinctUntilChanged<Result>((a: Result, b: Result) => {
              const acc: boolean[] = [];

              distinctKeys.forEach(key => {
                acc.push(a?.[key as unknown as keyof Result] === b?.[key as unknown as keyof Result]);
              });

              return acc.every(Boolean);
            }),
          );
        }

        return result$;
      } else if (typeof arg === 'string') {
        return this.provider.selectState<Result>(s => s[arg] as Result);
      }

      return this.provider.selectState(state => state);
    }

    connect(source$: Observable<Partial<State>>): void;
    connect<Key extends keyof State>(source$: Observable<State[Key]>, key: Key): void;
    connect(source$: Observable<Partial<State>>, projectionFn: ConnectionProjectionFn<State>): void;
    connect<Key extends keyof State>(
      source$: Observable<Partial<State> | State[Key]>,
      arg?: Key | ConnectionProjectionFn<State>,
    ): void {
      if (!arg) {
        this.generalConnection?.unsubscribe();
        this.generalConnection = (source$ as Observable<Partial<State>>)
          .pipe(tap(value => this.update(value)))
          .subscribe();
        return;
      } else if (typeof arg === 'function') {
        this.funcConnection?.unsubscribe();
        this.funcConnection = (source$ as Observable<Partial<State>>)
          .pipe(tap(value => this.update(arg(value, this.provider.getValue()))))
          .subscribe();
        return;
      }

      this.connections[arg]?.unsubscribe();
      this.connections[arg] = (source$ as Observable<State[Key]>)
        .pipe(tap(value => this.update<Key>(arg, value)))
        .subscribe();
    }

    disconnect(): void;
    disconnect<Key extends keyof State>(key: Key | 'func'): void;
    disconnect<Key extends keyof State>(key?: Key): void {
      if (!key) {
        this.generalConnection?.unsubscribe();
        for (const connection in this.connections) {
          this.connections[connection]?.unsubscribe();
        }
      } else if (key === 'func') {
        this.funcConnection?.unsubscribe();
        this.connections[key]?.unsubscribe();
      } else {
        this.connections[key]?.unsubscribe();
      }
    }

    updateStatus(statusUpdate: Partial<StatusState>): void {
      this.statusProvider?.setState({ ...this.statusProvider.state, ...statusUpdate });
    }

    reset(): void {
      this.provider.reset();
      this.statusProvider?.reset();
    }

    destroy(): void {
      this.provider.destroy();
      this.statusProvider?.destroy();
      this.disconnect();
      this.destroySubject$.next();
    }
  };
}
