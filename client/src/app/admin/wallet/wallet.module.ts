import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';
import { WalletListComponent } from './wallet-list/wallet-list.component';
import { AddWalletMoneyComponent } from './add-wallet-money/add-wallet-money.component';

@NgModule({
  declarations: [WalletComponent, WalletListComponent, AddWalletMoneyComponent],
  imports: [CommonModule, WalletRoutingModule],
})
export class WalletModule {}
