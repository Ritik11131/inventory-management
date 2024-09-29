import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import * as validator from 'validator';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { generateCaptchaCode } from '../../../shared/utils/common';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule,InputTextModule,FormsModule,ToastModule,DividerModule,
    CommonModule,PasswordModule,InputGroupModule,InputGroupAddonModule,IconFieldModule,InputIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  captchaError: boolean = false;
  isLoggedIn:boolean = false;
  captchaCode: string = '';
  userInput: string = '';
;
  
  
  constructor(private toastService:ToastService,private authService:AuthService,private router:Router) {}


  ngOnInit(): void { 
    this.generateCatcha();
  }




   // Disable copy-paste events
   disableEvent(event: any) {
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
      this.verifyCode();
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

  generateCatcha() : void {
    this.captchaCode = generateCaptchaCode();
  }

  verifyCode(): void {
      if (this.userInput === this.captchaCode) {
        this.signIn();
      } else {
        this.captchaError = true;
        this.userInput = '';
        this.generateCatcha();
        return this.toastService.showWarn('Warning', 'Invalid code, please try again!');
      }

  }

}
