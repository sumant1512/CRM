import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addAdminForm(): FormGroup {
  return new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobileNumber: new FormControl('', [Validators.required]),
    roleId: new FormControl('2'),
    adminId: new FormControl('1'),
  });
}
