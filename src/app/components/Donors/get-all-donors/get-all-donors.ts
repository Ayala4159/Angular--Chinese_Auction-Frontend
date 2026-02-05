import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DonorService } from '../../../services/donor-service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DonorsForm } from '../donors-form/donors-form'; // הקומפוננטה הקיימת שלכן
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-get-all-donors',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, ToastModule,
    ToolbarModule, DialogModule, ConfirmDialogModule, InputTextModule,
    TagModule, DynamicDialogModule
  ],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './get-all-donors.html',
  styleUrl: './get-all-donors.scss'
})
export class GetAllDonors implements OnInit {
  private donorService = inject(DonorService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private cdr = inject(ChangeDetectorRef);

  donors: any[] = [];
  donor: any = {};
  donorDialog: boolean = false; // עבור עריכה
  ref: DynamicDialogRef | null = null; // עבור הדיאלוג הדינמי שלכן

  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/companies/';

  ngOnInit() {
    this.loadDonors();
  }

  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (data) => {
        this.donors = data;
        this.cdr.detectChanges(); // השורה הזו מעלימה את השגיאה
      },
      error: (err) => console.error(err)
    });
  }
  // פתיחת הקומפוננטה הקיימת שלכן להוספת תורם
  showChild() {
    this.ref = this.dialogService.open(DonorsForm, {
      header: 'הוספת תורם חדש',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        // כאן משתמשים ב-Service שלכן לשליחת FormData
        this.donorService.addDonor(result, result.company_picture).subscribe({
          next: () => {
            this.loadDonors();
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף למערכת' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error });
          }
        });
      }
    });
  }

  // עריכה מהירה בתוך הטבלה (באמצעות p-dialog)
  editDonor(donor: any) {
    this.donor = { ...donor };
    this.donorDialog = true;
  }

  saveDonor() {
    if (this.donor.Id) {
      this.donorService.updateDonor(this.donor.Id, this.donor).subscribe(() => {
        this.loadDonors();
        this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו' });
        this.donorDialog = false;
      });
    }
  }

  deleteDonor(donor: any) {
    this.confirmationService.confirm({
      message: `האם למחוק את ${donor.First_Name}?`,
      header: 'אישור מחיקה',
      accept: () => {
        this.donorService.deleteDonor(donor.Id).subscribe(() => {
          this.donors = this.donors.filter(d => d.Id !== donor.Id);
          this.messageService.add({ severity: 'success', summary: 'נמחק', detail: 'התורם הוסר' });
        });
      }
    });
  }
}