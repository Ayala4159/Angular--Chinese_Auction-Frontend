import { Component, inject } from '@angular/core';
import { PackageService } from '../../../services/package-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AsyncPipe } from '@angular/common';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common'; // ייבוא עבור CurrencyPipe
@Component({
  selector: 'app-get-all-packages',
  standalone: true,
  imports: [ButtonModule, CardModule, AsyncPipe, DynamicDialogModule, ToastModule, CommonModule],
  providers: [DialogService, MessageService],
  templateUrl: './get-all-packages.html',
  styleUrl: './get-all-packages.scss',
})
export class GetAllPackages {
  packageService = inject(PackageService);
  packages$: any = this.packageService.getPackages();
  dialogService = inject(DialogService);
  messageService = inject(MessageService)
  showChild() { }
  onEditPackage(id: any) { }
  onDeletePackage(id: any) { }
  calculateTotal(){
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
  user: string = localStorage.getItem('user') || '';
  role: string = this.user ? JSON.parse(this.user).role : '';
}
