import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addCategoryForm(): FormGroup {
  return new FormGroup({
    categoryName: new FormControl('', [Validators.required]),
  });
}
