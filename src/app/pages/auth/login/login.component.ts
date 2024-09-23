import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import * as validator from 'validator';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule,InputTextModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor() {}

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
    if (!validator.isEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
    }

    // Validate password (non-empty)
    if (validator.isEmpty(this.password)) {
      this.passwordError = 'Password cannot be empty';
    }

    // If no errors, proceed with form submission
    if (!this.emailError && !this.passwordError) {
      this.signIn();
    }
  }

  signIn() {
    // Handle the sign-in logic
    console.log('Form is valid, proceed with sign-in');
  }

}
