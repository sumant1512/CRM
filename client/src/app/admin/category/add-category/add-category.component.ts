import { Component } from '@angular/core';
import { addCategoryForm } from './add-category.form';
import { CategoryService } from '../category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

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
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenStorageService
  ) {}

  addCategory(): void {
    this.categoryService
      .addCategory({
        ...this.addCategoryForm.value,
        adminId: this.tokenService.getUser().id,
      })
      .subscribe((response) => {
        if (response.status) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      });
  }
}
