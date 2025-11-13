import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { FitmentService } from '../../../../core/services/fitment.service';
import { CardModule } from 'primeng/card';
import { DeviceService } from '../../../../core/services/device.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-unmap-device',
  standalone: true,
  imports: [ToolbarModule, InputTextModule, ButtonModule, CommonModule, FormsModule, FloatLabelModule, CardModule],
  templateUrl: './unmap-device.component.html',
  styleUrl: './unmap-device.component.scss'
})
export class UnmapDeviceComponent {

  deviceToBeSearched: string = '860560065215859';
  deviceInfo: any = null; // Placeholder for device information
  loading: boolean = false; // Loading state for async operations
  unlinking: boolean = false; // Unlinking state for async operations

  constructor(private fitmentService: FitmentService, private deviceService: DeviceService, private toastService:ToastService) { }


  ngOnInit(): void {
    //Add 'implements OnInit' to the class.
    this.fetchDeviceInfo();
  }

  async fetchDeviceInfo(): Promise<void> {
   this.loading = true;
    try {
      const response = await this.fitmentService.getFitmentDetailsByImeiRegNO(this.deviceToBeSearched);
      this.deviceInfo = response?.data[0];

    } catch (error: any) {
      this.toastService.showError('Error', error?.error?.data || 'Failed to fetch device information');

    } finally{
      this.loading = false;
    }

  }


  async unLinkDevice(): Promise<void> {
    this.unlinking = true
    try {
      const response = await this.deviceService.unlinkDevice(this.deviceInfo?.device?.id);
      this.deviceInfo = null; // Clear device info after unlinking
      this.toastService.showSuccess('Success', response?.data);
    } catch (error: any) {
      console.error('Error unlinking device:', error);
      this.toastService.showError('Error', error?.error?.data || 'Failed to unlink device');
    } finally {
      this.unlinking = false;
    }
  }
}
