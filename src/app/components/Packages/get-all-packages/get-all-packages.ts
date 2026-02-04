import { MessageService } from 'primeng/api';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PackageService } from '../../../services/package-service';
import { AsyncPipe } from '@angular/common';
import { PackageForm } from '../package-form/package-form';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';


@Component({
  selector: 'app-get-all-packages',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule, CommonModule],
  providers: [DialogService, MessageService],
  templateUrl: './get-all-packages.html',
  styleUrl: './get-all-packages.scss',
})
export class GetAllPackages {
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  packageService = inject(PackageService);
  packages$: any = this.packageService.getPackages().pipe(
    map((packages: any[]) => {
      return packages.map(pkg => {
        const count = this.userPackages.filter(up => up.id === pkg.id.toString()).length;
        return { ...pkg, quantity: count };
      });
    })
  );
  ref: DynamicDialogRef<any> | null = null;
  user: string = localStorage.getItem('user') || '';
  role: string = this.user ? JSON.parse(this.user).role : '';
  userPackages: any[] = JSON.parse(localStorage.getItem('userPackages') || '[]');
  isChildVisible: boolean = false;
  showChild() {
    this.ref = this.dialogService.open(PackageForm, {
      header: 'הוספת חבילה חדשה',
      width: '30%',
      contentStyle: { overflow: 'auto' },
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

  ngOnInit() {
  }


  calculateTotal() {
    let total = 0;
    this.packages$.subscribe((packages: any[]) => {
      packages.forEach(pkg => {
        if (pkg.quantity && pkg.quantity > 0) {
          total += pkg.price * pkg.quantity;
        }
      });
    });
    return total;
  }
  hasSelections() {
    let hasSelections = false;
    this.packages$.subscribe((packages: any[]) => {
      packages.forEach(pkg => {
        if (pkg.quantity && pkg.quantity > 0) {
          hasSelections = true;
        }
      });
    });
    return hasSelections;
  }
  addPackage(packageData: any) {
    packageData.quantity = (packageData.quantity || 0) + 1
    this.userPackages.push({ id: packageData.id.toString(), emptyQuantity: packageData.numOfCards, cards: [] });
    localStorage.setItem('userPackages', JSON.stringify(this.userPackages));
  }
  removePackage(packageData: any) {
    let flag = false;
    packageData.quantity = (packageData.quantity || 0) > 0 ? packageData.quantity - 1 : 0
    this.userPackages = this.userPackages.filter((pkg: any) => {
      if (pkg.id === packageData.id.toString() && !flag) {
        flag = true;
      }
      else {
        return pkg;
      }
    });
    localStorage.setItem('userPackages', JSON.stringify(this.userPackages));
  }

  onEditPackage(id: any) { }
  onDeletePackage(id: any) { }
}



















