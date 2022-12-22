import { Constructor } from './constructor';
import { StateProvider } from './state-provider';
import { StatusState } from './status-state';

/**
 * Configuration of the store class construction.
 */
export interface StoreConfiguration<State> {
  /**
   * State provider, you want to use by the store.
   * State provider is a class that implements `StateProvider`
   * interface.
   * Feel free to use one supplied by the library or create your own.
   */
  provider?: Constructor<StateProvider<State>>;

  /**
   * Set it if you want the store to have the status state.
   * You can set it to `true` or custom status state provider.
   */
  withStatus?: boolean | Constructor<StateProvider<StatusState>>;
}
