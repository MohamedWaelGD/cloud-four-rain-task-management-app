import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const hasUppercase: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return value && /[A-Z]/.test(value) ? null : { missingUppercase: true };
};

export const hasLowercase: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return value && /[a-z]/.test(value) ? null : { missingLowercase: true };
};

export const hasNumber: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return value && /[0-9]/.test(value) ? null : { missingNumber: true };
};

export const hasSpecialChar: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  return value && /[\W_]/.test(value) ? null : { missingSpecial: true };
};

export const hasMinLength = (minLength: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length >= minLength ? null : { tooShort: true };
  };
};
