import { Component, output } from '@angular/core';
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
import { bulkUploadDeviceFormFields, deviceActivationFormFields, deviceCreateFormFields, deviceTransferInventoryFormFields, fitmentFormFields } from '../../../../../shared/constants/forms';
import { FormFields } from '../../../../../shared/interfaces/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { DeviceModelService } from '../../../../../core/services/device-model.service';
import { debounceTime, Subject } from 'rxjs';
import { downloadFile } from '../../../../../shared/utils/common';
import { DynamicUserService } from '../../../../../core/services/dynamic-user.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { SimProvidersService } from '../../../../../core/services/sim-providers.service';
import { VehicleCategoryService } from '../../../../../core/services/vehicle-category.service';
import { StatesService } from '../../../../../core/services/states.service';
import { RtoService } from '../../../../../core/services/rto.service';
import { FitmentService } from '../../../../../core/services/fitment.service';

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

  fields: FormFields[] | any[] = [];
  devices: any[] = [];
  columns = deviceColumns;
  isEditing: boolean = false;
  isLoading: boolean = false;
  deviceDialog: boolean = false;
  accesStepForm : boolean = false;
  device!: any;
  selectedDevices!: any[] | null;
  submitted: boolean = false;
  validationState: { [key: string]: boolean } = {};
  isValidated:boolean = false;
  currentAction: 'create' | 'edit' | 'bulkUpload' | 'tranferInventory' | 'activate' | 'fitment' | null = null;
  bulkUploadHeader:string = 'VendorCode|DeviceId|Imei|Iccid|MafYear|RfcCode';
  actions:any[] = [];
  stepFormFields: any[] = [];
  private validationDebounceSubject: Subject<{ fieldName: string; value: any }> = new Subject();
  private validationStepperDebounceSubject: Subject<{ fieldName: string; value: any }> = new Subject();



  constructor(private toastService: ToastService, private dynamicUserService:DynamicUserService, private simProviderService:SimProvidersService,
    private confirmationService: ConfirmationService,  private inventoryService:InventoryService, private vehicleCategory:VehicleCategoryService,
    private deviceService: DeviceService, private deviceModelService:DeviceModelService, private authService:AuthService,private stateService:StatesService,
  private rtoService:RtoService,private fitmentService:FitmentService) {
      this.validationDebounceSubject.pipe(
        debounceTime(400)
      ).subscribe(({ fieldName, value }) => {
        this.executeValidation(fieldName, value);
      });



      this.validationStepperDebounceSubject.pipe(
        debounceTime(400)
      ).subscribe(({ fieldName, value }) => {
        this.executeStepperValidation(fieldName, value);
      });
     }

  ngOnInit() {
    this.actions = this.authService.getUserRole() === 'Dealer' ? ['activate','fitment'] : 
                    (this.authService.getUserRole() === 'Distributor' || this.authService.getUserRole() === 'Admin') ? [] :  
                    ['edit']
    this.fetchDevices().then();
  }

  private async executeStepperValidation(fieldName: string, value: any): Promise<void> {    
    const fieldValidationMapping: { [key: string]: (val: string) => Promise<any> } = {
      vehicleNo : this.fitmentService.isVehicleNoValid.bind(this.deviceService),
    };
    
    if(fieldValidationMapping[fieldName]) {
      try {
        const response = await fieldValidationMapping[fieldName](value);
        if(!response.data.isDuplicate) {
          try {
            const vehicleDetails = await this.fitmentService.getVehicleDetails(value);
            console.log(vehicleDetails,'vehicleDetails');
            this.device.vehicleMake = vehicleDetails?.data?.vehicleMake;
            this.device.vehicleModel = vehicleDetails?.data?.vehicleModel;
            this.device.chassisNo = vehicleDetails?.data?.chassisNumber;
            this.device.engineNo = vehicleDetails?.data?.vehicleEngineNo;
          } catch (error) {
            console.log(error);
            this.device.vehicleMake = null;
            this.device.vehicleModel = null;
            this.device.chassisNo = null;
            this.device.engineNo = null;
          }
        } else {
            this.device.vehicleMake = null;
            this.device.vehicleModel = null;
            this.device.chassisNo = null;
            this.device.engineNo = null;
        }
        this.validationState[fieldName] = !response.data.isDuplicate;
      } catch (error) {
        this.validationState[fieldName] = false;
        console.error(`Error validating ${fieldName}:`, error);
      }
    }    

    this.isValidated = Object.values(this.validationState).every(val => val === true);
  
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
  async generateDropdownValues(type: 'create' | 'edit' | 'bulkUpload' | 'tranferInventory' | 'activate'): Promise<any> {
    try {
      const response = (type === 'create' || type === 'edit' || type === 'bulkUpload') ? await this.deviceModelService.getList() : 
                        (type === 'activate') ? await this.simProviderService.getList() :
                        await this.dynamicUserService.getList();
      // Determine which form fields to use based on the 'type'
      const formFields = (type === 'create' || type === 'edit') ? deviceCreateFormFields : 
                          type === 'bulkUpload' ? bulkUploadDeviceFormFields :  type === 'activate' ? deviceActivationFormFields :
                          deviceTransferInventoryFormFields;
  
      formFields[0].options = response.data.map((obj: any) => {
        const keys = Object.keys(obj);       
        const idKey: any = keys.find(key => key.includes((type === 'create' || type === 'edit' || type === 'bulkUpload' || type === 'activate') ? 'id' : 'sno'));
        const nameKey: any = keys.find(key => key.includes((type === 'create' || type === 'edit' || type === 'bulkUpload') ? 'modelName' : (type === 'activate') ? 'providerName' : 'name'));
  
        // Setting dropdownKeys based on found keys
        formFields[0].dropdownKeys = { idKey, nameKey };


  
        return (type === 'create' || type === 'edit' || type === 'bulkUpload')
          ? {
            id: obj[idKey],
            modelName: obj[nameKey],
          }
          : (type === 'activate')
            ? {
              id: obj[idKey],
              providerName: obj[nameKey],
            }
            : {
              sno: obj[idKey],
              name: obj[nameKey],
            };
      });
  
      console.log(formFields);
  
      // Show success message (optional)
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      // If there's an error, clear the options
      const formFields = (type === 'create' || type === 'edit') ? deviceCreateFormFields : 
                          type === 'bulkUpload' ? bulkUploadDeviceFormFields : type === 'activate' ? deviceActivationFormFields : 
                          deviceTransferInventoryFormFields;
  
      formFields[0].options = [];
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    }
  }



  // async generateTranferInventoryDropdownValues(): Promise<any> {
  //   try {
  //     const response = await this.dynamicUserService.getList();
  //     deviceTransferInventoryFormFields[0].options = response.data.map((user: any) => {
  //       const keys = Object.keys(user);
  //       const idKey: any = keys.find(key => key.includes('sno'));
  //       const nameKey: any = keys.find(key => key.includes('name'));
  //       // const valueKey: any = keys.find(key => key.includes('sno'));
  //       deviceTransferInventoryFormFields[0].dropdownKeys = { idKey, nameKey };
  //       return {
  //         sno: user[idKey],
  //         name: user[nameKey],
  //         // id: user[valueKey]
  //       };
  //     });

  //     // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
  //   } catch (error) {
  //     this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
  //   }
  // }




  async fetchDevices(): Promise<any> {
    this.isLoading = true;
    this.devices = [];
    try {
      const { data } = await this.deviceService.getList(500, 1);
      this.devices = data?.items || []; // Use optional chaining for safety
      console.log(data);
  
      const { pageSize, totalPage } = data;
  
      // Create an array of promises for fetching all pages
      const pageRequests = Array.from({ length: totalPage - 1 }, (_, i) =>
        this.deviceService.getList(pageSize, i + 2) // Start from page 2
      );
  
      // Wait for all requests to complete
      const responses = await Promise.all(pageRequests);
  
      // Concatenate all items from the responses
      responses.forEach(response => {
        this.devices = this.devices.concat(response.data?.items || []);
      });
  
      // Optional: Show success message
      // this.toastService.showSuccess('Success', `${this.authService.getUser Type()} List fetched successfully!`);
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

  resetTransferInventoryDevice() {
    return {
      user:null,
      no_of_device:[]
    }
  }


  resetDeviceFitment(selectedDevice : any) {
    return {
      deviceSno:selectedDevice.sno,
      isOld: null,
      vehicleCategory: {
          id: null,
          name: ""
      },
      manufacturingYear: "",
      vehicleNo: "",
      chassisNo: "",
      engineNo: "",
      vehicleMake: "",
      vehicleModel: "",
      state: {
          id: null,
          stateName: ""
      },
      rto: {
          id: null,
          rtoName: ""
      },
      permitHolderName: "",
      permitHolderMobile: "",
      aadhaarNumber: ""
  };
  }

  resetActivationDevice() {
    return {
      sim:null
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
        await this.fetchAndResetDevice();
      } else if (this.currentAction === 'create') {
        await this.createDevice(data);
        await this.fetchAndResetDevice();
      } else if (this.currentAction === 'bulkUpload') {
        const formData = new FormData();
        formData.append('file', data.file, data.file.name)
        formData.append('modelId', data.model.id.toString());

        const fileReader = new FileReader();
        fileReader.onload = async (e: any) => {
          const fileContent = e.target.result;
          const firstLine = fileContent.split('\n')[0].trim(); // Read the first row
          if (firstLine === this.bulkUploadHeader) {
            try {
              await this.handleBulkUpload(formData); // Proceed if bulk upload succeeds
              await this.fetchAndResetDevice(); // Close dialog and reset state after success
            } catch (error) {
              // Handle bulk upload error, keep dialog open
              console.error('Bulk upload failed:', error);
            }
          } else {
            return this.toastService.showError('Error', 'Invalid file format. Please upload a file with the correct headers.');
          }
        };
      
        fileReader.readAsText(data.file);
      } else if(this.currentAction === 'activate') {
        await this.activateDevice(data);
      } else if(this.currentAction === 'tranferInventory') {
        await this.transferInventory(data);
      } else {
        await this.createDeviceFitment(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createDeviceFitment(data: any): Promise<any> {
    const { isOld, vehicleCategory, vehicleModel, vehicleMake, vehicleNo, chassisNo, engineNo, manufacturingYear, rto, sno, permitHolderName, permitHolderMobile, aadhaarNumber } = data;

    const payload = {
      vehicle: {
        isOld,
        vehicleCategory,
        vehicleModel,
        vehicleMake,
        vehicleNo,
        chassisNo,
        engineNo,
        manufacturingYear
      },
      rto: rto.id,
      deviceSno: sno,
      permitHolderName,
      permitHolderMobile,
      aadhaarNumber
    };


    console.log(payload,'payload');

    try {
      const response = await this.fitmentService.createFitment(payload);
      this.toastService.showSuccess('Success', response.data);
    } catch (error: any) {
      this.toastService.showError('Error', error.error.data);
    }
  }


  async transferInventory({ user, no_of_device } : { user : { sno:number, name:string }, no_of_device : string }) : Promise<any> {
    const payload = { 
      userId: user.sno,
      DeviceId: this.devices.slice(0, +no_of_device).map((device: any) => device.id) // Limiting to the first 5 devices
   };
     try {
       const response = await this.inventoryService.transferInventory(payload);
       this.toastService.showSuccess('Success', response.data);
     } catch (error : any) {
       this.toastService.showError('Error', error.error.data.message);
     }
  }

  async activateDevice({ sim } : { sim : any }) : Promise<any> {
    try {
      const response = await this.deviceService.activateDevice(sim,this.device);
      this.toastService.showSuccess('Success', response.data);
    } catch (error : any) {
      this.toastService.showError('Error', error.error.data.message);
    }
    
  }

  exportSampleBulkUpload(event : any) {
    if(event) {
      downloadFile([`VendorCode|DeviceId|Imei|Iccid|MafYear|RfcCode\nT6|ABC6T4I011900000001|861359037709909|8991000904643962735|08/2024|26`], 'sample_bulk_upload.txt','text/plain');
    } 
  }


  async fetchAndResetDevice(): Promise<any> {
    await this.fetchDevices();
    this.deviceDialog = false;
    this.device = this.resetDevice();
    this.isEditing = false;
    this.currentAction = null;
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
      downloadFile(error?.error?.data?.error, 'error_rows.txt','text/plain');
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
    this.isValidated = true;
    this.device = this.resetBulkUploadDevice();
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
    this.device = null;
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



  onInputTextChange({ field, value }: any) {
    console.log(field);
    if(field.hasOwnProperty('validation')) {
      const fieldName = field.name;
      this.validationDebounceSubject.next({ fieldName, value });
    }
  }


  stepperInputTextChange({ field, value }: any) {
    console.log(field,value);
    if(field.hasOwnProperty('validation')) {
      const fieldName = field.name;
      this.validationStepperDebounceSubject.next({ fieldName, value });
    }
  }


  onSelectionChange(event: any) {
    console.log(event);
  }


  async onTransferInventory(event:any) : Promise<any> {
    this.currentAction = 'tranferInventory';
    await this.generateDropdownValues('tranferInventory');
    this.fields = deviceTransferInventoryFormFields;
    this.isEditing = !event;
    this.isValidated = true;
    this.device = this.resetTransferInventoryDevice();
    this.deviceDialog = event;
  }


  async onActivate(event: any) : Promise<any> {
    console.log(event);   
    this.currentAction = 'activate';
    await this.generateDropdownValues('activate');
    this.fields = deviceActivationFormFields;
    this.isEditing = !event;
    this.isValidated = true;
    this.device = event.item;
    this.deviceDialog = event;
  }


  constructStepperValidationState(fields: any[]): void {
    console.log(fields,'construct');
    fields.map((field) => {
    field.fields.map((object:any)=> {
      if (object.hasOwnProperty('validation') && object.validation) {
        this.validationState[object.name] = false; // Invalid or new entry case
      }
    })
    })

    this.isValidated = Object.values(this.validationState).every(val => val === true);
  }

  async onFitment(event: any) : Promise<any> {
    console.log(event);   
    this.currentAction = 'fitment';
    this.accesStepForm = true;
    this.generateAllDropdownValuesStepForm(fitmentFormFields,event);
    this.constructStepperValidationState(this.stepFormFields);
    this.isEditing = !event;
    this.device = this.resetDeviceFitment(event.item);
    this.deviceDialog = event;
  }


  async generateAllDropdownValuesStepForm(form:any,event:any) : Promise<any> {
    console.log(event.item);
    form[0].fields.map(async (object:any)=>{
      if(object.type === 'dropdown' && object.name !== 'isOld') {
        const response = await this.vehicleCategory.getList();
        object.options = response.data.map((obj: any) => {
          const keys = Object.keys(obj);
          const idKey: any = keys.find(key => key.includes('id'));
          const nameKey: any = keys.find(key => key.includes('name'));
          object.dropdownKeys = { idKey, nameKey };
          return {
            id: obj[idKey],
            name: obj[nameKey],
          };
        })
      }
    });

    form[1].fields.map(async (object:any)=>{
      if(object.name === 'state') {
        const response = await this.stateService.getList();
        console.log(response);

        object.options = response.data.map((obj: any) => {
          const keys = Object.keys(obj);
          const idKey: any = keys.find(key => key.includes('id'));
          const nameKey: any = keys.find(key => key.includes('stateName'));
          object.dropdownKeys = { idKey, nameKey };
          return {
            id: obj[idKey],
            stateName: obj[nameKey],
          };
        })
        
      }
    })

    form[2].fields.map((object:any)=>{
      if(object.name === 'iccid' || object.name === 'sno') {
        object.value = event.item[object.name]
      } else {
        if(event?.item?.simDetails) {
          object.value = event?.item?.simDetails[object.name]
        }
      }
    });
    
    console.log(form);
    this.stepFormFields = form;
    
  }

  async stepperDropdwonChange(event: any) : Promise<any> {
    const  { fieldName , selectedValue } = event;
    if(fieldName === 'state') {
      this.stepFormFields[1].fields.map(async (object:any)=>{
        if(object.name === 'rto') {
          try {
            const response = await this.rtoService.getList(selectedValue);
            object.options = response.data.map((obj: any) => {
              const keys = Object.keys(obj);
              const idKey: any = keys.find(key => key.includes('id'));
              const nameKey: any = keys.find(key => key.includes('rtoName'));
              object.dropdownKeys = { idKey, nameKey };
              return {
                id: obj[idKey],
                rtoName: obj[nameKey],
              };
            })
          } catch (error) {
            object.options = [];
          }
        }
      })
    }
  }

}
