import { MessageService } from 'primeng/api';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PackageService } from '../../../services/package-service';
import { AsyncPipe } from '@angular/common';
import { PackageForm } from '../package-form/package-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CookieService } from 'ngx-cookie-service';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-get-all-packages',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule, CommonModule, RouterModule, ConfirmDialog, TooltipModule],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './get-all-packages.html',
  styleUrl: './get-all-packages.scss',
})
export class GetAllPackages implements OnInit {
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  dialogService = inject(DialogService);
  packageService = inject(PackageService);
  private cookieService = inject(CookieService);
  user: string = '';
  role: string = '1'; // ברירת מחדל כמשתמש רגיל
  userPackages: any[] = [];
  router = inject(Router);


  packages$: any = this.packageService.getPackages().pipe(
    map((packages: any[]) => {
      return packages.map(pkg => {
        const count = this.userPackages.filter(up => up.id === pkg.id.toString()).length;
        return { ...pkg, quantity: count };
      });
    })
  );


  ref: DynamicDialogRef<any> | null = null;


  ngOnInit() {
    this.user = this.cookieService.get('user') || '';
    if (this.user && this.user !== 'undefined') {
      const parsedUser = JSON.parse(this.user);
      // הבטחה שה-role יישמר כמחרוזת לצורך השוואה תקינה ב-HTML
      this.role = parsedUser.role !== undefined ? parsedUser.role.toString() : '1';
      this.userPackages = JSON.parse(this.cookieService.get(parsedUser.id) || '[]');
    }
  }


  showChild() {
    this.ref = this.dialogService.open(PackageForm, {
      width: '30%',
      styleClass: 'premium-dialog',
      showHeader: false,
      baseZIndex: 10000
    });
    this.ref?.onClose.subscribe((result) => {
      if (result) {
        this.packageService.addPackage(result).subscribe({
          next: () => {
            this.packages$ = this.packageService.getPackages();
            this.messageService.add({
              severity: 'success',
              summary: 'הצלחה',
              detail: 'החבילה נוספה בהצלחה',
              life: 3000
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'שגיאה',
              detail: error.error || 'אירעה שגיאה בשמירת החבילה',
              life: 3000
            });
          }
        });
      }
    });
  }


  addPackage(packageData: any) {
    console.log('user', this.user, (!this.user));
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
          this.router.navigate(['/home']);
        },
      });
      return;
    }
    packageData.quantity = (packageData.quantity || 0) + 1;
    console.log(packageData);
    
    this.userPackages.push({
      id: packageData.id.toString(),
      name: packageData.name,
      price: packageData.price,
      emptyQuantity: packageData.numOfCards,
      cards: []
    });
    const u = JSON.parse(this.user).id;
    this.cookieService.set(u, JSON.stringify(this.userPackages));
  }


  removePackage(packageData: any) {
    if (packageData.quantity === 0)
      return;


    let flage = false;
    this.confirmationService.confirm({
      message: 'מחיקת חבילה תגרור למחיקה של כל המתנות שהוספת לחבילה זו. האם אתה בטוח שברצונך למחוק את החבילה?',
      header: 'מחיקת חבילה',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "כן, למחוק",
      rejectLabel: "אה לא! אני רוצה להשאיר את החבילה",
      acceptButtonStyleClass: 'p-button-rounded p-button-raised premium-accept-btn',
      rejectButtonStyleClass: 'p-button-rounded p-button-text premium-reject-btn',
      accept: () => {
        this.userPackages = this.userPackages.reverse().filter((pkg: any) => {
          if (pkg.id === packageData.id.toString() && !flage) {
            flage = true;
            return false;
          }
          return true;
        }).reverse();
        this.cookieService.set(JSON.parse(this.user).id, JSON.stringify(this.userPackages));
        this.messageService.add({ severity: 'info', summary: 'החבילה נמחקה' });
        packageData.quantity = (packageData.quantity || 0) > 0 ? packageData.quantity - 1 : 0;
      }
    });
  }
}

