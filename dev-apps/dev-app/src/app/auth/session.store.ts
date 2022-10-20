import { Injectable } from '@angular/core';
import { Store } from '@groupp/ark';

import { User } from './user';

export interface SessionState {
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(undefined, { storage: 'localStorage' });
  }
}
