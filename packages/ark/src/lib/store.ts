import { ChangeDetectorRef, Inject, inject, Injectable, Optional, ViewRef } from '@angular/core';
import { distinctUntilChanged, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  DefaultError,
  DefaultState,
  INITIAL_STATE,
  INITIAL_STATUS_STATE,
  SelectStateFunction,
  Status,
  StatusState,
  StorageMechanism,
  StoreOptions,
  STORE_OPTIONS,
  UpdateStateFunction,
} from './entities';

export type SelectKey<State> = keyof State;

function tryGetStorage(storage: StorageMechanism): Storage | undefined {
  try {
    return typeof window[storage] !== 'undefined' ? window[storage] : undefined;
  } catch {
    return undefined;
  }
}

const DEFAULT_STORAGE_ROOT_KEY = '__ark';

@Injectable()
export abstract class Store<State = DefaultState, S = Status, E = DefaultError> {
  protected readonly id = uuidv4();
  protected readonly viewRef = inject(ChangeDetectorRef, { optional: true }) as ViewRef | null;
  protected readonly destroy$ = new Subject<void>();
  protected readonly storage?: Storage;
  protected state: State;
  protected readonly stateSubject$ = new ReplaySubject<State>(1);
  protected statusState: StatusState<S, E>;
  protected readonly statusStateSubject$ = new ReplaySubject<StatusState<S, E>>(1);

  readonly status$ = this.statusStateSubject$.asObservable();

  get name(): string {
    return this.options?.name || Object.getPrototypeOf(this).constructor.name;
  }

  constructor(
    @Optional() @Inject(INITIAL_STATE) protected readonly initialState?: State,
    @Optional() @Inject(STORE_OPTIONS) protected readonly options?: StoreOptions,
    @Optional() @Inject(INITIAL_STATUS_STATE) protected readonly initialStatusState?: StatusState<S, E>,
  ) {
    setTimeout(() => this.viewRef?.onDestroy(() => this.destroy()), 1);
    this.state = initialState ? { ...initialState } : ({} as State);
    this.stateSubject$.next(this.state);
    this.statusState = initialStatusState ? { ...initialStatusState } : ({ status: 'idle' } as StatusState<S, E>);
    this.statusStateSubject$.next(this.statusState);

    if (options?.storage) {
      this.storage = tryGetStorage(options.storage);
      const storageValue = this.readStorage()?.[this.name];

      if (storageValue) {
        this.setState({ ...this.state, ...storageValue }, true);
      }
    }
  }

  updateStatus(statusUpdate: Partial<StatusState<S, E>>): void {
    if (statusUpdate.status === 'error' && !statusUpdate.error) {
      throw new Error('Setting status to error requires updating the `error` property as well.');
    }

    if (statusUpdate.status !== 'error') {
      statusUpdate.error = undefined;
    }

    this.statusState = { ...this.statusState, ...statusUpdate };
    this.statusStateSubject$.next(this.statusState);
  }

  update(updateObj: Partial<State>): void;
  update(updateFn: UpdateStateFunction<State>): void;
  update(arg: Partial<State> | UpdateStateFunction<State>): void {
    if (typeof arg === 'function') {
      this.setState({ ...this.state, ...arg(this.state) });
    } else if (typeof arg === 'object') {
      this.setState({ ...this.state, ...arg });
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
      let result$ = this.selectState<Result>(arg);

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
      return this.selectState<Result>(s => s[arg] as Result);
    }

    return this.selectState(state => state);
  }

  destroy(): void {
    this.destroy$.next();
    this.stateSubject$.complete();
    this.statusStateSubject$.complete();
  }

  protected setState(state: State, notUpdateStorage = false): void {
    this.state = state;
    this.stateSubject$.next(this.state);
    !notUpdateStorage && this.updateStorage();
  }

  protected selectState<Result>(selectFn: SelectStateFunction<State, Result>): Observable<Result> {
    return this.stateSubject$.asObservable().pipe(
      map<State, Result>(state => selectFn(state)),
      distinctUntilChanged(),
    );
  }

  protected updateStorage(): void {
    if (!this.options?.storage || !this.storage) {
      return;
    }

    let storageValue = this.readStorage();
    storageValue = storageValue ? storageValue : {};

    storageValue[this.name] = { ...this.state };
    this.storage.setItem(this.getRootKey(), JSON.stringify(storageValue));
  }

  protected readStorage(): Record<string, Partial<State>> | null {
    if (!this.options?.storage || !this.storage) {
      return null;
    }

    const value = this.storage.getItem(this.getRootKey());

    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }

    return null;
  }

  protected getRootKey(): string {
    return this.options?.storageRootKey || DEFAULT_STORAGE_ROOT_KEY;
  }
}
