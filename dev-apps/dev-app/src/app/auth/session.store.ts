import { Injectable } from '@angular/core';
import { Store, RxjsStateWithStorageProvider } from '@groupp/ark';

import { User } from './user';

export interface SessionState {
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends Store<SessionState>({
  provider: RxjsStateWithStorageProvider({ storage: 'localStorage', name: 'SessionStore' }),
}) {
  // constructor() {
  //   super(undefined, { storage: 'localStorage' });
  // }
}
