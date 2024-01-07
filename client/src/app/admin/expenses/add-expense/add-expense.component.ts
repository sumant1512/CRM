import { Component, OnDestroy, OnInit } from '@angular/core';
import { addExpenseForm } from './add-expense.form';
import { ICategory } from '../../category/category.interface';
import { CategoryService } from '../../category/category.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ExpensesService } from '../expenses.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  addExpenseForm = addExpenseForm();
  categoryList: Array<ICategory> = [];

  constructor(
    private expenseService: ExpensesService,
    private categoryService: CategoryService,
    private tokenService: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

  addExpense() {
    const userInfo = this.tokenService.getUser();
    const addExpenseBody = {
      ...this.addExpenseForm.value,
      adminId: userInfo.roleId === 2 ? userInfo.id : userInfo.adminId,
      userId: userInfo.id,
    };
    this.subscription.add(
      this.expenseService.addExpense(addExpenseBody).subscribe((response) => {
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
