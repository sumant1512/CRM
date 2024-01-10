import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet.component';
import { WalletListComponent } from './wallet-list/wallet-list.component';
import { AddWalletMoneyComponent } from './add-wallet-money/add-wallet-money.component';

const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
    children: [
      { path: '', component: WalletListComponent },
      { path: 'add', component: AddWalletMoneyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
