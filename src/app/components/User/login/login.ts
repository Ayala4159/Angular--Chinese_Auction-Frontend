import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthenticationService } from '../../../services/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, CheckboxModule, ProgressSpinnerModule, ToastModule, InputMaskModule],
  templateUrl: './login.html',
  providers: [MessageService],
  styleUrl: './login.scss',
})
export class Login {
  messageService = inject(MessageService);
  loginForm!: FormGroup;
  authService = inject(AuthenticationService);
  router = inject(Router);
  rememberMe = false;
  isLoading = false;
  userSignal = signal<any>(null);
  

  ngOnInit() {
    this.loginForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  };

  isInvalid(name: string) {
    const control = this.loginForm.get(name);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  onSubmit() {
    this.userSignal.set(this.loginForm.value);
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { Email, Password } = this.loginForm.value;
      this.authService.login(Email, Password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User logged in successfully!', life: 3000 });
          this.loginForm.reset();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMessage = err.error?.detail || err.error?.title || (typeof err.error === 'string' ? err.error : 'Invalid login credentials');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
          console.error('Login error:', err.error);
        }
      });
    }
  }
}
