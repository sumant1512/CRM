import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { Subscription } from 'rxjs';
import { IExpense } from '../expenses.interface';
import { CategoryService } from '../../category/category.service';
import { ICategory } from '../../category/category.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {
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
  }

  getCategoryList(): void {
    const adminId = this.tokenService.getUser().id;
    this.subscription.add(
      this.categoryService.fetchCategory(adminId).subscribe((response: any) => {
        this.categoryList = response;
      })
    );
  }
}
