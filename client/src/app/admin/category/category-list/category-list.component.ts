import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { ICategory } from '../category.interface';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  subscription = new Subscription();
  categoryList: Array<ICategory> = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList(): void {
    this.subscription.add(
      this.categoryService.fetchCategory().subscribe((response: any) => {
        this.categoryList = response;
        console.log(this.categoryList);
      })
    );
  }
}
