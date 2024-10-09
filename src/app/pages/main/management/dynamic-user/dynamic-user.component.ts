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
import { dynamicUserCreateFormFields } from '../../../../shared/constants/forms';
import { debounceTime, Subject } from 'rxjs';
import { FormFields } from '../../../../shared/interfaces/forms';


@Component({
  selector: 'app-dynamic-user',
  standalone: true,
  imports: [GenericDialogComponent, GenericTableComponent, ConfirmDialogModule],
  templateUrl: './dynamic-user.component.html',
  styleUrl: './dynamic-user.component.scss',
  providers: [ConfirmationService]

})
export class DynamicUserComponent {

  fields: any[] = dynamicUserCreateFormFields;
  users: DynamicUser[] = [];
  columns = dynamicUserColumns
  userDialog: boolean = false;
  user!: DynamicUser;
  selectedUsers!: any[] | null;
  isEditing:boolean = false;
  userType!: string;
  hideFields: string[] = [];
  validationState: { [key: string]: boolean } = {};
  isValidated:boolean = false;
  isLoading:boolean = false;
  private validationDebounceSubject: Subject<{ fieldName: string; value: any }> = new Subject();




  constructor(private toastService: ToastService, private confirmationService: ConfirmationService,
    private authService: AuthService, private dynamicUserService: DynamicUserService) {
    this.validationDebounceSubject.pipe(
      debounceTime(400)
    ).subscribe(({ fieldName, value }) => {
      this.executeValidation(fieldName, value);
    });
  }

  ngOnInit() {
    this.userType = this.authService.getUserType();
    // this.constructValidationState(this.fields); 
    this.fetchDynamicUserList().then();
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

  async onInputTextChange({ fieldName, value }: any): Promise<void> {
    this.validationDebounceSubject.next({ fieldName, value });
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


  openNew(event : any) {
    this.isEditing = !event;
    this.hideFields = ['active'];
    this.user = this.resetUser();
    this.constructValidationState(this.fields);
    this.userDialog = event;
  }

  deleteSelectedProducts() { }


  onHideDialog(isVisible: boolean) {
    this.userDialog = isVisible;
    this.isEditing = false;
    this.hideFields = [];
  }

  async onSaveProduct(data: DynamicUser) : Promise<any> {
    try {
      if (this.user.sno) {
        await this.updateDynamicUser(data);
      } else {
        await this.createDynamicUser(data);
      }
      await this.fetchDynamicUserList();
      this.userDialog = false;
      this.user = this.resetUser();
      this.isEditing = false;
      this.hideFields = [];
    } catch (error) {
      console.log(error);
      this.toastService.showError('Error', `Failed to create ${this.authService.getUserType()}!`);
    }
  }


  onEditProduct(user: any) {
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
