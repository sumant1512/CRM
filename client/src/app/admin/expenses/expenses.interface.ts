export interface IAddExpenseRequestBody {
  expenseName: string;
  adminId: number;
}

export interface IExpense {
  id: number;
  expenseName: string;
  createdAt: string;
  modifiedAt: string;
}
