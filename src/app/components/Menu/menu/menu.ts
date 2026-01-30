import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { AuthenticationService } from '../../../services/authentication-service';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule, InputTextModule, BadgeModule, AvatarModule, RouterModule, ButtonGroupModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss']
})
export class Menu implements OnInit {
  showMenu = false;
  showUserDropdown = false;
  userMenuItems: MenuItem[] | undefined;
  isLoggedIn = false;
  authService = inject(AuthenticationService);
  categoryService = inject(CategoryService);
  readonly IMAGE_BASE_URL = 'https://localhost:7282/images/';  

  onLogout(event?: MouseEvent) {
    if (event) {
      this.showUserDropdown = false;
    }
    this.isLoggedIn = false;
    this.authService.logout();
  }
  categories: any[] = [];
  products = [
    { title: 'UI Blocks', desc: 'Build production-ready UIs fast.', image: '', icon: 'pi pi-th-large' },
    { title: 'Tailwind PRO', desc: 'Premium components for Tailwind CSS.', image: '', icon: 'pi pi-th-large' },
    { title: 'Admin Dashboards', desc: 'Complex systems made simple.', image: '', icon: 'pi pi-th-large' },
    { title: 'Workflows', desc: 'Automate your business easily.', image: '', icon: 'pi pi-th-large' }
  ];
  onSettings() { console.log('Settings'); }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.showMenu = false;
  }

  ngOnInit() {
  this.categoryService.getCategories().subscribe({
    next: (data) => {
      this.categories = data; 
      console.log('Categories loaded:', data);
    },
    error: (err) => console.error('Error loading categories:', err)
  });

  this.userMenuItems = [
    { label: 'הגדרות חשבון', icon: 'pi pi-user-edit' },
    { label: 'התנתקות (Logout)', icon: 'pi pi-sign-out' }
  ];
  }
}