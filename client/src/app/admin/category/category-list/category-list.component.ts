import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../category.service';
import { ICategory } from '../category.interface';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  categoryList: Array<ICategory> = [];

  constructor(
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

  deleteCategory(categoryId: number): void {
    this.subscription.add(
      this.categoryService.deleteCategory(categoryId).subscribe((response) => {
        if (response.status) {
          this.getCategoryList();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
