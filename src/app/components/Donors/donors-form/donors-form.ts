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
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-donors-form',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ImageModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './donors-form.html',
  styleUrl: './donors-form.scss',
})
export class DonorsForm implements OnInit {
  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  checked: any = null;
  donorForm!: FormGroup;
  previewImage: any = null;
  readonly BASE_IMG_URL = 'https://localhost:7282/images/companies/';

  ngOnInit() {
    this.initForm();

    if (this.config.data) {
      this.donorForm.patchValue(this.config.data);
      if (this.config.data.company_picture) {
        this.previewImage = this.BASE_IMG_URL + this.config.data.company_picture;
      }
    }
  }

  private initForm() {
    this.donorForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      is_published: new FormControl(false),
      company_name: new FormControl('', [Validators.minLength(2)]),
      company_description: new FormControl('', [ Validators.minLength(10)]),
      company_picture: new FormControl(null)
    });
  }
  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.donorForm.patchValue({ company_picture: file });
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onFileRemove(fileUpload: any) {
    if (fileUpload) {
      fileUpload.clear();
    }
    this.donorForm.get('company_picture')?.setValue(null); // שינוי כאן
    this.previewImage = null;
  }
  save() {
    if (this.donorForm.valid) {
      const result = this.donorForm.value
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