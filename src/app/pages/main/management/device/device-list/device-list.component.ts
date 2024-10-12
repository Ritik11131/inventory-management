import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GenericTableComponent } from '../../../../../shared/components/generic-table/generic-table.component';
import { GenericDialogComponent } from '../../../../../shared/components/generic-dialog/generic-dialog.component';
import { ToastService } from '../../../../../core/services/toast.service';
import { deviceColumns } from '../../../../../shared/constants/columns';
import { DeviceService } from '../../../../../core/services/device.service';
import { deviceCreateFormFields } from '../../../../../shared/constants/forms';
import { FormFields } from '../../../../../shared/interfaces/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { DeviceModelService } from '../../../../../core/services/device-model.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule,
    InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule,
    RatingModule, InputTextModule, FormsModule, InputNumberModule, GenericDialogComponent, GenericTableComponent, ConfirmDialogModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  providers: [ConfirmationService]
})
export class DeviceListComponent {

  fields: FormFields[] = deviceCreateFormFields;
  devices: any[] = [];
  columns = deviceColumns;
  isEditing: boolean = false;
  isLoading: boolean = false;
  deviceDialog: boolean = false;
  device!: any;
  selectedDevices!: any[] | null;
  submitted: boolean = false;


  constructor(private toastService: ToastService, 
    private confirmationService: ConfirmationService, 
    private deviceService: DeviceService, private deviceModelService:DeviceModelService, private authService:AuthService) { }

  ngOnInit() {
    this.fetchDevices().then();
  }



  async generateDropdownValues() : Promise<any> {
    try {
      const response = await this.deviceModelService.getList();
      deviceCreateFormFields[0].options = response.data.map((obj: any) => {
        const keys = Object.keys(obj);       
        const idKey:any = keys.find(key => key.includes('id'));
        const nameKey:any = keys.find(key => key.includes('modelName'));
        // const valueKey:any = keys.find(key => key.toLowerCase().includes('id'));
        deviceCreateFormFields[0].dropdownKeys = { idKey, nameKey };
        return {
          id: obj[idKey],
          modelName: obj[nameKey],
        };
      });
      console.log(deviceCreateFormFields);
      
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    }
  }



  async fetchDevices(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.deviceService.getList();
      this.devices = response.data;
      // this.tdveoastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch Device List!`);
    } finally {
      this.isLoading = false;
    }
  }


  resetDeviceModel() {
    return {
      model: null,
      imei: "",
      iccid:"",
      sno:""
    };
  }


  async onSaveDevice(data: any): Promise<any> {
    try {
      if (this.device.id) {
        await this.updateDevice(data);
      } else {
        await this.createDevice(data);
      }
      await this.fetchDevices();
      this.deviceDialog = false;
      this.device = this.resetDeviceModel();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }



  async createDevice(data: any): Promise<any> {
    try {
      const response = await this.deviceService.createDevice(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Created Successfully!');
    } catch (error: any) {
      this.toastService.showError('Error', error.error.data);
      throw error;
    }
  }


  async updateDevice(data: any): Promise<any> {
    try {
      const response = await this.deviceService.updateDevice(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Updated Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to update State!`);
      throw error;
    }
  }


  async openNew(event: any) : Promise<any> {
    await this.generateDropdownValues();
    this.isEditing = !event;
    this.device = this.resetDeviceModel();
    this.deviceDialog = event;
  }


  async onEditDevice(state: any) : Promise<any> {
    await this.generateDropdownValues();
    this.isEditing = true;
    console.log('Editing user:', state);
    this.device = { ...state };
    this.deviceDialog = true;
  }


  onHideDialog(isVisible: boolean) {
    this.deviceDialog = isVisible;
    this.isEditing = false;
  }


  async onDeleteDevice(event: any): Promise<any> {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Device?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: async () => {
        try {
          const response = await this.deviceService.deleteDevice(event.item);
          console.log(response);
          this.toastService.showSuccess('Success', 'Provider Deleted Successfully!');
        } catch (error) {
          this.toastService.showError('Error', `Failed to delete Provider!`);
        }
      },
      reject: () => {
        this.toastService.showInfo('Rejected', 'You have rejected');
      }
    });
  }



  onInputTextChange(event: any) {
    // console.log(event);
  }


  onSelectionChange(event: any) {
    console.log(event);
  }

}
