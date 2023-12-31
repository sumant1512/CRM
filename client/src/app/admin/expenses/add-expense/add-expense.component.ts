import { Component } from '@angular/core';
import { addExpenseForm } from './add-expense.form';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent {
  addExpenseForm = addExpenseForm();
  addExpense(): void {}
}
