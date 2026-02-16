import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthenticationService } from '../../../services/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ProgressSpinnerModule, ToastModule, InputMaskModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  providers: [MessageService]
})
export class Register implements OnInit {
  messageService = inject(MessageService);
  registerForm!: FormGroup;
  authService = inject(AuthenticationService);
  router = inject(Router);
  isLoading = false;

  ngOnInit() {
    this.registerForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      ConfirmPassword: new FormControl('', [Validators.required]),
      First_name: new FormControl('', [Validators.required]),
      Last_name: new FormControl('', [Validators.required]),
      Phone: new FormControl('', [Validators.pattern("^[0-9-]*\$")]),
    }, { validators: this.passwordValidator });
  }

  passwordValidator(control: AbstractControl) {
    const isMatch = control.get('Password')?.value === control.get('ConfirmPassword')?.value;
    control.get('ConfirmPassword')?.setErrors(isMatch ? null : { mismatch: true });
    return isMatch ? null : { mismatch: true };
  }

  isInvalid(name: string) {
    const control = this.registerForm.get(name);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { Email, Password, First_name, Last_name, Phone } = this.registerForm.value;
      this.authService.register(Email, Password, First_name, Last_name, Phone).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully!', life: 3000 });
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error, life: 3000 });
          console.error('Registration error:', err.error);
        }
      });
    }
  }
}
