import { ArkStoreModifier } from '../entities/hooks';
import { injetcViewRef } from './inject-view-ref';

export function withAngularChangeDetection<State>(): ArkStoreModifier<State> {
  const viewRef = injetcViewRef();

  return () => ({
    afterUpdate: [() => viewRef.markForCheck()],
  });
}
