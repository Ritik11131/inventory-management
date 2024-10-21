import { DynamicUser } from './../../../../shared/interfaces/dynamic-user.model';
import { DynamicUserService } from './../../../../core/services/dynamic-user.service';
import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../../core/services/toast.service';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../../core/services/auth.service';
import { dynamicUserColumns } from '../../../../shared/constants/columns';
import { dynamicUserCreateFormFields, linkRtoFormFields } from '../../../../shared/constants/forms';
import { debounceTime, Subject } from 'rxjs';
import { FormFields } from '../../../../shared/interfaces/forms';
import { StatesService } from '../../../../core/services/states.service';
import { RtoService } from '../../../../core/services/rto.service';


@Component({
  selector: 'app-dynamic-user',
  standalone: true,
  imports: [GenericDialogComponent, GenericTableComponent, ConfirmDialogModule],
  templateUrl: './dynamic-user.component.html',
  styleUrl: './dynamic-user.component.scss',
  providers: [ConfirmationService]

})
export class DynamicUserComponent {

  fields: any[] = [];
  users: DynamicUser[] = [];
  columns = dynamicUserColumns
  userDialog: boolean = false;
  user!: DynamicUser;
  selectedUsers!: any;
  isEditing:boolean = false;
  userType!: string;
  selectionMode!: 'single' | 'multiple' | 'none';
  hideFields: string[] = [];
  validationState: { [key: string]: boolean } = {};
  isValidated:boolean = false;
  isLoading:boolean = false;
  unlinked:any[] = [];
  linked:any[] = [];
  currentAction: 'create' | 'edit' | 'linkRTO' | null = null;
  private validationDebounceSubject: Subject<{ fieldName: string; value: any }> = new Subject();


  constructor(private toastService: ToastService, private confirmationService: ConfirmationService,
    private authService: AuthService, private dynamicUserService: DynamicUserService,private stateService:StatesService,private rtoService:RtoService) {
    this.validationDebounceSubject.pipe(
      debounceTime(400)
    ).subscribe(({ fieldName, value }) => {
      this.executeValidation(fieldName, value);
    });
  }

  ngOnInit() {
    this.userType = this.authService.getUserType();
    this.selectionMode = this.userType === 'Dealer' ? 'single' : 'none';
    console.log(this.selectionMode);
    
    if (this.selectionMode === 'none') {
      // Check if the 'index' column does not exist in the columns array
      if (!this.columns.find(col => col.field === 'index')) {
        this.columns.unshift({ field: 'index', header: 'S.NO', minWidth: '7rem' });
      }
    }
    this.fetchDynamicUserList().then();
  }


  async generateStatesOptions() : Promise<any> {
    try {
      const response = await this.stateService.getList();
      this.generaTetoolBarStateOptions(response)
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    }
  }

