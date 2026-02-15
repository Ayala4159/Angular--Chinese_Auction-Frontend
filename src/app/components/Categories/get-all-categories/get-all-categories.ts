import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CategoryService } from '../../../services/category-service';
import { Category } from '../../../models/category.model';
import { AsyncPipe } from '@angular/common';
import { CategoriesForm } from '../categories-form/categories-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-get-all-categories',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule],
  providers: [DialogService, MessageService],
  templateUrl: './get-all-categories.html',
  styleUrl: './get-all-categories.scss',
})
export class GetAllCategories {
  categoryService = inject(CategoryService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  private cookieService = inject(CookieService);
  ref: DynamicDialogRef<any> | null = null;
  categories$: any = this.categoryService.getCategories();
  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/categories/';
  user: string = '';
  role: string = '';
  isChildVisible: boolean = false;
  router = inject(Router);

  ngOnInit() {
    this.user = this.cookieService.get('user') || '';
    this.role = this.user ? JSON.parse(this.user).role : '';
  }

  navigateToGifts(categoryId: number) {
    this.router.navigate(['/gifts', categoryId]);
  }
  showChild() {
    this.ref = this.dialogService.open(CategoriesForm, {
      header: 'הוספת קטגוריה חדשה',
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        const obj: Category = { name: result.name, picture: result.picture.name };
        this.categoryService.addCategory(obj, result.picture).subscribe(() => {
          this.categories$ = this.categoryService.getCategories();
          this.messageService.add({ severity: 'success', summary: 'הקטגוריה נוספה בהצלחה', detail: '', life: 3000 });

        }, (error) => {
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: error.error, life: 3000 });
        });
      }
    });
  }
  onEditCategory(id: any) {
    this.categoryService.getCategoryById(id).subscribe((data: any) => {
      this.ref = this.dialogService.open(CategoriesForm, {
        header: 'עריכת קטגוריה',
        width: '30%',
        data: data
      });
      this.ref?.onClose.subscribe((result) => {
        if (result) {
          const file = result.picture == this.IMAGE_BASE_URL + data.Picture ? null : result.picture;
          const obj: Category = { name: result.name, picture: result.picture.name };
          this.categoryService.updateCategory(id, obj, file).subscribe(() => {
            this.categories$ = this.categoryService.getCategories();
            this.messageService.add({ severity: 'success', summary: 'הקטגוריה עודכנה בהצלחה', detail: '', life: 3000 });
          }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: error.error, life: 3000 });
          });
        }
      });
    });
  }
  onDeleteCategory(id: any) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories$ = this.categoryService.getCategories();
      this.messageService.add({ severity: 'success', summary: 'הקטגוריה נמחקה בהצלחה', detail: '', life: 3000 });
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: error.error, life: 3000 });
    });
  }

}


