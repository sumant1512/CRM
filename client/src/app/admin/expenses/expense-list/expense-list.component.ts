import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { Subscription } from 'rxjs';
import { IExpense } from '../expenses.interface';

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

  constructor(private expenseService: ExpensesService) {}

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList(): void {
    this.subscription.add(
      this.expenseService.fetchExpenses().subscribe((response: any) => {
        this.expenseList = response;
        console.log(this.expenseList);
      })
    );
  }
}
