import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DonorService } from '../../../services/donor-service';
import { CategoryService } from '../../../services/category-service';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-gifts-form',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ImageModule,
    ReactiveFormsModule
    , InputNumberModule,
    CheckboxModule,
    CommonModule
    , SelectModule
    , IftaLabelModule
    , FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './gifts-form.html',
  styleUrl: './gifts-form.scss',
})
export class GiftsForm implements OnInit {

  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  donorService = inject(DonorService);
  donors: any[] = [];
  categoryService = inject(CategoryService);
  categories: any[] = [];
  giftForm!: FormGroup;
  previewImage: any = null;
  readonly BASE_IMG_URL = 'https://localhost:7282/images/gifts/';
  readonly BASE_IMG_URL_c = 'https://localhost:7282/images/categories/';

  private cdr = inject(ChangeDetectorRef);
  ngOnInit() {
    this.initForm();
    this.loadDonors();
    this.loadCategories();

    if (this.config.data) {
      this.giftForm.patchValue(this.config.data);

      if (this.config.data.picture && typeof this.config.data.picture === 'string') {
        this.previewImage = this.BASE_IMG_URL + this.config.data.picture;
      }
    }
  }
  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (data) => {
        this.donors = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }


  private initForm() {
    this.giftForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      details: new FormControl(''),
      value: new FormControl(0, [Validators.required, Validators.min(1)]),
      donorId: new FormControl(null, Validators.required),
      categoryId: new FormControl(null, Validators.required),
      is_lottery: new FormControl(false),
      is_approved: new FormControl(false),
      picture: new FormControl('')
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.giftForm.patchValue({ picture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.giftForm.get('picture')?.setValue(null);
    this.previewImage = null;
  }

  save() {
    if (this.giftForm.valid) {
      const result = this.giftForm.value
      this.ref.close(result);
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'נא למלא את כל שדות החובה'
      });
    }
  }

  cancel() {
    this.ref.close();
  }
}