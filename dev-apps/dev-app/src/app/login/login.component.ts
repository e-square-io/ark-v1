import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  angularComponentDestroyer,
  ArkSelectStatus,
  ArkStore,
  createStore,
  HasStatus,
  withStatus,
} from '@e-square/ark';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth/auth.service';

const USERNAME_IS_REQUIRED = 'Username is required.';
const PASSWORD_IS_REQUIRED = 'Password is required.';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'ark-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ArkSelectStatus],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly componentStore = createStore<object, ArkStore<object> & HasStatus>(
    {},
    { destroyer: angularComponentDestroyer },
    withStatus,
  );

  readonly form = new FormGroup<LoginForm>({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private readonly router: Router, private readonly authService: AuthService) {
    this.form?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.componentStore.updateStatus({ status: 'idle' }));
  }

  login(): void {
    if (!this.form) {
      return;
    }

    if (this.form.invalid) {
      const usernameError = this.form.controls.username.errors;
      const passwordError = this.form.controls.password.errors;
      let errorMessage = '';

      if (usernameError && passwordError) {
        errorMessage = `${USERNAME_IS_REQUIRED} ${PASSWORD_IS_REQUIRED}`;
      } else if (usernameError) {
        errorMessage = USERNAME_IS_REQUIRED;
      } else if (passwordError) {
        errorMessage = PASSWORD_IS_REQUIRED;
      }

      this.componentStore.updateStatus({ status: 'error', error: { code: 0, message: errorMessage } });

      return;
    }

    this.componentStore.updateStatus({ status: 'busy' });
    this.authService
      .login(this.form.getRawValue())
      .pipe(
        catchError(err => {
          this.componentStore.updateStatus({ status: 'error', error: { code: 403, message: err.message } });
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.router.navigate(['']));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
