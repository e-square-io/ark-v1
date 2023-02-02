import { injetcViewRef } from './inject-view-ref';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function angularComponentDestroyer(): (cb: () => any) => void {
  const viewRef = injetcViewRef();

  return cb => {
    setTimeout(() => viewRef?.onDestroy(() => cb()), 0);
  };
}
