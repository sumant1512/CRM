import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addExpenseForm(): FormGroup {
  return new FormGroup({
    description: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });
}
