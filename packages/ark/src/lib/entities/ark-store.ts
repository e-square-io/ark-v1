import { Observable } from 'rxjs';

import { SelectStateFunction, UpdateStateFunction } from './projection-functions';
import { StatusState } from './status-state';

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
  select<Key extends SelectKey<State>>(key: SelectKey<State>): Observable<State[Key]>;

  /**
   * Get the observable of store's value modified by projection function.
   * You can specify keys that will be used to distinct changes, for example, `id`.
   *
   * @example
   *
   * store.select(state => state.x / 2);
   */
  select<Result>(
    selectFunction: SelectStateFunction<State, Result>,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result>;
  select<Result>(
    arg?: SelectStateFunction<State, Result> | SelectKey<State>,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result | State>;

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
