import { Constructor } from './constructor';
import { StateProvider } from './state-provider';
import { StatusState } from './status-state';
import { StorageOptions } from './storage-mechanism';

export interface StoreConfiguration<State> {
  provider?: Constructor<StateProvider<State>>;
  withStatus?: boolean | Constructor<StateProvider<StatusState>>;
  /** If set makes store to save it's state into browser storage */
  storage?: StorageOptions;
}
