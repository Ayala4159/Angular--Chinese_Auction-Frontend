import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
import { ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftsForm } from '../gifts-form/gifts-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-get-all-gifts',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, DynamicDialogModule, ToastModule],
  providers: [GiftService, DialogService, MessageService],
  templateUrl: './get-all-gifts.html',
  styleUrl: './get-all-gifts.scss',
})

export class GetAllGifts implements OnInit {

  giftService = inject(GiftService);
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  ref: DynamicDialogRef<any> | null = null;

  products: any[] = [];
  gifts: any[] = [];

  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/gifts/';

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.loadGiftsByCategory(categoryId);
      } else {
        this.loadGifts();
      }
    });
    console.log(this.gifts);
    
  }

  loadGiftsByCategory(id: number) {
    this.giftService.getGiftsByCategory(id).subscribe(data => {
      this.gifts = data;
      this.cdr.detectChanges();
    });
  }

  loadGifts() {
    this.giftService.getGift().subscribe(data => {
      this.gifts = data;
      this.cdr.detectChanges()
      console.log(this.gifts);
    });
  }

  addToCart(product: any) {
    console.log('נוסף לסל:', product.name);
  }

  showDetails(product: any) {
    console.log('מעבר לפרטי המוצר:', product.id);
  }
  addGift() {
      this.ref = this.dialogService.open(GiftsForm, {
        header: 'הוספת מתנה חדשה',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
      });
      this.ref?.onClose.subscribe((result) => {
        if (result) {
          this.giftService.addGift(result, result.picture).subscribe({
            next: (newGift) => {
              this.gifts.push(newGift);
              this.gifts = [...this.gifts];
              this.cdr.detectChanges();
              this.messageService.add({ severity: 'success', summary: 'עודכן', detail: 'המתנה נוספה בהצלחה' });
            }
            , error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'שגיאה', detail: 'הוספת המתנה נכשלה' });
            }
          });
        }
      });
  
    }
}


