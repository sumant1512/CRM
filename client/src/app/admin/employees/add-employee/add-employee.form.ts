import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addEmployeeForm(): FormGroup {
  return new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobileNumber: new FormControl('', [Validators.required]),
    roleId: new FormControl('3'),
  });
}
