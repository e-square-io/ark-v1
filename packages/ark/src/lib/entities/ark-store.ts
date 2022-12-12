import { Observable } from 'rxjs';

import { SelectStateFunction, UpdateStateFunction } from './projection-functions';
import { StatusState } from './status-state';

export type SelectKey<State> = keyof State;

/**
 * Ark gives you an abstraction to extend to create your store.
 */
export interface ArkStore<State> {
  status$?: Observable<StatusState>;
  update(updateObj: Partial<State>): void;
  update(updateFn: UpdateStateFunction<State>): void;
  update(arg: Partial<State> | UpdateStateFunction<State>): void;

  select(): Observable<State>;
  select<Key extends SelectKey<State>>(key: SelectKey<State>): Observable<State[Key]>;
  select<Result>(
    selectFunction: SelectStateFunction<State, Result>,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result>;
  select<Result>(
    arg?: SelectStateFunction<State, Result> | SelectKey<State>,
    distinctKeys?: SelectKey<State>[],
  ): Observable<Result | State>;

  updateStatus(statusUpdate: Partial<StatusState>): void;
}
