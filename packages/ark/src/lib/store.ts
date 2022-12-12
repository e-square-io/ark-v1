import { ArkStore, StoreConfiguration } from './entities';
import { mixinStore, StoreConstructor } from './mixins';
import { RxjsStateProvider, RxjsStatusProvider } from './providers';

/**
 * Abstraction to extend to create the store
 * @param config Store class configuration
 * @returns Store class
 */
export function Store<State>(config?: StoreConfiguration<State>): StoreConstructor<State> {
  const stateProvider = config?.provider ? config.provider : RxjsStateProvider<State>;
  const statusProvider = config?.withStatus
    ? typeof config.withStatus === 'boolean'
      ? RxjsStatusProvider
      : config.withStatus
    : undefined;
  return mixinStore<State>(stateProvider, statusProvider);
}

export function createStore<State>(initialState?: State, config?: StoreConfiguration<State>): ArkStore<State> {
  const store = Store<State>(config);

  return new store(initialState);
}
