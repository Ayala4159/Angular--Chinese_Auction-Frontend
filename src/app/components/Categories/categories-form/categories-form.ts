import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ImageModule,
    ReactiveFormsModule
  ],
  providers: [MessageService],
  templateUrl: './categories-form.html',
  styleUrl: './categories-form.scss',
})
export class CategoriesForm implements OnInit {
  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  categoryForm!: FormGroup;
  previewImage: any = null;
  readonly BASE_IMG_URL = 'https://localhost:7282/images/categories/';

  ngOnInit() {
    this.initForm();

    if (this.config.data) {
      this.categoryForm.patchValue(this.config.data);
      if (this.config.data.picture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.picture;
      }
    }
  }

  private initForm() {
    this.categoryForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      picture: new FormControl(null, Validators.required)
    });
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.categoryForm.patchValue({ picture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.categoryForm.get('picture')?.setValue(null);
    this.previewImage = null;
  }

  save() {
    if (this.categoryForm.valid) {
      const result = this.categoryForm.value      
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