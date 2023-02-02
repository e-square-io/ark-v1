import { ArkStore, ArkStoreExtension, Constructor } from '../entities';
import { HasStatus } from './entities';
import { mixinStatus } from './status.mixin';

export function withStatus<
  T extends Constructor<ArkStore<unknown>> = Constructor<ArkStore<unknown>>,
>(): ArkStoreExtension<T, HasStatus> {
  return (store: T) => {
    return mixinStatus<T>(store);
  };
}
