import { ArkStore, StatusState, StoreConfiguration } from './entities';
import { mixinStore, StoreConstructor } from './mixins';
import { RxjsStateProvider, StatusProvider } from './providers';

/**
 * Abstraction to extend to create the store
 * @param config Store class configuration
 * @returns Store class
 */
export function Store<State>(config?: StoreConfiguration<State>): StoreConstructor<State> {
  const stateProvider = config?.provider ? config.provider : RxjsStateProvider<State>;
  const statusProvider = config?.withStatus
    ? typeof config.withStatus === 'boolean'
      ? StatusProvider<StatusState>({ providerBase: RxjsStateProvider<StatusState> })
      : config.withStatus
    : undefined;
  return mixinStore<State>(stateProvider, statusProvider);
}

/**
 * Create store of `State` local instance. Use it inside the components
 * for local component store or view model. This instance won't be added
 * to `injector`, so I won't be able to inject it in child components.
 */
export function createStore<State>(initialState: State, config?: StoreConfiguration<State>): ArkStore<State> {
  const store = Store<State>(config);

  return new store(initialState);
}
