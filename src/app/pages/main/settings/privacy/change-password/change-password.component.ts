import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileService } from '../../../../../core/services/profile.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [PanelModule,CardModule,ButtonModule,DividerModule,InputTextModule,CommonModule,FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  isLoading: boolean = false;
  confirmNewPassword: WritableSignal<string> = signal('');
  resetPasswordObj = {
    oldPassword: signal(''),
    newPassword: signal('')
  };

  isValid: Signal<boolean> = computed(() => 
    [
      this.resetPasswordObj.oldPassword(), 
      this.resetPasswordObj.newPassword(), 
      this.confirmNewPassword()
    ].every(val => val !== '') && 
      this.resetPasswordObj.newPassword() === this.confirmNewPassword()
  );


  constructor(private profileService:ProfileService,private toastService:ToastService) {}


  async reset() : Promise<any> {
    const payload = {
      oldPassword: this.resetPasswordObj.oldPassword(),
      newPassword: this.resetPasswordObj.newPassword()
    }
    this.isLoading = true;
    try {
      const response = await this.profileService.resetPassword(payload);
      this.toastService.showSuccess('Success', response.data);
    } catch (error : any) {
      this.toastService.showError('Error', error.error.data);
    } finally{
      this.isLoading = false;
    }
  }
}
