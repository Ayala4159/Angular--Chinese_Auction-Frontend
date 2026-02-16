import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-gift-details-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, CurrencyPipe, CardModule, DividerModule],
  template: `
    <div class="gift-details-dialog w-10" dir="rtl">
      <div class="content-wrapper">
        <!-- Image Section -->
        <div class="image-section">
          <img [src]="'https://localhost:7282/images/gifts/' + gift.picture" 
               [alt]="gift.name" 
               class="details-image">
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <!-- Header Section -->
          <div class="header-section">
            <h2 class="text-2xl font-bold text-white m-0">{{ gift.name }}</h2>
            <p class="text-gray-400 text-sm mt-1 m-0">{{ gift.description }}</p>
          </div>

          <!-- Details -->
          <p class="text-gray-300 text-sm my-3">{{ gift.details }}</p>

          <!-- Info Cards Section -->
          <div class="info-cards grid gap-2">
            <!-- Value Card -->
            <div class="col-12 md:col-6">
              <div class="info-card info-card-primary">
                <span class="card-label">שווי המתנה</span>
                <div class="card-value">{{ gift.value | currency: 'ILS' }}</div>
              </div>
            </div>

            <!-- Lottery Status Card -->
            <div class="col-12 md:col-6" *ngIf="gift.is_lottery">
              <div class="info-card info-card-success">
                <span class="card-label">זמינות</span>
                <div class="card-value">
                  <i class="pi pi-check text-sm"></i>
                  זמין
                </div>
              </div>
            </div>

            <!-- Donor Card -->
            <div class="col-12" *ngIf="donor">
              <div class="info-card info-card-accent">
                <span class="card-label">תורם</span>
                <div class="card-value-donor">
                  {{ donor.Company_name || 'תורם פרטי' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons mt-4">
            <p-button label="סגור" 
                      icon="pi pi-times" 
                      class="w-full close-btn"
                      severity="secondary"
                      (onClick)="closeDialog()">
            </p-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .gift-details-dialog {
      direction: rtl;
      background: #1e2139;
      padding: 1.5rem;
      border-radius: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    .image-section {
      flex-shrink: 0;
    }

    .details-image {
      width: 250px;
      height: 250px;
      object-fit: cover;
      border-radius: 0.75rem;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .info-section {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      text-align: right;
    }

    .header-section h2 {
      color: #ffffff;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }

    .header-section p {
      margin: 0;
    }

    /* Info Cards */
    .info-cards {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .info-card {
      padding: 1rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .info-card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.08);
    }

    .card-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      display: block;
    }

    .card-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #e5e7eb;
    }

    .card-value-donor {
      font-size: 1rem;
      font-weight: 600;
      color: #e5e7eb;
    }

    /* Primary Card - Blue/Indigo */
    .info-card-primary {
      border-left: 3px solid #6366f1;
    }

    .info-card-primary .card-label {
      color: #a5b4fc;
    }

    .info-card-primary .card-value {
      color: #c7d2fe;
    }

    /* Success Card - Green/Teal */
    .info-card-success {
      border-left: 3px solid #10b981;
    }

    .info-card-success .card-label {
      color: #6ee7b7;
    }

    .info-card-success .card-value {
      color: #a7f3d0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    /* Accent Card - Purple */
    .info-card-accent {
      border-left: 3px solid #a855f7;
      grid-column: 1 / -1;
    }

    .info-card-accent .card-label {
      color: #d8b4fe;
    }

    .info-card-accent .card-value-donor {
      color: #e9d5ff;
    }

    /* Close Button */
    ::ng-deep .close-btn .p-button {
      background: #6366f1 !important;
      border: none !important;
      padding: 0.65rem 1.25rem !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
    }

    ::ng-deep .close-btn .p-button:hover {
      background: #4f46e5 !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }

      .details-image {
        width: 100%;
        height: 300px;
      }

      .header-section h2 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .gift-details-dialog {
        padding: 1rem;
      }

      .content-wrapper {
        gap: 1.5rem;
      }

      .details-image {
        height: 250px;
      }

      .header-section h2 {
        font-size: 1.25rem;
      }

      .info-cards {
        grid-template-columns: 1fr;
      }

      .info-card-accent {
        grid-column: 1;
      }
    }

    @media (max-width: 576px) {
      .gift-details-dialog {
        padding: 0.75rem;
      }

      .content-wrapper {
        gap: 1rem;
      }

      .details-image {
        height: 200px;
        border-radius: 0.5rem;
      }

      .header-section h2 {
        font-size: 1.1rem;
      }

      .header-section p {
        font-size: 0.75rem;
      }

      .info-card {
        padding: 0.75rem;
      }

      .card-label {
        font-size: 0.65rem;
      }

      .card-value {
        font-size: 1rem;
      }

      .card-value-donor {
        font-size: 0.9rem;
      }
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
