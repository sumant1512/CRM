import { Pipe, PipeTransform } from '@angular/core';
import { IExpense } from '../admin/expenses/expenses.interface';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(expenseList: Array<IExpense>, searchId: number): Array<IExpense> {
    if (!expenseList) return [];
    if (!searchId) return expenseList;
    const intSearchId = parseInt(searchId.toString());

    let initialRestaurantList: Array<IExpense> = [];
    expenseList.forEach((expense) => {
      if (expense.categoryId === intSearchId) {
        initialRestaurantList.push(expense);
      }
    });
    return initialRestaurantList;
  }
}
