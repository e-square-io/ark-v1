import { inject, Injector } from '@angular/core';

import { ComponentStore } from '../component-store';
import {
  DefaultError,
  DefaultState,
  INITIAL_STATE,
  INITIAL_STATUS_STATE,
  Status,
  StatusState,
  StoreOptions,
  STORE_OPTIONS,
} from '../entities';

export function createComponentStore<State = DefaultState, S = Status, E = DefaultError>(
  initialState?: State,
  options?: StoreOptions,
  initialStatusState?: StatusState<S, E>,
): ComponentStore<State> {
  const injector = Injector.create({
    providers: [
      { provide: INITIAL_STATE, useValue: initialState },
      { provide: STORE_OPTIONS, useValue: options },
      { provide: INITIAL_STATUS_STATE, useValue: initialStatusState },
      { provide: ComponentStore, useClass: ComponentStore },
    ],
    parent: inject(Injector),
  });
  return injector.get(ComponentStore);
}
