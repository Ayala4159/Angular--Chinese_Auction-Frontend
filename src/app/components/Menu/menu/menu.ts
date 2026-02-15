import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG 18+ Modules
import { DrawerModule } from 'primeng/drawer'; // במקום Sidebar
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeModule } from 'primeng/badge';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Services
import { AuthenticationService } from '../../../services/authentication-service';
import { CategoryService } from '../../../services/category-service';
import { CookieService } from 'ngx-cookie-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GiftService } from '../../../services/gift-service';
import { PurchaseService } from '../../../services/purchase-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, SlicePipe,
    DrawerModule, ButtonModule, InputTextModule, FloatLabelModule,
    AvatarModule, IconFieldModule, InputIconModule, BadgeModule, ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {
  authService = inject(AuthenticationService);
  categoryService = inject(CategoryService);
  cookieService = inject(CookieService);
  giftService = inject(GiftService);
  purchaseservice = inject(PurchaseService);

  sidebarVisible: boolean = false;
  searchValue: string = '';
  showMenu = false;
  showUserDropdown = false;
  user = toSignal(this.authService.user$);
  role = computed(() => {
    const currentUser = this.user();
    return currentUser ? currentUser.role : 1;
  });

  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/categories/';
  categories: any[] = [];

  router = inject(Router);
  confirmationService = inject(ConfirmationService);

  navigateToGifts(categoryId: number) {
    this.router.navigate(['/gifts', categoryId]);
  }
  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error:', err)
    });
  }

  onLogout(event?: MouseEvent) {
    this.showUserDropdown = false;
    this.authService.logout();
  }

  lottery() {
    this.confirmationService.confirm({
      message: 'העורך דין נמצא???? אנחנו נתחיל להגריל???? יואו איזה מתח!!!! והזוכיםםםם',
      header: ' הגרלה',
      icon: 'pi pi-credit-card',
      acceptLabel: "כן, אני רוצה להתחיל",
      rejectLabel: "אהמ... אתה יודע מה? בוא ניתן עוד שתי דקות של מתח.....",
      accept: () => {
        const gifts = this.giftService.getGift().subscribe({
          next: (data) => {
            const giftIds = data.map((gift: any) => gift.id);
            for (let i = 0; i < giftIds.length; i++) {
              console.log(giftIds[i]);
              this.purchaseservice.runLottery(giftIds[i]).subscribe({
                next: () => {
                  console.log(`Lottery run for gift ID: ${giftIds[i]}`);
                }
              });
            }
          }
        })
      }
    });
  }
}