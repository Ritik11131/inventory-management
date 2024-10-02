import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileService } from '../../../../../core/services/profile.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../../../shared/interfaces/profile';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [PanelModule, CardModule, ButtonModule, DividerModule, InputTextModule, CommonModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {

  isLoading: boolean = false;

  profileObject : Profile = {
    sno: -1,
    loginId: '',
    contactPersonName: '',
    mobileNo: '',
    email: '',
    orgName: ''
  }


  constructor(private profileService: ProfileService, private toastService: ToastService) { }



  ngOnInit(): void {
    this.getProfile().then();
      
  }


  async updateProfile() : Promise<any> {
    this.isLoading = true;
      try {
        const response = await this.profileService.updateProfileDetails(this.profileObject);
        this.toastService.showSuccess('Success', 'Profile updated successfully!');
      } catch (error : any) {
        this.toastService.showError('Error', error.error.data);
      } finally {
        this.isLoading = false;
      }
  }

  async getProfile() : Promise<any> {
    try {
     const response = await this.profileService.getProfileDetails();
     this.profileObject = response.data;
     this.toastService.showSuccess('Success', 'Profile fetched successfully!');
    } catch (error) {
    this.toastService.showError('Error', 'Failed to fetch profile!');
    }
  }

}
