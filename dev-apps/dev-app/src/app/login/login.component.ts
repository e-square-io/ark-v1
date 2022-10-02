import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'ark-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly form = new FormGroup<LoginForm>({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(private readonly authService: AuthService) {}

  login(): void {
    if (this.form.invalid) {
      const usernameError = this.form.controls.username.errors;
      const passwordError = this.form.controls.password.errors;

      console.log(usernameError, passwordError);
      return;
    }

    console.log(this.form.value);
  }
}
