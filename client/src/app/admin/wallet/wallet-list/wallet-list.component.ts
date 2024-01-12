import { Component, OnDestroy, OnInit } from '@angular/core';
import { IWallet } from '../wallet.interface';
import { Subscription } from 'rxjs';
import { WalletService } from '../wallet.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
})
export class WalletListComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  userId!: number;
  categoryId!: number;
  walletList: Array<IWallet> = [];

  constructor(
    private walletService: WalletService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.getWalletList();
  }

  getWalletList(): void {
    const adminId = this.tokenService.getUser().id;
    this.subscription.add(
      this.walletService.fetchWallets(adminId).subscribe((response: any) => {
        this.walletList = response;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
