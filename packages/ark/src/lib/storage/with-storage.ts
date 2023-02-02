import { ArkStoreModifier } from '../entities/hooks';
import { StorageOptions } from './storage-mechanism';
import { StorageService } from './storage.service';

export function withStorage<State>(options: StorageOptions): ArkStoreModifier<State> {
  const storageService = new StorageService<State>(options);

  return () => ({
    beforeInit: [
      initialState => {
        const valueInStorage = storageService.readStorage()?.[options.name];

        if (!valueInStorage) {
          return initialState;
        }

        return { ...initialState, ...valueInStorage };
      },
    ],
    afterUpdate: [state => storageService.updateStorage(state)],
  });
}
