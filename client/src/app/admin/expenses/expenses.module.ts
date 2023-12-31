import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';

@NgModule({
  declarations: [ExpensesComponent, ExpenseListComponent, AddExpenseComponent],
  imports: [CommonModule, ExpensesRoutingModule],
})
export class ExpensesModule {}
