import { Injectable } from '@angular/core';
import { of, delay, switchMap, Observable, throwError, tap } from 'rxjs';

import { SessionStore } from './session.store';
import { User } from './user';

export interface LoginModel {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly sessionStore: SessionStore) {}

  login(loginModel: LoginModel): Observable<User> {
    return of(loginModel).pipe(
      delay(1000),
      switchMap(({ username, password }) =>
        password === '123' ? of({ username }) : throwError(() => new Error('Unauthorized')),
      ),
      tap(user => this.sessionStore.update({ user })),
    );
  }

  logout(): void {
    this.sessionStore.reset();
  }
}
