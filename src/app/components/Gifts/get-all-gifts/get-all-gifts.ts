import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../../services/gift-service';
import { GetGift } from '../../../models/gift.model';
import { ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GiftsForm } from '../gifts-form/gifts-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-get-all-gifts',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, DynamicDialogModule, ToastModule, ConfirmDialogModule, RouterLink, TagModule],
  providers: [GiftService, DialogService, MessageService, ConfirmationService],
  templateUrl: './get-all-gifts.html',
  styleUrl: './get-all-gifts.scss',
})

export class GetAllGifts implements OnInit {

  giftService = inject(GiftService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  private cookieService = inject(CookieService);
  ref: DynamicDialogRef<any> | null = null;
  private confirmationService = inject(ConfirmationService);

  products: any[] = [];
  gifts: GetGift[] = [];

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

  addToCart(product: GetGift) {
    const user = this.cookieService.get('user');
    if (!user) {
      this.confirmationService.confirm({
        message: '?אופס, נראה שאתה לא מחובר. רוצה להתחבר עכשיו',
        header: 'לא מחובר',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "כן, אני רוצה להתחבר",
        rejectLabel: "לא, אני רוצה להמשיך להסתכל",
        accept: () => {
          this.router.navigate(['/login'])
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        },

      });
      return;
    }
    let packages = JSON.parse(this.cookieService.get(JSON.parse(user).id) || '[]');
    if (packages.length === 0) {
      this.confirmationService.confirm({
        message: '?אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה',
        header: 'לא נמצאו חבילות',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) אני רוצה להמשיך להסתכל",
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigate(['/']);
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        }

      });
      return;
    }

    const existingPackage = packages.find((p: any) => p.emptyQuantity > 0)
    if (existingPackage) {
      existingPackage.cards.push(product.id);
      existingPackage.emptyQuantity--;
    } else {
      this.confirmationService.confirm({
        message: '?אופס, נגמרו לך הכרטיסים הריקים בחבילות שבחרת. רוצה להוסיף חבילה חדשה',
        header: 'הכרטיסים בחבילות אזלו',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigate(['/']);
        },
        reject: () => {
          this.router.navigate(['/gifts']);
        }
      });
      return;
    }
    this.cookieService.set(JSON.parse(user).id, JSON.stringify(packages));
    this.messageService.add({ severity: 'success', summary: 'הודעה', detail: 'המתנה נוספה לחבילה בהצלחה' });
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