  generaTetoolBarStateOptions(response : any) {
    linkRtoFormFields.forEach((field: any) => {
      if (field.name === 'stateid') {
        field.options = response.data.map((state: any) => {
          // Extract the keys dynamically
          const keys = Object.keys(state);
    
          // Find the keys for 'id', 'statename', and 'statecode' dynamically
          const idKey: any = keys.find(key => key.includes('id'));
          const nameKey: any = keys.find(key => key.includes('stateName'));
          const valueKey: any = keys.find(key => key.includes('stateCode'));
    
          // Set dropdownKeys for this field
          field.dropdownKeys = { idKey, nameKey, valueKey };
    
          return {
            id: state[idKey],
            stateName: state[nameKey],
            stateCode: state[valueKey]
          };
        });
      }
    });
    
    // Assign fields dynamically to this.fields
    this.fields = linkRtoFormFields;
    console.log(this.fields);
    
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

  async onInputTextChange({ field, value }: any): Promise<void> {
    if(field.hasOwnProperty('validation')) {
      const fieldName = field.name;
      this.validationDebounceSubject.next({ fieldName, value });
    }
  }


  private async executeValidation(fieldName: string, value: any): Promise<void> {
    const fieldValidationMapping: { [key: string]: (val: string) => Promise<any> } = {
      emailId: this.dynamicUserService.isEmailValid.bind(this.dynamicUserService),
      loginId: this.dynamicUserService.isLoginIdValid.bind(this.dynamicUserService),
      mobileNo: this.dynamicUserService.isMobileNoValid.bind(this.dynamicUserService)
    };
    
    const field : FormFields[] | any = dynamicUserCreateFormFields.find((field) => field.name === fieldName);

    if (fieldValidationMapping[fieldName]) {
      try {
        const response = await fieldValidationMapping[fieldName](value);
        this.validationState[fieldName] = !response.data.isDuplicate;
      } catch (error) {
        this.validationState[fieldName] = false;
        console.error(`Error validating ${fieldName}:`, error);
      }
    } else if (field && field.validation && field.dependent) {
      const isValid = field.validation(this.user);
      this.validationState[fieldName] = isValid;
  
      // Automatically validate dependent fields
      if (isValid && field.dependent.length) {
        field.dependent.forEach((depFieldName : any) => {
          const dependentField : any = dynamicUserCreateFormFields.find(f => f.name === depFieldName);
          if (dependentField && dependentField.validation) {
            this.validationState[depFieldName] = dependentField.validation(this.user);
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
  


  resetUser(): DynamicUser {
    return {
        sno: undefined,
        loginId: "",
        password: "",
        name: "",
        mobileNo: "",
        address:"",
        alternatemobileno:"",
        emailId: "",
        orgName: "",
        userType: "",
        active: false
    };
  }


  resetLinkRTOUser(): any {
    return {
      userId:this.selectedUsers?.sno,
      rtoId:[]
    }
  } 


  openNew(event : any) {
    this.currentAction = 'create';
    this.fields = dynamicUserCreateFormFields;
    this.isEditing = !event;
    this.hideFields = ['active'];
    this.user = this.resetUser();
    this.constructValidationState(this.fields);
    this.userDialog = event;
  }

  async onLinkRTO(event : any) : Promise<any> {
    this.currentAction = 'linkRTO';
    await this.generateStatesOptions()
    this.fields = linkRtoFormFields;
    this.isEditing = !event;
    this.isValidated = true
    this.hideFields = [];
    this.user = this.resetLinkRTOUser();
    // this.constructValidationState(this.fields);
    this.userDialog = event;
  }


  generateLinkedUnlinkedPickList(rtoList : any,linkedRto : any) { 
    this.linked = linkedRto?.data ? linkedRto?.data[0]?.rtoId : [];
    this.unlinked = rtoList.data.filter((item1 : any) => 
      !this.linked.some(item2 => item1['id'] === item2['id'])
    );
    console.log(this.unlinked);
    console.log(this.linked);
  }

  async onDialogDropDownChange(event: any) : Promise<any> {
    const {fieldName , selectedValue} = event;
    let rtoList;
    let linkedRto;
    this.linked= [];
    this.unlinked = [];
    if(fieldName === 'stateid') {
      try {
        rtoList = await this.rtoService.getList(selectedValue);
        console.log(rtoList,'rtos');
      } catch (error : any) {
        console.log(error);
        rtoList = [];
        this.toastService.showError('Error', error.error.data);
      }

      try {
        linkedRto = await this.rtoService.getLinkedRtoUserWise(this.selectedUsers);
        console.log(linkedRto,'linked rto');
      } catch (error  :any) {
        linkedRto = [];
        this.toastService.showError('Error', error.error.data);
        
      }
      this.generateLinkedUnlinkedPickList(rtoList,linkedRto);
    }
  }

  deleteSelectedProducts() { }


  onHideDialog(isVisible: boolean) {
    this.resetVaribles();
  }

  async onSaveProduct(data: any) : Promise<any> {
    try {
      if (this.user.sno && this.currentAction === 'edit') {
        await this.updateDynamicUser(data);
      } else if(this.currentAction === 'create') {
        await this.createDynamicUser(data);
      } else if(this.currentAction === 'linkRTO') {
        await this.linkRTO();
        await this.unlinkRTO();
      }
      await this.fetchDynamicUserList();
      this.resetVaribles();
    } catch (error) {
      console.log(error);
      this.toastService.showError('Error', `Failed to create ${this.authService.getUserType()}!`);
    }
  }


  resetVaribles() {
    this.userDialog = false;
    this.user = this.resetUser();
    this.isEditing = false;
    this.hideFields = [];
    this.linked = [];
    this.unlinked = [];
    this.currentAction = null;
  }


  onEditProduct(user: any) {
    this.currentAction = 'edit';
    this.fields = dynamicUserCreateFormFields;
    this.hideFields = ['password','confirm_password'];
    this.isEditing = true;
    this.user = { ...user };
    this.constructValidationState(this.fields);
    this.userDialog = true;
  }

  onDeleteProduct(user: any) {
    console.log('Deleting user:', user);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.user = this.resetUser();
        this.toastService.showSuccess('Success', 'This is a success message!');
      }
    });
  }

  onSelectionChange(event: any[]) {
    console.log(event);
    this.selectedUsers = event;
  }


  async fetchDynamicUserList() : Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.dynamicUserService.getList();
      this.users = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    } finally{
      this.isLoading = false;
    }
  }


  async createDynamicUser(data : DynamicUser) : Promise<any> {
    try {
      const response = await this.dynamicUserService.createUser(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'User Created Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to create ${this.authService.getUserType()}!`);
    }
  }


  async linkRTO() : Promise<any> {
    const linkedPayload = {
      userId:this.selectedUsers?.sno,
      rtoId:this.linked
    };
    try {
      const response = await this.dynamicUserService.linkRtoToUser(linkedPayload); 
      console.log(response);
      this.toastService.showSuccess('Success', response.data);     
    } catch (error) {
      this.toastService.showError('Error', `Failed to Link ${this.authService.getUserType()}!`);
    }
  }

  async unlinkRTO() : Promise<any> {
    const unlinkedPayload = {
      userId:this.selectedUsers?.sno,
      rtoId:this.unlinked
    };
    try {
      const response = await this.dynamicUserService.unlinkRtoToUser(unlinkedPayload); 
      console.log(response);
      // this.toastService.showSuccess('Success', response.data);     
    } catch (error) {
      this.toastService.showError('Error', `Failed to Link ${this.authService.getUserType()}!`);
    }
  }


  async updateDynamicUser(data : DynamicUser) : Promise<any> {
    try {
      const response = await this.dynamicUserService.updateUser(data);
      console.log(response);
      this.toastService.showSuccess('Success', response.data);
    } catch (error) {
      this.toastService.showError('Error', `Failed to create ${this.authService.getUserType()}!`);
    }
  }
}
