import { Component } from '@angular/core';
import { addWalletMoneyForm } from './add-wallet-money.form';
import { Subscription } from 'rxjs';
import { WalletService } from '../wallet.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../employees/employee.service';
import { IEmployees } from '../../employees/employee.interface';

@Component({
  selector: 'app-add-wallet-money',
  templateUrl: './add-wallet-money.component.html',
  styleUrls: ['./add-wallet-money.component.scss'],
})
export class AddWalletMoneyComponent {
  subscription = new Subscription();
  addWalletMoneyForm = addWalletMoneyForm();
  employeeList: Array<IEmployees> = [];

  constructor(
    private walletService: WalletService,
    private employeeService: EmployeeService,
    private tokenService: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (history?.state?.walletId) {
      this.addWalletMoneyForm.patchValue({ walletId: history.state.walletId });
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
  }

  addMoneyToWallet() {
    const userInfo = this.tokenService.getUser();
    const addMoneyToWalletBody = {
      ...this.addWalletMoneyForm.value,
      adminId: userInfo.roleId === 2 ? userInfo.id : userInfo.adminId,
    };
    this.subscription.add(
      this.walletService
        .addMoneyToWallet(addMoneyToWalletBody)
        .subscribe((response) => {
          if (response.status) {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
