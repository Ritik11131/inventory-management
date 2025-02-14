import { Component, computed, OnDestroy, OnInit, Signal, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ButtonModule,DividerModule,InputTextModule,CommonModule,FormsModule,IconFieldModule,InputIconModule,
            StepperModule,InputNumberModule,InputOtpModule,RouterModule],
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
  requestId:any = null;
  isPasswordToggled: boolean = false;
  isRetypePasswordToggled: boolean = false;

  resetPasswordObj = {
    newPassword: signal(''),
    reTypedPassword: signal('')
  };

  isValid: Signal<boolean> = computed(() => 
    [
      this.resetPasswordObj.newPassword(), 
      this.resetPasswordObj.reTypedPassword()
    ].every(val => val !== '') && 
      this.resetPasswordObj.newPassword() ===  this.resetPasswordObj.reTypedPassword()
  );



  private timerSubscription!: Subscription;

  constructor(private authService:AuthService,private toastService:ToastService) {}


  async nextStep(callback : any,nextStep?:string) : Promise<any> {
    if(nextStep === 'otp') {
      await this.sendOtp(callback);
    } else if(nextStep === 'verify-otp') {
      await this.verifyOtp(callback);
    } else if(nextStep === 'reset-password') {
      await this.resetPassword(callback);
    }
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


  async sendOtp(callback : any) : Promise<any> {
    try {
      const response = await this.authService.sendSMSOtp(this.mobileNo);
      this.requestId = response?.data?.requestId;
      this.toastService.showSuccess('Success', response.data.message);
      this.startTimer();
      callback.emit();
    } catch (error : any) {
      console.log(error);
      this.toastService.showError('Error', error.error.data);
    }
  }
  

  async verifyOtp(callback:any) : Promise<any> {
    try {
      const response = await this.authService.validateOtp(this.requestId,this.otp);
      this.toastService.showSuccess('Success', response.data);
      callback.emit();
    } catch (error:any) {
      this.toastService.showError('Error', error.error.data);
    }
  }


  async resetPassword(callback:any) : Promise<any> {
    try {
      const response = await this.authService.resetPassword({requestId: this.requestId, newPassword: this.resetPasswordObj.newPassword()});
      console.log(response);
      this.toastService.showSuccess('Success', response.data);
      callback.emit();
    } catch (error:any) {
      this.toastService.showError('Error', error.error.data);
    }
  }

  async resendOtp(): Promise<any> {
    try {
      const response = await this.authService.resendOtp(this.requestId);
      console.log(response);
      this.toastService.showSuccess('Success', response?.data?.message);
    } catch (error:any) {
      this.toastService.showError('Error', error.error.data);
      
    }
  }


  togglePassword() {
    this.isPasswordToggled = !this.isPasswordToggled;
  }

  toggleRetypePassword() {
    this.isRetypePasswordToggled = !this.isRetypePasswordToggled;
  }

  disableEvent(event: ClipboardEvent) {
    event.preventDefault();
  }




}
