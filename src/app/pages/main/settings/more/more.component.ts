import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MoreService } from '../../../../core/services/more.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [PanelModule, CardModule, ButtonModule, DividerModule, InputTextModule, CommonModule, FormsModule, DropdownModule, FileUploadModule],
  templateUrl: './more.component.html',
  styleUrl: './more.component.scss'
})
export class MoreComponent {
  uploadingCertificate: boolean = false;
  oemList: any[] = [];
  selectedOem: any;
  firmwareFile!: File;

  constructor(private dynamicuserService: DynamicUserService, private toastService: ToastService, private moreService: MoreService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initMethods();
  }

  async initMethods() {
    try {
      const response = await this.dynamicuserService.getList();
      console.log(response);
      this.oemList = response.data;
    } catch (error) {
      console.error('Error during initialization:', error);
      // Handle error appropriately, e.g., show a toast notification
      this.oemList = [];

    }

  }



  onSelect(event: any) {
    console.log(event);
    this.firmwareFile = event?.currentFiles[0];
  }

 async uploadCertificate(): Promise<void> {
  if (!this.firmwareFile || !this.selectedOem?.sno) {
    this.toastService.showError('Error', 'Please select a valid OEM and upload a certificate file.');
    return;
  }

  try {
    // Optional: Show loading indicator
    this.uploadingCertificate = true;

    const response = await this.moreService.uploadFirmware(this.firmwareFile, this.selectedOem.sno);
    console.log('Upload Response:', response);

    this.toastService.showSuccess('Certificate uploaded successfully!', 'Success');
  } catch (error) {
    console.error('Upload failed:', error);
    this.toastService.showError('Upload Failed', 'Unable to upload certificate. Please try again.');
  } finally {
    // Optional: Hide loading indicator
    this.uploadingCertificate = false;
  }
}


async onOemChange(event: any): Promise<void> {
  console.log('OEM Change Event:', event);

  if (!event?.value?.sno) {
    this.toastService.showError('Invalid Selection', 'No OEM serial number found.');
    return;
  }

  try {
    this.uploadingCertificate = true;

    const response = await this.moreService.getPreviousCertificate(event.value.sno);
    console.log('Previous Certificate Response:', response);

    const firmwareUrl = response?.data?.[0]?.firmwareUrl;

    if (firmwareUrl) {
      saveAs(firmwareUrl, 'Previous_Uploaded_Certificate');
    } else {
      this.toastService.showWarn('No Certificate', 'No previous certificate available for this OEM.');
    }

  } catch (error) {
    console.error('Error fetching previous certificate:', error);
    this.toastService.showError('Error', 'No previous certificate found.');
  } finally {
    this.uploadingCertificate = false;
  }
}


}
