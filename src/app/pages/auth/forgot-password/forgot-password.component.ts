import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { StepperModule } from 'primeng/stepper';
import { AuthService } from '../../../core/services/auth.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputOtpModule } from 'primeng/inputotp';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ButtonModule,DividerModule,InputTextModule,CommonModule,FormsModule,IconFieldModule,InputIconModule,StepperModule,InputNumberModule,InputOtpModule],
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
export class ForgotPasswordComponent implements OnInit,OnDestroy {

  active: number | undefined = 0;

  mobileNo!:number;
  otp!:number;
  remainingTime: number = 150;
  isResendEnabled: boolean = false;

  private timerSubscription!: Subscription;

  constructor(private authService:AuthService,private toastService:ToastService) {}


  async nextStep(callback : any,nextStep?:string) : Promise<any> {
    if(nextStep === 'otp') {
      await this.sendOtp();
      this.startTimer();
    }
    callback.emit();
  }

  ngOnInit() {
   
  }

  startTimer() {
    this.timerSubscription = timer(0, 1000).pipe(take(this.remainingTime + 1)).subscribe(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        this.isResendEnabled = true;
        this.timerSubscription.unsubscribe();
      }
    });
  }


  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


  async sendOtp() : Promise<any> {
    try {
      const response = await this.authService.sendSMSOtp(this.mobileNo);
      console.log(response);
    } catch (error : any) {
      console.log(error);
      this.toastService.showSuccess('Error', error.error.message);
    }
  }




}
