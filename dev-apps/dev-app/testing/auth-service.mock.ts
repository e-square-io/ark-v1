import { of } from 'rxjs';

import { AuthService } from '../src/app/auth/auth.service';

type AuthServiceMock = Partial<Record<keyof AuthService, jest.Mock>>;
export function createAuthServiceMock(): AuthServiceMock {
  return {
    login: jest.fn(() => of({ username: 'DUMMY_USER' })),
    logout: jest.fn(),
  };
}
