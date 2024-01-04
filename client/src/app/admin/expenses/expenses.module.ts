import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExpensesComponent, ExpenseListComponent, AddExpenseComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ExpensesModule {}
