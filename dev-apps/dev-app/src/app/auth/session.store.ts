import { Injectable } from '@angular/core';
import { select, Store, withStorage } from '@e-square/ark';

import { User } from './user';

export interface SessionState {
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class SessionStore extends Store<SessionState>() {
  readonly user$ = select(this, 'user');

  constructor() {
    super({}, { modifiers: [withStorage<SessionState>({ name: SessionStore.name, storage: 'localStorage' })] });
  }
}
