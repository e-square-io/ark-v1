/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArkStore, ArkStoreExtender, StoreConstructor, StoreOptions } from './entities';
import { mixinStore } from './mixins';

/**
 * Abstraction to extend to create the store
 * @param config Store class configuration
 * @returns Store class
 */
export function Store<State, S extends ArkStore<State> = ArkStore<State>>(
  ...extender: ArkStoreExtender<any, any>[]
): StoreConstructor<State, S> {
  let store = mixinStore<State>();
  for (const ext of extender) {
    store = ext()(store);
  }
  return store as StoreConstructor<State, S>;
}

/**
 * Create store of `State` local instance. Use it inside the components
 * for local component store or view model. This instance won't be added
 * to `injector`, so you won't be able to inject it in child components.
 */
export function createStore<State, S extends ArkStore<State> = ArkStore<State>>(
  initialState: State,
  options?: StoreOptions<State>,
  ...extender: ArkStoreExtender<any, any>[]
): S {
  const storeConstructor = Store<State, S>(...extender);
  return new storeConstructor(initialState, options);
}

/**
 * Lets you add a state variable to your component.
 *
 * @example
 * const [books, setBooks] = useArkState<Book[]>([]);
 */
export function useArkState<State, S extends ArkStore<State> = ArkStore<State>>(
  initialState: State,
  options?: StoreOptions<State>,
): [() => State, (state: State) => void, S] {
  const store = createStore<State, S>(initialState, options);

  return [store.getValue.bind(store), store.update.bind(store), store];
}
