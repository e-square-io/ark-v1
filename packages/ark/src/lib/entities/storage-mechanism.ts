import { Constructor } from './constructor';
import { StateProvider } from './state-provider';

export type StorageMechanism = 'sessionStorage' | 'localStorage';

export interface StorageOptions<State> {
  storage: StorageMechanism;
  name: string;
  storageRootKey?: string;
  providerBase: Constructor<StateProvider<State>>;
}
