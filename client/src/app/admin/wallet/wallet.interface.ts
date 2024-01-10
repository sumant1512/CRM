export interface IAddWalletMoneyRequestBody {
  userId: number;
  amount: number;
}

export interface IWallet extends IAddWalletMoneyRequestBody {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}
