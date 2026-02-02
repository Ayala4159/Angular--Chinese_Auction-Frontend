import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
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


// Services
import { AuthenticationService } from '../../../services/authentication-service';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, SlicePipe,
    DrawerModule, ButtonModule, InputTextModule, FloatLabelModule,
    AvatarModule, IconFieldModule, InputIconModule, BadgeModule
  ],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {
  sidebarVisible: boolean = false;
  searchValue: string = '';
  showMenu = false;
  showUserDropdown = false;
  
  authService = inject(AuthenticationService);
  categoryService = inject(CategoryService);
  
  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/categories/'; 
  categories: any[] = [];

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
}