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
import { bulkUploadDeviceFormFields, deviceCreateFormFields } from '../../../../../shared/constants/forms';
import { FormFields } from '../../../../../shared/interfaces/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { DeviceModelService } from '../../../../../core/services/device-model.service';
import { debounceTime, Subject } from 'rxjs';

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

  fields: FormFields[] = [];
  devices: any[] = [];
  columns = deviceColumns;
  isEditing: boolean = false;
  isLoading: boolean = false;
  deviceDialog: boolean = false;
  device!: any;
  selectedDevices!: any[] | null;
  submitted: boolean = false;
  validationState: { [key: string]: boolean } = {};
  isValidated:boolean = false;
  currentAction: 'create' | 'edit' | 'bulkUpload' | null = null;
  private validationDebounceSubject: Subject<{ fieldName: string; value: any }> = new Subject();



  constructor(private toastService: ToastService, 
    private confirmationService: ConfirmationService, 
    private deviceService: DeviceService, private deviceModelService:DeviceModelService, private authService:AuthService) {
      this.validationDebounceSubject.pipe(
        debounceTime(400)
      ).subscribe(({ fieldName, value }) => {
        this.executeValidation(fieldName, value);
      });
     }

  ngOnInit() {
    this.fetchDevices().then();
  }


  private async executeValidation(fieldName: string, value: any): Promise<void> {
    const fieldValidationMapping: { [key: string]: (val: string) => Promise<any> } = {
      iccid: this.deviceService.isICCIDValid.bind(this.deviceService),
      imei: this.deviceService.isIMEIValid.bind(this.deviceService),
      sno: this.deviceService.isDeviceSNoValid.bind(this.deviceService),
    };
    
    const field : FormFields[] | any = deviceCreateFormFields.find((field) => field.name === fieldName);

    if (fieldValidationMapping[fieldName]) {
      try {
        const response = await fieldValidationMapping[fieldName](value);
        this.validationState[fieldName] = !response.data.isDuplicate;
      } catch (error) {
        this.validationState[fieldName] = false;
        console.error(`Error validating ${fieldName}:`, error);
      }
    } else if (field && field.validation && field.dependent) {
      const isValid = field.validation(this.device);
      this.validationState[fieldName] = isValid;
  
      // Automatically validate dependent fields
      if (isValid && field.dependent.length) {
        field.dependent.forEach((depFieldName : any) => {
          const dependentField : any = deviceCreateFormFields.find(f => f.name === depFieldName);
          if (dependentField && dependentField.validation) {
            this.validationState[depFieldName] = dependentField.validation(this.device);
          }
        });
      } else {
        field.dependent.forEach((depFieldName : any) => {
          this.validationState[depFieldName] = false;
        });
      }
    } else {
      this.validationState[fieldName] = true;
    }

    this.isValidated = Object.values(this.validationState).every(val => val === true);
    console.log(this.validationState, 'validation state');
  }

  constructValidationState(fields: any[]): void {
    fields.forEach((field) => {
      if (field.hasOwnProperty('validation') && field.validation === true) {
        // Check if validationState already has the field; if not, initialize it
        if (this.isEditing) {
          this.validationState[field.name] = true; // Valid for edit case if data exists
        } else {
          this.validationState[field.name] = false; // Invalid or new entry case
        }
      }
    });
    this.isValidated = Object.values(this.validationState).every(val => val === true);
  }

  /**
   * Populate the model dropdown with the list of available device models.
   * 
   * @returns {Promise<any>} Resolves with the populated dropdown options.
   */
  async generateDropdownValues(type: 'create' | 'edit' | 'bulkUpload'): Promise<any> {
    try {
      const response = await this.deviceModelService.getList();
      // Determine which form fields to use based on the 'type'
      const formFields = (type === 'create' || type === 'edit') 
        ? deviceCreateFormFields 
        : bulkUploadDeviceFormFields;
  
      formFields[0].options = response.data.map((obj: any) => {
        const keys = Object.keys(obj);       
        const idKey: any = keys.find(key => key.includes('id'));
        const nameKey: any = keys.find(key => key.includes('modelName'));
  
        // Setting dropdownKeys based on found keys
        formFields[0].dropdownKeys = { idKey, nameKey };
  
        return {
          id: obj[idKey],
          modelName: obj[nameKey],
        };
      });
  
      console.log(formFields);
  
      // Show success message (optional)
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      // If there's an error, clear the options
      const formFields = (type === 'create' || type === 'edit') 
        ? deviceCreateFormFields 
        : bulkUploadDeviceFormFields;
  
      formFields[0].options = [];
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


  resetDevice() {
    return {
      model: null,
      imei: "",
      iccid:"",
      sno:""
    };
  }

  resetBulkUploadDevice() {
    return {
      model: null,
      file:null
    };
  }


  async onSaveDevice(data: any): Promise<any> {
    try {
      if (this.device.id && this.currentAction === 'edit') {
        await this.updateDevice(data);
      } else if (this.currentAction === 'create') {
        await this.createDevice(data);
      } else if (this.currentAction === 'bulkUpload') {
        const formData = new FormData();
        formData.append('file', data.file, data.file.name)
        formData.append('modelId', data.model.id.toString());
        await this.handleBulkUpload(formData);
      }
      await this.fetchDevices();
      this.deviceDialog = false;
      this.device = this.resetDevice();
      this.isEditing = false;
      this.currentAction = null;
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

  async handleBulkUpload(data: any): Promise<any> {
    try {
      const response = await this.deviceService.bulkUpload(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Created Successfully!');
    } catch (error: any) {
      this.toastService.showError('Error', error.error.data.message);
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
    this.currentAction = 'create';
    this.fields = deviceCreateFormFields;
    await this.generateDropdownValues('create');
    this.isEditing = !event;
    this.constructValidationState(this.fields);
    this.device = this.resetDevice();
    this.deviceDialog = event;
  }

  async bulkUploadDevice(event: any) : Promise<any> {
    this.currentAction = 'bulkUpload';
    await this.generateDropdownValues('bulkUpload');
    this.fields = bulkUploadDeviceFormFields;
    this.isEditing = !event;
    this.isValidated = true
    this.device = this.resetBulkUploadDevice();
    // this.constructValidationState(this.fields);
    this.deviceDialog = event;
  }


  async onEditDevice(state: any) : Promise<any> {
    this.currentAction = 'edit';
    this.fields = deviceCreateFormFields;
    await this.generateDropdownValues('create');
    this.isEditing = true;
    this.constructValidationState(this.fields);
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



  onInputTextChange({ fieldName, value }: any) {
    this.validationDebounceSubject.next({ fieldName, value });
    // console.log(event);
  }


  onSelectionChange(event: any) {
    console.log(event);
  }

}
