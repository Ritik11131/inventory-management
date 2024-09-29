import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  isLoggedIn:boolean = false;
  captchaCode: string = '';
  userInput: string = '';
  isVerified: boolean = false;
  isVerifiedLoader: boolean = false;;
  
  
  constructor(private toastService:ToastService,private authService:AuthService,private router:Router) {}


  ngOnInit(): void {  
    this.generateCaptchaCode();
  }




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
    this.isLoggedIn = true;
    try {
      await this.authService.login({ Username: this.email, Password: this.password });
      this.toastService.showSuccess('Success', 'Successfully logged in!');
      this.router.navigate(['/main/dashboard']);
    } catch (error) {
      console.error(error);
      this.toastService.showError('Error', 'Failed to log in!');
    } finally {
      this.isLoggedIn = false;
    }
  }


  generateCaptchaCode(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaCode = '';
    for (let i = 0; i < 7; i++) {
      this.captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  verifyCode(): void {
    this.isVerifiedLoader = true;
    setTimeout(() => {
      if (this.userInput === this.captchaCode) {
        this.isVerified = true;
        this.toastService.showSuccess('Verified', 'Please Sign In!');
      } else {
        this.toastService.showWarn('Warning', 'Invalid code, please try again!');
      }
      this.isVerifiedLoader = false;
    }, 1000)
  }

}
