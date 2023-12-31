import { Component } from '@angular/core';
import { addCategoryForm } from './add-category.form';
import { CategoryService } from '../category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent {
  addCategoryForm = addCategoryForm();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  addCategory(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    // this.categoryService
    //   .addCategory(this.addCategoryForm.value)
    //   .subscribe((response) => {
    //         this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    //   });
  }
}
