import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DonorService } from '../../../services/donor-service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DonorsForm } from '../donors-form/donors-form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { GiftsForm } from '../../Gifts/gifts-form/gifts-form';
import { GiftService } from '../../../services/gift-service';

@Component({
  selector: 'app-get-all-donors',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, ToastModule,
    ToolbarModule, DialogModule, ConfirmDialogModule, InputTextModule,
    TagModule, DynamicDialogModule, RatingModule, RippleModule
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
  private giftService = inject(GiftService);
  expandedRows: any = {};
  donors: any[] = [];
  donor: any = {};
  ref: DynamicDialogRef | null = null;

  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/companies/';
  readonly IMAGE_BASE_URL_GIFT = 'https://localhost:7282/images/gifts/';

  ngOnInit() {
    this.loadDonors();

  }

  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (data) => {
        this.donors = data;
        this.cdr.detectChanges();
        console.log(this.donors);

      },
      error: (err) => console.error(err)
    });
  }
  showChild() {
    this.ref = this.dialogService.open(DonorsForm, {
      header: 'הוספת תורם חדש',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.donorService.addDonor(result, result.company_picture).subscribe({
          next: (newDonor) => {
            const index = this.donors.findIndex(d => d.id === this.donor.id);
            if (index !== -1) {
              this.donors[index] = newDonor; this.donors = [...this.donors];
            }
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו בהצלחה' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
          }
        });
      }
    });
  }
  editDonor(donor: any) {
    this.ref = this.dialogService.open(DonorsForm, {
      header: 'עריכת תורם',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: donor
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.donorService.updateDonor(donor.id, result, result.company_picture).subscribe({
          next: (newDonor) => {
            const index = this.donors.findIndex(d => d.id === donor.id);
            if (index !== -1) {
              this.donors[index] = newDonor; this.donors = [...this.donors];
            }
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו בהצלחה' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
          }
        });
      }
    });
  }

  deleteDonor(donor: any) {
    this.confirmationService.confirm({
      message: `האם למחוק את ${donor.First_Name}?`,
      header: 'אישור מחיקה',
      accept: () => {
        this.donorService.deleteDonor(donor.id).subscribe(() => {
          this.donors = this.donors.filter(d => d.id !== donor.id);
          this.messageService.add({ severity: 'success', summary: 'נמחק', detail: 'התורם הוסר' });
        });
      }
    });
  }
  expandAll() {
    this.expandedRows = this.donors.reduce((acc, p) => (acc[p.id] = true) && acc, {});
  }
  collapseAll() {
    this.expandedRows = {};
  }
  onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }
  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({
      severity: 'success',
      summary: 'Product Collapsed',
      detail: event.data.name,
      life: 3000
    });
  }
  addGift(donor: any) {
    this.ref = this.dialogService.open(GiftsForm, {
      header: 'הוספת מתנה חדשה',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { donorId: donor.id }
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.giftService.addGift(result, result.picture).subscribe({
          next: (newGift) => {
            const index = this.donors.findIndex(d => d.id === donor.id);
            if (index !== -1) {
              this.donors[index].donations.push(newGift);
              this.donors = [...this.donors];
            }
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'המתנה נוספה בהצלחה' });
          }
        });
      }
    });

  }


  editGift(gift: any) {
    this.ref = this.dialogService.open(GiftsForm, {
      header: 'עריכת מתנה',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: gift
    });
    this.ref?.onClose.subscribe((result) => {
      console.log(result);
      if (result) {
        this.giftService.updateGift(gift.id, result, result.picture).subscribe({
          next: (updatedGift) => {
            this.donors = this.donors.map(donor => {
              if (donor.id === gift.donorId) {
                return {
                  ...donor,
                  donations: donor.donations.map((g: any) => g.id === gift.id ? updatedGift : g)
                };
              }
              return donor;
            });
            this.cdr.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו בהצלחה' });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
          }
        });
      }
    });
  }

}