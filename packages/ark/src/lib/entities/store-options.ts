import { ArkStoreDestroyer } from './ark-store';
import { ArkStoreModifier, HasHooks } from './hooks';

export interface StoreOptions<State = unknown> extends HasHooks<State> {
  name?: string;
  modifiers?: ArkStoreModifier<State>[];
  destroyer?: ArkStoreDestroyer;
}
