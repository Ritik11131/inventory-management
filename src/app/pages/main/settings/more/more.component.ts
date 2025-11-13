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
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { previousFirmwaresTableColumns } from '../../../../shared/constants/columns';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [PanelModule, CardModule, ButtonModule, DividerModule, InputTextModule, CommonModule, FormsModule, DropdownModule, FileUploadModule, GenericDialogComponent],
  templateUrl: './more.component.html',
  styleUrl: './more.component.scss'
})
export class MoreComponent {
  uploadingCertificate: boolean = false;
  oemList: any[] = [];
  selectedOem: any;
  firmwareFile!: File;

  previousFirmwaresTableColumns = previousFirmwaresTableColumns;
  currentDialogTitle:any = '';
  currentDialogData:any[] = []
  dialogVisible: boolean = false;
  isDialogTableLoading: boolean = false;

  constructor(private dynamicuserService: DynamicUserService, private toastService: ToastService, private moreService: MoreService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initMethods();
  }

  async initMethods() {
    try {
      const response = await this.dynamicuserService.getList();
      this.oemList = response.data;
    } catch (error) {
      console.error('Error during initialization:', error);
      // Handle error appropriately, e.g., show a toast notification
      this.oemList = [];

    }

  }



  onSelect(event: any) {
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
  this.dialogVisible = true;
  this.currentDialogTitle = 'Previous Uploaded Firmwares';
  this.isDialogTableLoading = true;

  if (!event?.value?.sno) {
    this.toastService.showError('Invalid Selection', 'No OEM serial number found.');
    return;
  }

  try {
    this.uploadingCertificate = true;

    const response = await this.moreService.getPreviousCertificate(event.value.sno);
    this.currentDialogData = response?.data;
  } catch (error) {
    console.error('Error fetching previous certificate:', error);
    this.toastService.showError('Error', 'No previous certificate found.');
    this.currentDialogData = [];
  } finally {
    this.uploadingCertificate = false;
    this.isDialogTableLoading = false;
  }  
}

  onHideDialog(isVisible: boolean) {
    this.dialogVisible = isVisible;
    this.currentDialogData = [];
    this.currentDialogTitle = '';
  }


}
