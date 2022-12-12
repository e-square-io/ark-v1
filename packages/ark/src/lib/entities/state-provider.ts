import { Observable } from 'rxjs';

import { Constructor, SelectStateFunction } from '../entities';

/**
 * State provider holds the state. You can create your providers
 * by implementing this interface.
 */
export interface StateProvider<State> {
  state: State;
  setState(state: State): void;
  selectState<Result>(selectFn: SelectStateFunction<State, Result>): Observable<Result>;
  getValue(): State;
  reset(): void;
  destroy(): void;
}

export type StateProviderConstructor<State> = Constructor<StateProvider<State>>;
