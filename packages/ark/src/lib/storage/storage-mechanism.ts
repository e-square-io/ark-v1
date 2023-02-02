export type StorageMechanism = 'sessionStorage' | 'localStorage';

export interface StorageOptions {
  storage: StorageMechanism;
  name: string;
  storageRootKey?: string;
}
