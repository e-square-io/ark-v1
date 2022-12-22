import { StoreMock, createStoreMock } from '@e-square/ark/testing';
import { Observable, ReplaySubject } from 'rxjs';

import { SessionStore, SessionState } from '../src/app/auth/session.store';
import { User } from '../src/app/auth/user';

type SessionStoreMock = StoreMock<SessionState> &
  Partial<Record<keyof SessionStore, jest.Mock | Observable<any> | SessionState>>;
export function createSessionStoreMock(): SessionStoreMock {
  return {
    ...createStoreMock({}),
    user$: new ReplaySubject<User>(),
  };
}
