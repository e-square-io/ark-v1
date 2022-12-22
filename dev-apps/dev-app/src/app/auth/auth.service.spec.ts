import { TestBed } from '@angular/core/testing';

import { createSessionStoreMock } from '../../../testing';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SessionStore, useValue: createSessionStoreMock() }],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
