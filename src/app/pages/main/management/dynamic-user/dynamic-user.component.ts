import { DynamicUser } from './../../../../shared/interfaces/dynamic-user.model';
import { DynamicUserService } from './../../../../core/services/dynamic-user.service';
import { Component, OnInit } from '@angular/core';
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
import { ToastService } from '../../../../core/services/toast.service';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../../core/services/auth.service';
import { dynamicUserColumns } from '../../../../shared/constants/columns';
import { dynamicUserCreateFormFields } from '../../../../shared/constants/forms';

@Component({
  selector: 'app-dynamic-user',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule,
    InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule,
    RatingModule, InputTextModule, FormsModule, InputNumberModule, GenericDialogComponent, GenericTableComponent, ConfirmDialogModule],
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


  constructor(private toastService: ToastService, private confirmationService: ConfirmationService, 
              private authService: AuthService,private dynamicUserService:DynamicUserService) { }

  ngOnInit() {
    this.userType = this.authService.getUserType();
    this.fetchDynamicUserList().then();
  }


  resetUser(): DynamicUser {
    return {
        sno: undefined,
        loginId: "",
        password: "",
        name: "",
        mobileNo: "",
        emailId: "",
        orgName: "",
        userType: "",
        active: false
    };
}


  openNew() {
    this.isEditing = false;
    this.hideFields = ['active'];
    this.user = this.resetUser();
    this.userDialog = true;
  }

  deleteSelectedProducts() { }

  hideDialog() {
    this.userDialog = false;
  }


  onHideDialog(isVisible: boolean) {
    console.log(isVisible);
    this.userDialog = isVisible;
    this.isEditing = false;
    this.hideFields = [];
  }

  async onSaveProduct(data: any) : Promise<any> {
      if (this.user.sno) {
        this.toastService.showSuccess('Success', 'This is a success message!');
      } else {
        try {
          const response = await this.dynamicUserService.createUser(data);
          console.log(response);
          this.toastService.showSuccess('Success', 'This is a success message!');
        } catch (error) {
          this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
        }
      }

      await this.fetchDynamicUserList();
      this.userDialog = false;
      this.user = this.resetUser();
      this.isEditing = false;
      this.hideFields = [];
  }


  onEditProduct(user: any) {
    this.hideFields = ['password','confirm_password'];
    this.isEditing = true;
    console.log('Editing user:', user);
    this.user = { ...user };
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
    try {
      const response = await this.dynamicUserService.getList();
      this.users = response.data;
      this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    }
  }
}
