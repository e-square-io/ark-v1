/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';

function getDependencies(deps?: any[]): any[] {
  return deps?.length ? deps?.map(d => inject(d)) : [];
}

export function attachInitEffect(initEffectFn: (...args: any[]) => void, deps?: any[]): Provider {
  return {
    multi: true,
    provide: ENVIRONMENT_INITIALIZER,
    useValue: (): void => {
      const _deps = getDependencies(deps);

      return initEffectFn(..._deps);
    },
  };
}
