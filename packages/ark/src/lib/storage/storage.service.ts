import { StorageMechanism, StorageOptions } from './storage-mechanism';

function tryGetStorage(storage: StorageMechanism): Storage | undefined {
  try {
    return typeof window[storage] !== 'undefined' ? window[storage] : undefined;
  } catch {
    return undefined;
  }
}

const DEFAULT_STORAGE_ROOT_KEY = '__ark';

export class StorageService<State> {
  private storage = tryGetStorage(this.options.storage);

  constructor(private readonly options: StorageOptions) {}

  updateStorage(state: State): void {
    if (!this.options.storage || !this.storage) {
      return;
    }

    let storageValue = this.readStorage();
    storageValue = storageValue ? storageValue : {};

    storageValue[this.options.name] = { ...state };
    this.storage.setItem(this.getRootKey(), JSON.stringify(storageValue));
  }

  readStorage(): Record<string, Partial<State>> | null {
    if (!this.options.storage || !this.storage) {
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

  private getRootKey(): string {
    return this.options.storageRootKey || DEFAULT_STORAGE_ROOT_KEY;
  }
}
