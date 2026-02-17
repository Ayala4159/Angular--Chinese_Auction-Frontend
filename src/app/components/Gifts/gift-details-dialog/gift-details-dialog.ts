import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';


@Component({
  selector: 'app-gift-details-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, CurrencyPipe, RippleModule],
  template: `
    <div class="gift-details-main-container p-4 md:p-6"
         dir="rtl"
         style="background-color: #1a162e; color: white; border-radius: 28px;">
     
      <div class="grid grid-nogutter gap-5 justify-content-center">
       
        <div class="col-12 md:col-fixed flex justify-content-center" style="width: 350px;">
          <div class="image-frame animate-fadein relative border-round-3xl overflow-hidden shadow-8 w-full">
            <img [src]="'https://localhost:7282/images/gifts/' + gift.picture"
                 [alt]="gift.name"
                 class="w-full block object-cover"
                 style="height: 400px; border-radius: 24px;">
            <div class="image-glow absolute inset-0"></div>
          </div>
        </div>


        <div class="col-12 md:col flex flex-column text-right px-2">
          <div class="main-header mb-4">
            <h1 class="gift-title-large m-0 mb-3 text-gradient-white">{{ gift.name }}</h1>
            <p class="gift-subtitle-large font-semibold m-0">{{ gift.description }}</p>
          </div>


          <div class="description-body flex-grow-1 text-xl line-height-4 opacity-80 mb-5">
            <p>{{ gift.details || 'אין פירוט נוסף זמין עבור מתנה זו.' }}</p>
          </div>


          <div class="stats-container grid p-4 border-round-2xl mb-5"
               style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);">
            <div class="col-6 flex flex-column gap-2">
              <span class="opacity-60 text-xs uppercase" style="letter-spacing: 1px;">שווי מוערך</span>
              <span class="text-4xl font-bold">{{ gift.value | currency: 'ILS':'symbol':'1.0-0' }}</span>
            </div>
           
            <div class="col-6 flex flex-column gap-2">
              <span class="opacity-60 text-xs uppercase" style="letter-spacing: 1px;">נתרם ע"י</span>
              <div class="flex align-items-center gap-2 text-2xl font-bold" style="color: #f472b6;">
                <i class="pi pi-heart-fill"></i>
                <span>{{ (donor && donor.companyName) ? donor.companyName : 'תורם פרטי' }}</span>
              </div>
            </div>
          </div>


          <div class="mt-auto">
            <button pButton
                    label="חזרה לרשימת המתנות"
                    icon="pi pi-arrow-left"
                    class="p-button-outlined return-btn w-full"
                    (click)="closeDialog()"
                    pRipple>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gift-title-large {
      font-size: 3.5rem !important;
      font-weight: 800;
      /* האפקט מגיע מה-Global אבל מוגדר כאן לגיבוי */
      background: linear-gradient(to bottom, #ffffff, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }


    .gift-subtitle-large {
      font-size: 1.5rem;
      color: #fb923c;
    }


    /* עיצוב הכפתור ללא מסגרת ירוקה */
    ::ng-deep .return-btn.p-button-outlined {
      height: 3.8rem;
      font-size: 1.15rem !important;
      border-radius: 18px !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.05) !important;


      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        border-color: #ffffff !important;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
      }
    }


    .image-glow {
      box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
    }


    @media (max-width: 991px) {
      .gift-title-large { font-size: 2.2rem !important; }
      .col-fixed { width: 100% !important; }
    }
  `]
})
export class GiftDetailsDialog implements OnInit {
  dynamicDialogConfig = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);


  gift: any;
  donor: any;


  ngOnInit() {
    if (this.dynamicDialogConfig.data) {
      this.gift = this.dynamicDialogConfig.data.gift;
      this.donor = this.dynamicDialogConfig.data.donor;
    }
  }


  closeDialog() {
    this.ref.close();
  }
}



