import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CategoryService } from '../../../services/category-service';
import { Observable } from 'rxjs';
import { GetCategory } from '../../../models/category.model';
import { AsyncPipe } from '@angular/common';
import { CategoriesForm } from '../categories-form/categories-form';


@Component({
  selector: 'app-get-all-categories',
  imports: [ButtonModule, CardModule,AsyncPipe,CategoriesForm],
  templateUrl: './get-all-categories.html',
  styleUrl: './get-all-categories.scss',
})
export class GetAllCategories {
  categoryService = inject(CategoryService);
  categories$:any= this.categoryService.getCategories();
  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/';
  user:string=localStorage.getItem('user')||'';
  role:string=this.user? JSON.parse(this.user).role : '';
  isChildVisible: boolean = false;

  showChild() {
    this.isChildVisible = true;
  }
  onEditCategory(categoryId:number){
    console.log('Edit category with ID:', categoryId);
  }

}


