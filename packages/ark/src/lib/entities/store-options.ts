import { InjectionToken } from '@angular/core';

import { StorageMechanism } from './storage-mechanism';

export interface StoreOptions {
  name?: string;

  /** If set makes store to save it's state into browser storage */
  storage?: StorageMechanism;
  storageRootKey?: string;
}

export const STORE_OPTIONS = new InjectionToken<StoreOptions>('STORE_OPTIONS');
