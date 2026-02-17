import { ChangeDetectorRef, Component, computed, HostListener, inject, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, SlicePipe,
    DrawerModule, ButtonModule, InputTextModule, FloatLabelModule,
    AvatarModule, IconFieldModule, InputIconModule, BadgeModule, ConfirmDialogModule,
    ProgressSpinnerModule, DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {
  authService = inject(AuthenticationService);
  categoryService = inject(CategoryService);
  cookieService = inject(CookieService);
  giftService = inject(GiftService);
  purchaseservice = inject(PurchaseService);
  messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  sidebarVisible: boolean = false;
  searchValue: string = '';
  showMenu = false;
  showUserDropdown = false;
  user = toSignal(this.authService.user$);
  role = computed(() => {
    const currentUser = this.user();
    return currentUser ? currentUser.role : 1;
  });

  // displayConfirmLottery = false;
  displayLotteryResults = false;
  isLoading = false;
  lotteryResults: {
    name: string,
    status: string,
    message: string,
    severity: string,
    winner?: string | null,
    icon?: string
  }[] = [];

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
    window.location.reload(); 
  }
  lottery() {
    this.confirmationService.confirm({
      message: 'העורך דין נמצא???? אנחנו נתחיל להגריל???? יואו איזה מתח!!!! והזוכיםםםם',
      header: ' הגרלה',
      icon: 'pi pi-credit-card',
      acceptLabel: "כן, אני רוצה להתחיל",
      rejectLabel: "אהמ... אתה יודע מה? בוא ניתן עוד שתי דקות של מתח.....",
      accept: () => {
        this.isLoading = true;
        this.lotteryResults = [];

        this.giftService.getGift().subscribe({
          next: (data: any[]) => {
            let completedRequests = 0;

            data.forEach((gift: any) => {
              this.purchaseservice.runLottery(gift.id).subscribe({
                next: (res: any) => {
                  this.lotteryResults.push({
                    name: gift.name,
                    status: 'הושלם',
                    winner: res?.first_name || res?.firstName || 'נבחר זוכה',
                    message: 'הגרלה הושלמה',
                    severity: 'text-green-500',
                    icon: 'pi pi-check-circle'
                  });
                  this.isLoading = false;
                  this.checkIfFinished(++completedRequests, data.length);
                },
                error: (err: any) => {
                  this.lotteryResults.push({
                    name: gift.name,
                    status: 'נכשל',
                    winner: null,
                    message: err.error?.message || 'אין משתתפים',
                    severity: 'text-red-500',
                    icon: 'pi pi-times-circle'
                  });
                  this.isLoading = false;
                  this.checkIfFinished(++completedRequests, data.length);
                }
              });
            });
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  private checkIfFinished(current: number, total: number) {
    if (current === total) {
      this.isLoading = false;
      setTimeout(() => {
        this.displayLotteryResults = true;
        this.cdr.detectChanges();
      }, 200);
    }
  }

}
