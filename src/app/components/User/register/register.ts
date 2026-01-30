
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { AuthenticationService } from '../../../services/authentication-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, ToastModule, InputMaskModule],
  templateUrl: './register.html',
  providers: [MessageService]
})
export class Register implements OnInit {
  messageService = inject(MessageService);
  registerForm!: FormGroup;
  authService = inject(AuthenticationService);
  route=inject(Router)


  ngOnInit() {
    this.registerForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(8)],),
      ConfirmPassword: new FormControl('', [Validators.required]),
      First_name: new FormControl('', [Validators.required]),
      Last_name: new FormControl('', [Validators.required]),
      Phone: new FormControl('', [Validators.pattern("^[0-9-]*$")]),
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
      const { Email, Password, First_name, Last_name, Phone } = this.registerForm.value;
      this.authService.register(Email, Password, First_name, Last_name, Phone).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully!', life: 3000 });
          console.log('User registered:', response);
          this.registerForm.reset();
          this.route.navigate(['/login']);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error, life: 3000 });
          console.error('Registration error:', err.error);
        }
      });
    }
  }

}
