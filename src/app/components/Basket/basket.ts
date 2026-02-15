import { Component, OnInit, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DonorService } from '../../services/donor-service';
import { CategoryService } from '../../services/category-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GetGift } from '../../models/gift.model';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package-service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { GiftService } from '../../services/gift-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [ButtonModule,
    DataViewModule,
    TagModule,
    CommonModule,
    ConfirmDialog,
    Toast,
    ConfirmDialogModule,
    RouterModule,
    ConfirmPopupModule,
    ToastModule],
  providers: [ConfirmationService,
    MessageService,
    DonorService,
    CategoryService,
    PackageService],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})


export class Basket {
  allCards: GetGift[] = [];
  uniquePackages: any[] = [];
  favoriteGifts: number[] = [];

  private cookieService = inject(CookieService);
  user: string = '';
  packages: any[] = [];

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private giftService = inject(GiftService);
  private destroyRef = inject(DestroyRef);

  BASE_URL = 'https://localhost:7282/images/gifts/';
  DONOR_BASE_URL = 'https://localhost:7282/images/companies/';

  ngOnInit() {
    this.user = this.cookieService.get('user') || '';
    this.packages = JSON.parse(this.cookieService.get(JSON.parse(this.user)?.id) || '[]');
    console.log(this.packages);
    
    this.loadGifts()
  }

  loadGifts() {
    console.log("1");
    const quantityMap: { [id: string]: number } = {};
    this.packages.flatMap(pkg => pkg.cards).forEach((cardId: any) => {
      const id = cardId.toString();
      quantityMap[id] = (quantityMap[id] || 0) + 1;
    });
    const uniqueIds = Object.keys(quantityMap);
    if (uniqueIds.length === 0) {
      this.allCards = [];
      return;
    }
    console.log(uniqueIds)
    const requests = uniqueIds.map(id => this.giftService.getGiftById(Number(id)));
    console.log(requests);
    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (gifts: any[]) => {
          this.allCards = gifts
            .filter(g => g !== null)
            .map(gift => ({
              ...gift,
              quantity: quantityMap[gift.Id?.toString()]
            }));
          this.cdr.detectChanges();
          console.log(this.allCards);
        },
        error: (err) => console.error('Global ForkJoin Error:', err)
      });
      this.uniquePackages = this.packages.reduce((acc: any[], current: any) => {
      const existing = acc.find(p => p.id === current.id);
      if (existing) {
        existing.package_count += 1;
      } else {
        acc.push({ ...current, package_count: 1 });
      }
      return acc;
    }, []);

  };

  toggleFavorite(giftId: number) {
    const index = this.favoriteGifts.indexOf(giftId);
    if (index > -1) {
      this.favoriteGifts.splice(index, 1);
    } else {
      this.favoriteGifts.push(giftId);
    }
  }
  isFavorite(giftId: number): boolean {
    return this.favoriteGifts.includes(giftId);
  }


  removeFromBasket(id: number) {
    let user = JSON.parse(this.user);
    const userId = user.id;
    const packageWithCard = [...this.packages].reverse().find((pack: any) =>
      pack.cards.some((cardId: any) => Number(cardId) === Number(id))
    );
    console.log('packUser2', this.packages);
    if (packageWithCard) {
      const cardIndex = packageWithCard.cards.findIndex((cardId: any) => Number(cardId) === Number(id));
      if (cardIndex !== -1) {
        packageWithCard.cards.splice(cardIndex, 1);
        packageWithCard.emptyQuantity += 1;
        this.cookieService.set(userId, JSON.stringify(this.packages));
        this.loadGifts();
        this.messageService.add({ severity: 'warn', summary: 'הצלחה', detail: 'המתנה הוסרה מהחבילה שלך' });
      }
    }
  }


  addToBasket(id: number) {
        const product = this.allCards.find(g => g.id === id);
    if (!this.user) {
      this.confirmationService.confirm({
        header: 'נדרשת התחברות',
        message: 'אופס, נראה שאתה לא מחובר. רוצה להתחבר או להירשם?',
        icon: 'pi pi-user',
        acceptLabel: "כן, אני רוצה להתחבר",
        rejectLabel: "לא, אני רוצה להמשיך להסתכל",
        accept: () => {
          this.router.navigate(['/login'])
        },
        reject: () => {
          this.router.navigate(['/basket']);
        },
      });
      return;
    }

    const userData = JSON.parse(this.user);
    const userId = userData.id;
    if (this.packages.length === 0) {
      this.confirmationService.confirm({
        header: 'לא נבחרה חבילה',
        message: 'אופס, לא בחרת עדיין חבילה. רוצה להוסיף חבילה חדשה?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "אה! אני רוצה להוסיף חבילה",
        rejectLabel: "...לא:-) להמשיך להסתכל",
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.router.navigate(['/']);
        },
        reject: () => {
          this.router.navigate(['/basket']);
        }
      });
      return;
    }

    const existingPackage = this.packages.find((pack: any) => pack.emptyQuantity > 0);
    if (existingPackage && product) {
      existingPackage.cards.push(product.id);
      existingPackage.emptyQuantity -= 1;
      this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'המתנה נוספה לחבילה שלך' });
      this.cookieService.set(userId, JSON.stringify(this.packages));
      this.loadGifts();
    }
    else {
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
          this.router.navigate(['/basket']);
        }
      });
    }
  }
  totalPrice(): number {
    let total = 0;
    this.packages.forEach((pack: any) => {
      total += Number(pack.price);
    });
    return total
  }

}