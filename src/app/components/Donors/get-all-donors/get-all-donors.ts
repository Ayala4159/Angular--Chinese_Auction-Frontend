import { Component, inject } from '@angular/core';
import { DonorService } from '../../../services/donor-service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DonorsForm } from '../donors-form/donors-form';
import { ButtonModule } from 'primeng/button';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-get-all-donors',
  standalone: true,
  imports: [ButtonModule, DynamicDialogModule],
  providers: [DialogService, MessageService],
  templateUrl: './get-all-donors.html',
  styleUrl: './get-all-donors.scss',
})
export class GetAllDonors {
  donorService = inject(DonorService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  ref: DynamicDialogRef<any> | null = null;
  donors$: any = this.donorService.getDonors();
  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/donors/'
  user: string = localStorage.getItem('user') || '';
  role: string = this.user ? JSON.parse(this.user).role : '';
  isChildVisible: boolean = false;
  showChild() {
    this.ref = this.dialogService.open(DonorsForm, {
      header: 'הוספת תורם  חדש',
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        const obj = {
          email: result.email,
          password: result.password,
          First_Name: result.first_name,
          Last_Name: result.last_name,
          phone: result.phone||'',
          Is_publish: result.is_published,
          Company_Name: result.company_name || '',
          Company_Description: result.company_description || '',
          Company_picture: result.company_picture || '',
        }

        this.donorService.addDonor(obj, result.company_picture).subscribe(() => {
          this.donors$ = this.donorService.getDonors();
          this.messageService.add({ severity: 'success', summary: 'הנותן נוסף בהצלחה', detail: '', life: 3000 });

        }, (error) => {
          this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: error.error, life: 3000 });
        });
      }
    });
  }
}
