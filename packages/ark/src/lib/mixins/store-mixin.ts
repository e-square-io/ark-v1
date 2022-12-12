import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';

import {
  ArkStore,
  Constructor,
  SelectKey,
  SelectStateFunction,
  StateProvider,
  StatusState,
  UpdateStateFunction,
} from '../entities';

export type StoreConstructor<State> = Constructor<ArkStore<State>>;

export function mixinStore<State>(
  stateProvider: Constructor<StateProvider<State>>,
  statusProvider?: Constructor<StateProvider<StatusState>>,
): StoreConstructor<State> {
  return class implements ArkStore<State> {
    protected readonly viewRef = inject(ChangeDetectorRef, { optional: true }) as ViewRef | null;
    protected readonly provider = new stateProvider();
    protected readonly statusProvider = statusProvider ? new statusProvider() : undefined;

    get status$(): Observable<StatusState> {
      if (!this.statusProvider) {
        throw new Error('The store was created without status state functionality');
      }

      return this.statusProvider.selectState(state => state);
    }

    constructor() {
      // TODO initial state
      setTimeout(() => this.viewRef?.onDestroy(() => this.destroy()), 0);
    }

    update(updateObj: Partial<State>): void;
    update(updateFn: UpdateStateFunction<State>): void;
    update(arg: Partial<State> | UpdateStateFunction<State>): void {
      if (typeof arg === 'function') {
        this.provider.setState({ ...this.provider.state, ...arg(this.provider.state) });
      } else if (typeof arg === 'object') {
        this.provider.setState({ ...this.provider.state, ...arg });
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

    updateStatus(statusUpdate: Partial<StatusState>): void {
      if (!this.statusProvider) {
        throw new Error('The store was created without status state functionality');
      }

      this.statusProvider.setState({ ...this.statusProvider.state, ...statusUpdate });
    }

    destroy(): void {
      this.provider.destroy();
      this.statusProvider?.destroy();
    }
  };
}
