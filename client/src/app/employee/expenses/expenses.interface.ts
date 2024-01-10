export interface IAddExpenseRequestBody {
  description: string;
  categoryId: number;
  userId: number;
  adminId: number;
  expenseAmount: string;
}

export interface IExpense extends IAddExpenseRequestBody {
  id: number;
  categoryName: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  modifiedAt: string;
}
