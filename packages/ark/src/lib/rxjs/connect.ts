import { Observable, Subscription, tap } from 'rxjs';

import { ArkStore } from '../entities';

export type ConnectionProjectionFn<State> = (value: Partial<State>, state: State) => Partial<State>;

/** Function that disconnects current connection from the store */
export type Disconnector = () => void;

/**
 * Connect an observable to store. Any value by the observable
 * will update the store.
 */
export function connect<State>(store: ArkStore<State>, source$: Observable<Partial<State>>): Disconnector;
export function connect<State, Key extends keyof State>(
  store: ArkStore<State>,
  source$: Observable<State[Key]>,
  key: Key,
): Disconnector;
export function connect<State>(
  store: ArkStore<State>,
  source$: Observable<Partial<State>>,
  projectionFn: ConnectionProjectionFn<State>,
): Disconnector;
export function connect<State, Key extends keyof State>(
  store: ArkStore<State>,
  source$: Observable<Partial<State> | State[Key]>,
  arg?: Key | ConnectionProjectionFn<State>,
): Disconnector {
  let subscription: Subscription;

  if (!arg) {
    subscription = (source$ as Observable<Partial<State>>).pipe(tap(value => store.update(value))).subscribe();
  } else if (typeof arg === 'function') {
    subscription = (source$ as Observable<Partial<State>>)
      .pipe(tap(value => store.update(arg(value, store.getValue()))))
      .subscribe();
  } else {
    subscription = (source$ as Observable<State[Key]>)
      .pipe(
        tap(value => {
          const updateObj: Partial<State> = {};

          updateObj[arg] = value;

          store.update(updateObj);
        }),
      )
      .subscribe();
  }

  store.hooks.addBeforeDestroy(() => subscription.unsubscribe());

  return () => subscription.unsubscribe();
}
