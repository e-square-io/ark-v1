import { Observable, ReplaySubject } from 'rxjs';

import { ArkStore, SelectKey } from '../entities';

/**
 * Get the observable of store's entire value.
 */
export function select<State>(store: ArkStore<State>): Observable<State>;

/**
 * Get the observable of store's value according to specified key.
 *
 * @example
 *
 * select(store, 'x');
 */
export function select<State, Key extends SelectKey<State>>(store: ArkStore<State>, key: Key): Observable<State[Key]>;

/**
 * Get the observable of store's value modified by projection function.
 * You can specify keys that will be used to distinct changes, for example, `id`.
 *
 * @example
 *
 * select(store, state => state.x / 2);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function select<State, Result extends (state: State) => any>(
  store: ArkStore<State>,
  profectionFn: Result,
): Observable<Result extends (state: State) => infer R ? R : never>;
export function select<State, Result>(
  store: ArkStore<State>,
  arg?: (state: State) => Result | SelectKey<State>,
): Observable<Result | State> {
  const resultSubject = new ReplaySubject<Result | State>(1);
  store.hooks.addBeforeDestroy(() => resultSubject.complete());

  if (typeof arg === 'function') {
    store.subscribe(state => resultSubject.next(arg(state) as Result));
  } else if (typeof arg === 'string') {
    store.subscribe(state => resultSubject.next(state[arg]));
  } else if (typeof arg === 'undefined') {
    store.subscribe(state => resultSubject.next(state));
  }

  return resultSubject.asObservable();
}
