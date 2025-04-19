import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { ErrorTextComponent } from '../../../../shared/components/error-form-text/components/error-text/error-text.component';
import { ErrorFormTextComponent } from '../../../../shared/components/error-form-text/error-form-text.component';
import { hasLowercase, hasMinLength, hasNumber, hasSpecialChar, hasUppercase } from '../../../../core/classes/form-validations';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ErrorFormTextComponent,
    ErrorTextComponent,
    RouterLink,
    PasswordModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _auth = inject(AuthenticationService);
  private _router = inject(Router);

  protected formGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, hasUppercase, hasLowercase, hasMinLength(8), hasNumber, hasSpecialChar]),
    displayName: new FormControl<string>('', [Validators.required]),
  });
  protected loading = signal(false);
  protected errorMessage = signal('');

  onRegister() {
    this.errorMessage.set('');
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password, displayName } = this.formGroup.value;

    this.loading.set(true);
    this._auth
      .register(email!, password!, displayName!)
      .then((res) => {
        this._router.navigate(['/dashboard/workspaces']);
        this.loading.set(false);
      })
      .catch((err: HttpErrorResponse) => {
        if (err.error.message === 'EMAIL_EXISTS') {
          this.errorMessage.set('Email already exists. Please use another one.');
        } else if (err.error.message === 'INVALID_EMAIL') {
          this.errorMessage.set('Invalid email. Please enter a valid email address.');
        } else {
          this.errorMessage.set('Please enter valid info.');
        }
        this.loading.set(false);
      });
  }
}
