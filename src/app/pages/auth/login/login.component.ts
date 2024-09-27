import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import * as validator from 'validator';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule,InputTextModule,FormsModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private toastService:ToastService,private authService:AuthService,private router:Router) {}

  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';



   // Disable copy-paste events
   disableEvent(event: ClipboardEvent) {
    event.preventDefault();
  }


  validateForm() {
    this.emailError = '';
    this.passwordError = '';

    // Validate email
    // if (!validator.isEmail(this.email)) {
    //   this.emailError = 'Please enter a valid email address';
    // }

    // Validate password (non-empty)
    if (validator.isEmpty(this.password)) {
      this.passwordError = 'Password cannot be empty';
    }

    // If no errors, proceed with form submission
    if (!this.emailError && !this.passwordError) {
      this.signIn();
    }
  }

  async signIn() : Promise<any> {
    try {
      await this.authService.login({ Username: this.email, Password: this.password });
      this.toastService.showSuccess('Success', 'This is a success message!');
      this.router.navigate(['/main/dashboard']);
    } catch (error) {
      console.error(error);
      this.toastService.showError('Error', 'This is an error message!');
      
    }
    // Handle the sign-in logic
    console.log('Form is valid, proceed with sign-in');
  }

}
