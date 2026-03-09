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
import { CreateDonor, ManagerGetDonor } from '../../../models/donor.model';
import { GetGift } from '../../../models/gift.model';

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

  expandedRows: { [key: number]: boolean } = {};
  donors: ManagerGetDonor[] = [];
  filteredDonorsList: ManagerGetDonor[] = [];
  filterText: string = '';
  filterType: string = 'name';
  isFilterOpen: boolean = false;
  donor: Partial<ManagerGetDonor> = {};
  donorDialog: boolean = false;
  ref: DynamicDialogRef | null = null;


  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/companies/';
  readonly IMAGE_BASE_URL_GIFT = 'https://localhost:7282/images/gifts/';

  ngOnInit() {
    this.loadDonors();

  }
  toggleFilterPanel() {
    this.isFilterOpen = !this.isFilterOpen;
  }
  closeFilterPanel() {
    this.isFilterOpen = false;
  }
  setFilterType(type: string) {
    this.filterType = type;
  }

  loadDonors() {
    this.donorService.getDonors().subscribe({
      next: (data: ManagerGetDonor[]) => {
        this.donors = data;
        this.filteredDonorsList = data;
        this.cdr.detectChanges();
        console.log(this.donors);
        console.log(this.filteredDonorsList);


      },
      error: (err) => {
        console.error('Error loading donors:', err);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בטעינת התורמים' });
      }
    });
  }


  onFilterChange() {
    const q = (this.filterText || '').trim();
    if (!q) {
      this.filteredDonorsList = this.donors;
      this.cdr.detectChanges();
      return;
    }


    let name: string | undefined;
    let email: string | undefined;
    let giftName: string | undefined;


    if (this.filterType === 'name') {
      name = q;
    } else if (this.filterType === 'email') {
      email = q;
    } else if (this.filterType === 'gift') {
      giftName = q;
    }


    this.donorService.getFilteredDonors(name, email, giftName).subscribe({
      next: (data: ManagerGetDonor[]) => {
        this.filteredDonorsList = data;
        console.log('filter results:', this.filteredDonorsList);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('filter error', err);
        this.filteredDonorsList = this.localFilter(q);
        this.cdr.detectChanges();
      }
    });
  }


  clearFilter() {
    this.filterText = '';
    this.onFilterChange();
  }


  localFilter(q: string): ManagerGetDonor[] {
    const lower = q.toLowerCase();
    return this.donors.filter(d => {
      if (this.filterType === 'name') {
        const first = (d.first_name || '').toString().toLowerCase();
        const last = (d.last_name || '').toString().toLowerCase();
        return first.includes(lower) || last.includes(lower);
      } else if (this.filterType === 'email') {
        const email = (d.email || '').toString().toLowerCase();
        return email.includes(lower);
      } else if (this.filterType === 'gift') {
        const gifts = (d as any).gifts || [];
        return gifts.some((g: GetGift) => ((g.name || '') + ' ' + (g.description || '')).toString().toLowerCase().includes(lower));
      }
      return false;
    });
  }


  customSort(event: any) {
    event.data.sort((data1: ManagerGetDonor, data2: ManagerGetDonor) => {
      let value1 = (data1 as any)[event.field];
      let value2 = (data2 as any)[event.field];
      let result = null;


      if (typeof value1 === 'string') value1 = value1.toLowerCase();
      if (typeof value2 === 'string') value2 = value2.toLowerCase();


      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;


      return event.order * result;
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
        console.log(result);
        
        const createDonorDto: CreateDonor = {
          email: result.email,
          password: result.password,
          first_name: result.first_name,
          last_name: result.last_name,
          phone: result.phone,
          company_name: result.company_name,
          company_description: result.company_description,
          is_publish: result.is_publish
        };
        this.donorService.addDonor(createDonorDto, result.company_picture).subscribe({
          next: (newDonor: ManagerGetDonor) => {
            this.donors = [...this.donors, newDonor];
            this.filteredDonorsList = [...this.donors];
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נוסף למערכת' });
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error adding donor:', err);
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error || 'שגיאה בהוספת התורם' });
          }
        });
      }
    });
  }
  showGiftChild(donor: ManagerGetDonor) {
    this.ref = this.dialogService.open(GiftsForm, {
      header: 'הוספת מתנה חדש',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { donorId: donor.id }
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        console.log(result);
        this.giftService.addGift(result, result.picture).subscribe({
          next: () => {
            this.loadDonors();
            this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה בהצלחה' });
          },
          error: (err) => {
            console.error('Error adding gift:', err);
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: err.error || 'שגיאה בהוספת המתנה' });
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
          next: (newDonor: ManagerGetDonor) => {
            const index = this.donors.findIndex(d => d.id === donor.id);
            if (index !== -1) {
              this.donors[index] = newDonor;
              this.donors = [...this.donors];
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
  expandAll() {
    this.expandedRows = this.donors.reduce((acc, p) => (acc[p.id] = true) && acc, {} as Record<number, boolean>);
  }
  collapseAll() {
    this.expandedRows = {};
  }
  onRowExpand(event: TableRowExpandEvent) {
  }
  onRowCollapse(event: TableRowCollapseEvent) {
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
  saveDonor() {
    if (!this.donor.id) return;

    const updateDonorDto: Partial<CreateDonor> = {
      email: (this.donor as any).email,
      first_name: (this.donor as any).firstName,
      last_name: (this.donor as any).lastName,
      phone: (this.donor as any).phone
    };


    this.donorService.updateDonor(this.donor.id, updateDonorDto, undefined).subscribe({
      next: () => {
        this.loadDonors();
        this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'פרטי התורם עודכנו' });
        this.donorDialog = false;
      },
      error: (err) => {
        console.error('Error updating donor:', err);
        this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'העדכון נכשל' });
      }
    });
  }


  deleteDonor(donor: ManagerGetDonor) {
    this.confirmationService.confirm({
      message: `האם למחוק את ${donor.first_name}?`,
      header: 'אישור מחיקה',
      accept: () => {
        this.donorService.deleteDonor(donor.id!).subscribe({
          next: () => {
            this.donors = this.donors.filter(d => d.id !== donor.id);
            this.filteredDonorsList = [...this.donors];
            this.messageService.add({ severity: 'success', summary: 'נמחק', detail: 'התורם הוסר' });
          },
          error: (err) => {
            console.error('Error deleting donor:', err);
            this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'המחיקה נכשלה' });
          }
        });
      }
    });
  }
}
