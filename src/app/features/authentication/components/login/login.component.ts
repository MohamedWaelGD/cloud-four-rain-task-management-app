import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ErrorFormTextComponent } from '../../../../shared/components/error-form-text/error-form-text.component';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { ErrorTextComponent } from '../../../../shared/components/error-form-text/components/error-text/error-text.component';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorFormTextComponent,
    ErrorTextComponent,
    RouterLink,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private _auth = inject(AuthenticationService);
  private _router = inject(Router);

  protected formGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });
  protected loading = signal(false);
  protected errorMessage = signal('');

  onLogin() {
    this.errorMessage.set('');
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password } = this.formGroup.value;

    this.loading.set(true);
    this._auth
      .login(email!, password!)
      .then((res) => {
        this._router.navigate(['/dashboard/workspaces']);
        this.loading.set(false);
      })
      .catch((err) => {
        this.errorMessage.set('The email / password is incorrect.');
        this.loading.set(false);
      });
  }
}
