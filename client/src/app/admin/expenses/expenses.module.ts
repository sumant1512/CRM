import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ExpensesComponent, ExpenseListComponent, AddExpenseComponent],
  imports: [ExpensesRoutingModule, SharedModule],
})
export class ExpensesModule {}
