import { FormControl, FormGroup, Validators } from '@angular/forms';

export function addWalletMoneyForm(): FormGroup {
  return new FormGroup({
    walletId: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
  });
}
