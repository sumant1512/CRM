import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

export function resetPasswordForm(): FormGroup {
  return new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMatchValidator,
    }
  );
}

function passwordMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}

export function loginForm(): FormGroup {
  return new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
}
