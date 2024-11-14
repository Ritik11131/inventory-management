import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ButtonModule,DividerModule,InputTextModule,CommonModule,FormsModule,IconFieldModule,InputIconModule,StepperModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  styles: [
    `
    .p-stepper {
        flex-basis: 50rem;
    } 
    `
]
})
export class ForgotPasswordComponent {

  active: number | undefined = 0;

  mobileNo!:number

}
