import { Component, OnInit } from '@angular/core';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { FormFields } from '../../../../shared/interfaces/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';
import { deviceModelFormFields } from '../../../../shared/constants/forms';
import { DeviceModelService } from '../../../../core/services/device-model.service';
import { deviceColumns } from '../../../../shared/constants/columns';

@Component({
  selector: 'app-device-model',
  standalone: true,
  imports: [GenericDialogComponent,GenericTableComponent],
  templateUrl: './device-model.component.html',
  styleUrl: './device-model.component.scss'
})
export class DeviceModelComponent implements OnInit {

  fields: FormFields[] = deviceModelFormFields;
  deviceModels: any[] = [];
  columns = deviceColumns;
  isEditing: boolean = false;
  isLoading: boolean = false;
  deviceModelDialog: boolean = false;
  deviceModel!: any;
  submitted: boolean = false;

  constructor(private toastService:ToastService,private authService:AuthService,private dynamicUserService:DynamicUserService,
    private deviceModelService:DeviceModelService) {}



    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.fetchDevices().then();
    }



    
    
  async fetchDevices(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.deviceModelService.getList();
      this.deviceModels = response.data;
      // this.tdveoastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch Device List!`);
    } finally {
      this.isLoading = false;
    }
  }


  async generateDropdownValues() : Promise<any> {
    try {
      const response = await this.dynamicUserService.getList();
      deviceModelFormFields[0].options = response.data.map((user: any) => {
        const keys = Object.keys(user);        
        const idKey:any = keys.find(key => key.toLowerCase().includes('sno'));
        const nameKey:any = keys.find(key => key.toLowerCase().includes('name'));
        const valueKey:any = keys.find(key => key.toLowerCase().includes('sno'));
        deviceModelFormFields[0].dropdownKeys = { idKey, nameKey, valueKey };
        return {
          sno: user[idKey],
          name: user[nameKey],
          id: user[valueKey]
        };
      });
      console.log(deviceModelFormFields);
      
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    }
  }


  resetDeviceModel() {
    return {
      OemId: undefined,
      ModelName: "",
    };
  }


  async onSaveDeviceModel(data: any): Promise<any> {
    console.log(data);
    
    try {
      if (this.deviceModel.id) {
        await this.updateDevice(data);
      } else {
        await this.createDevice(data);
      }
      await this.fetchDevices();
      this.deviceModelDialog = false;
      this.deviceModel = this.resetDeviceModel();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }



  async createDevice(data: any): Promise<any> {
    try {
      const payload = {
        OemID:data.OemId.id,
        ModelName: data.ModelName
      }
      const response = await this.deviceModelService.createDeviceModel(payload);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Created Successfully!');
    } catch (error: any) {
      this.toastService.showError('Error', error.error.data);
      throw error;
    }
  }


  async updateDevice(data: any): Promise<any> {
    // try {
    //   const response = await this.deviceService.updateDevice(data);
    //   console.log(response);
    //   this.toastService.showSuccess('Success', 'Provider Updated Successfully!');
    // } catch (error) {
    //   this.toastService.showError('Error', `Failed to update State!`);
    //   throw error;
    // }
  }


  async openNew(event: any) : Promise<any> {
    await this.generateDropdownValues();
    this.isEditing = !event;
    this.deviceModel = this.resetDeviceModel();
    this.deviceModelDialog = event;
  }


  async onEditDeviceModel(state: any) : Promise<any> {
    await this.generateDropdownValues();
    this.isEditing = true;
    console.log('Editing user:', state);
    this.deviceModel = { ...state };
    this.deviceModelDialog = true;
  }


  onHideDialog(isVisible: boolean) {
    this.deviceModelDialog = isVisible;
    this.isEditing = false;
  }


  async onDeleteDeviceModel(event: any): Promise<any> {
    // console.log(event);
    // this.confirmationService.confirm({
    //   target: event.target as EventTarget,
    //   message: 'Do you want to delete this Device?',
    //   header: 'Delete Confirmation',
    //   icon: 'pi pi-info-circle',
    //   acceptButtonStyleClass: "p-button-danger p-button-text",
    //   rejectButtonStyleClass: "p-button-text p-button-text",
    //   acceptIcon: "none",
    //   rejectIcon: "none",
    //   accept: async () => {
    //     try {
    //       const response = await this.deviceService.deleteDevice(event.item);
    //       console.log(response);
    //       this.toastService.showSuccess('Success', 'Provider Deleted Successfully!');
    //     } catch (error) {
    //       this.toastService.showError('Error', `Failed to delete Provider!`);
    //     }
    //   },
    //   reject: () => {
    //     this.toastService.showInfo('Rejected', 'You have rejected');
    //   }
    // });
  }



  onInputTextChange(event: any) {
    // console.log(event);
  }


  onSelectionChange(event: any) {
    console.log(event);
  }





}
