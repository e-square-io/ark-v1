import { Injectable } from '@angular/core';
import { Store, StateWithStorageProvider, RxjsStateProvider } from '@e-square/ark';

import { User } from './user';

export interface SessionState {
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends Store<SessionState>({
  provider: StateWithStorageProvider({
    storage: 'localStorage',
    name: 'SessionStore',
    providerBase: RxjsStateProvider,
  }),
}) {
  readonly user$ = this.select('user');
}
