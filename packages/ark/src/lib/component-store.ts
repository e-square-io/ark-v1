import { Inject, Injectable, Optional } from '@angular/core';

import {
  DefaultError,
  DefaultState,
  INITIAL_STATE,
  INITIAL_STATUS_STATE,
  Status,
  StatusState,
  StoreOptions,
  STORE_OPTIONS,
} from './entities';
import { Store } from './store';

@Injectable()
export class ComponentStore<State = DefaultState, S = Status, E = DefaultError> extends Store<State, S, E> {
  constructor(
    @Optional() @Inject(INITIAL_STATE) protected override readonly initialState?: State,
    @Optional() @Inject(STORE_OPTIONS) protected override readonly options?: StoreOptions,
    @Optional() @Inject(INITIAL_STATUS_STATE) protected override readonly initialStatusState?: StatusState<S, E>,
  ) {
    super(initialState, options, initialStatusState);
  }
}
