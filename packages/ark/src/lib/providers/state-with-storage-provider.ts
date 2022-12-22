import { StateProviderConstructor, StateProvider, StorageOptions, StorageMechanism } from '../entities';

function tryGetStorage(storage: StorageMechanism): Storage | undefined {
  try {
    return typeof window[storage] !== 'undefined' ? window[storage] : undefined;
  } catch {
    return undefined;
  }
}

const DEFAULT_STORAGE_ROOT_KEY = '__ark';

/**
 * State provider that keeps its state in browser storage.
 * @param options Browser storage configuration.
 */
export function StateWithStorageProvider<State>(options: StorageOptions<State>): StateProviderConstructor<State> {
  const providerBase = options.providerBase;

  return class extends providerBase implements StateProvider<State> {
    private storage = tryGetStorage(options.storage);

    constructor(initialState: State) {
      super(initialState);
      const storageValue = this.readStorage()?.[options.name];
      storageValue && super.setState({ ...this.state, ...storageValue });
    }

    override setState(state: State): void {
      super.setState(state);
      this.updateStorage();
    }

    protected updateStorage(): void {
      if (!options.storage || !this.storage) {
        return;
      }

      let storageValue = this.readStorage();
      storageValue = storageValue ? storageValue : {};

      storageValue[options.name] = { ...this.state };
      this.storage.setItem(this.getRootKey(), JSON.stringify(storageValue));
    }

    protected readStorage(): Record<string, Partial<State>> | null {
      if (!options.storage || !this.storage) {
        return null;
      }

      const value = this.storage.getItem(this.getRootKey());

      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      }

      return null;
    }

    protected getRootKey(): string {
      return options.storageRootKey || DEFAULT_STORAGE_ROOT_KEY;
    }
  };
}
