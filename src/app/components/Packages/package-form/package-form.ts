import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ImageModule,
    ReactiveFormsModule,
    InputNumberModule
  ],
  providers: [MessageService],
  templateUrl: './package-form.html',
  styleUrl: './package-form.scss',
})
export class PackageForm implements OnInit {
  private messageService = inject(MessageService);
  private ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  packageForm!: FormGroup;


  ngOnInit() {
    this.initForm();
    if (this.config.data) {
      this.packageForm.patchValue(this.config.data);
    }
  }




  private initForm() {
    this.packageForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      numOfCards: new FormControl(null, [Validators.required, Validators.min(1)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }




  save() {
    if (this.packageForm.valid) {
      const result = this.packageForm.value
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







