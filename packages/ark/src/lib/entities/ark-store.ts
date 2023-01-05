import { Observable } from 'rxjs';

import { ConnectionProjectionFn, SelectStateFunction, UpdateStateFunction } from './projection-functions';
import { StatusState } from './status-state';

export type UnknownState = Record<string, unknown>;
export type SelectKey<State> = keyof State;

/**
 * Ark gives you an abstraction to extend to create your store.
 */
export interface ArkStore<State> {
  /**
   * Current value of the store.
   */
  value: State;

  /**
   * Observable of store's status value.
   */
  status$?: Observable<StatusState>;

  /**
   * Emits once when the store is destroyed.
   */
  destroy$: Observable<void>;

  /**
   * Update the store's value.
   *
   * @example
   *
   * store.update({ x: 42 });
   */
  update(updateObj: Partial<State>): void;

  /**
   * Update the store's value.
   *
   * @example
   *
   * store.update<'query'>(query, 'Angular');
   */
  update<Key extends keyof State>(key: Key, value: State[Key]): void;

  /**
   * Update the store's value.
   *
   * @example
   *
   * store.update(state => ({ x: state.x + 1 }));
   */
  update(updateFn: UpdateStateFunction<State>): void;
  update(arg: Partial<State> | UpdateStateFunction<State>): void;

  /**
   * Get the observable of store's entire value.
   */
  select(): Observable<State>;

  /**
   * Get the observable of store's value according to specified key.
   *
   * @example
   *
   * store.select('x');
   */
  select<Key extends SelectKey<State>>(key: Key): Observable<State[Key]>;

  /**
   * Get the observable of store's value modified by projection function.
   * You can specify keys that will be used to distinct changes, for example, `id`.
   *
   * @example
   *
   * store.select(state => state.x / 2);
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select<Result extends (state: State) => any>(
    selectFunction: Result,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result extends (state: State) => infer R ? R : never>;
  select<Result>(
    arg?: SelectStateFunction<State, Result> | SelectKey<State>,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result | State>;

  /**
   * Connect an observable to store. Any value by the observable
   * will update the store.
   */
  connect(source$: Observable<Partial<State>>): void;
  connect<Key extends keyof State>(source$: Observable<State[Key]>, key: Key): void;
  connect(source$: Observable<Partial<State>>, projectionFn: ConnectionProjectionFn<State>): void;
  connect<Key extends keyof State>(source$: Observable<State | State[Key]>, key?: Key): void;

  disconnect(): void;
  disconnect<Key extends keyof State>(key: Key | 'func'): void;
  disconnect<Key extends keyof State>(key?: Key): void;

  /**
   * Update the store's status value. You can specify the status
   * itself that can have many values like "busy", "error" and so on.
   * And you can set error status with error object itself.
   */
  updateStatus(statusUpdate: Partial<StatusState>): void;

  /**
   * Reset the store to its initial value.
   */
  reset(): void;

  /**
   * Do all cleanup that needs to occur when the instance is destroyed.
   */
  destroy(): void;
}
