import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { Subscription } from 'rxjs';
import { IExpense } from '../expenses.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { CategoryService } from 'src/app/admin/category/category.service';
import { ICategory } from 'src/app/admin/category/category.interface';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  userId!: number;
  categoryId!: number;
  expenseList: Array<IExpense> = [];
  categoryList: Array<ICategory> = [];

  constructor(
    private expenseService: ExpensesService,
    private categoryService: CategoryService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.getCategoryList();
    this.getExpenseList();
  }

  getCategoryList(): void {
    const userInfo = this.tokenService.getUser();
    const adminId = userInfo.roleId === 2 ? userInfo.id : userInfo.adminId;
    this.subscription.add(
      this.categoryService.fetchCategory(adminId).subscribe((response: any) => {
        this.categoryList = response;
      })
    );
  }

  getExpenseList(): void {
    const userInfo = this.tokenService.getUser();
    const adminId = userInfo.roleId === 2 ? userInfo.id : userInfo.adminId;
    this.subscription.add(
      this.expenseService.fetchExpenses(adminId).subscribe((response: any) => {
        this.expenseList = response;
      })
    );
  }

  deleteExpense(expenseId: number): void {
    this.subscription.add(
      this.expenseService
        .deleteExpense(expenseId)
        .subscribe((response: any) => {
          if (response.status) {
            this.getExpenseList();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
