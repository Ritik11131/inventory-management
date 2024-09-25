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

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, InputTextModule, 
    InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, 
    RatingModule, InputTextModule, FormsModule, InputNumberModule, GenericDialogComponent, GenericTableComponent,ConfirmDialogModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  providers:[ConfirmationService]
})
export class DeviceListComponent {


  fields: any[] = [
    {
      name: 'dealer',
      label: 'Dealer Name',
      type: 'text',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'mobile_no',
      label: 'Mobile No',
      type: 'text',
    },
    {
      name: 'alternate_no',
      label: 'Alternate No',
      type: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'radiobutton',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'login_name',
      label: 'Login Name',
      type: 'text',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'text',
    },
    {
      name: 'confirm_password',
      label: 'Confirm Password',
      type: 'text',
    },
  ];

  dealers: any[] = [
    {
      id: 1,
      dealer: 'Dealer 1',
      name: 'John Doe',
      mobile_no: '9876543210',
      alternate_no: '9123456789',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'New York',
      status: 'Active',
      login_name: 'johndoe',
      password: 'password123',
      confirm_password: 'password123',
    },
    {
      id: 2,
      dealer: 'Dealer 2',
      name: 'Jane Smith',
      mobile_no: '8765432109',
      alternate_no: '9012345678',
      email: 'jane@example.com',
      address: '456 Market St',
      city: 'Los Angeles',
      status: 'Inactive',
      login_name: 'janesmith',
      password: 'password456',
      confirm_password: 'password456',
    },
  ];

  columns = [
    { field: 'dealer', header: 'Dealer',minWidth: '15rem' },
    { field: 'name', header: 'Name', minWidth: '15rem' },
    { field: 'mobile_no', header: 'Mobile No', minWidth: '10rem' },
    { field: 'alternate_no', header: 'Alternate No', minWidth: '10rem' },
    { field: 'email', header: 'Email',minWidth: '15rem' },
    { field: 'address', header: 'Address',minWidth: '15rem' },
    { field: 'city', header: 'City' },
    { field: 'status', header: 'Status' }
  ];

  dealerDialog: boolean = false;

  dealer!: any;

  selectedDealers!: any[] | null;

  submitted: boolean = false;


    constructor(private toastService: ToastService, private confirmationService: ConfirmationService) {}

    ngOnInit() {}

    openNew() {
        this.dealer = {};
        this.submitted = false;
        this.dealerDialog = true;
    }

    deleteSelectedProducts() {}

    hideDialog() {
        this.dealerDialog = false;
        this.submitted = false;
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.dealers.length; i++) {
            if (this.dealers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


    onHideDialog(isVisible:boolean) {
      console.log(isVisible);
      
      this.dealerDialog = isVisible;
    }
  
    onSaveProduct(data: any) {
      console.log(data);
      this.submitted = true;

        if (this.dealer.name?.trim()) {
            if (this.dealer.id) {
                this.dealers[this.findIndexById(this.dealer.id)] = this.dealer;
                this.toastService.showSuccess('Success', 'This is a success message!');
            } else {
                this.dealer.id = this.createId();
                this.dealer.image = 'product-placeholder.svg';
                this.dealers.push(this.dealer);
                this.toastService.showSuccess('Success', 'This is a success message!');
            }

            this.dealers = [...this.dealers];
            this.dealerDialog = false;
            this.dealer = {};
        }
    }


    editProduct(product: any) {
      this.dealer = { ...product };
      this.dealerDialog = true;
  }


    onEditProduct(product: any) {
      console.log('Editing product:', product);
      this.dealer = { ...product };
      this.dealerDialog = true;
    }
  
    onDeleteProduct(product: any) {
      console.log('Deleting product:', product);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.dealers = this.dealers.filter((val) => val.id !== product.id);
            this.dealer = {};
            this.toastService.showSuccess('Success', 'This is a success message!');

        }
    });
  }

  onSelectionChange(event: any[]) {
    console.log(event);
    this.selectedDealers = event;
    
  }


}
