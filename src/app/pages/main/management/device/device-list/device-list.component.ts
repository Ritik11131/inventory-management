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

  devices: any[] = [
    {
      serial_no: 'S12345',
      imei: 'IMEI9876543210',
      iccid_no: 'ICCID1234567890',
      vehicle_no: 'VN-01-ABC',
      chassis_no: 'CH123456',
      model: 'Sedan',
      class: 'Luxury',
      rto: 'New York',
      permit_holder: 'Yes',
      dealer: 'Dealer 1',
      vehicle_status: 'Active',
      device_status: 'Online',
      polling_status: 'Successful',
      payment_status: 'Paid'
    },
    {
      serial_no: 'S67890',
      imei: 'IMEI1234567890',
      iccid_no: 'ICCID0987654321',
      vehicle_no: 'VN-02-XYZ',
      chassis_no: 'CH987654',
      model: 'SUV',
      class: 'Economy',
      rto: 'Los Angeles',
      permit_holder: 'No',
      dealer: 'Dealer 2',
      vehicle_status: 'Inactive',
      device_status: 'Offline',
      polling_status: 'Failed',
      payment_status: 'Pending'
    }
  ];

  columns = [
    { field: 'serial_no', header: 'Serial No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid_no', header: 'ICCID No' },
    { field: 'vehicle_no', header: 'Vehicle No' },
    { field: 'chassis_no', header: 'Chassis No' },
    { field: 'model', header: 'Model' },
    { field: 'class', header: 'Class' },
    { field: 'rto', header: 'RTO' },
    { field: 'permit_holder', header: 'Permit Holder' },
    { field: 'dealer', header: 'Dealer' },
    { field: 'vehicle_status', header: 'Vehicle Status' },
    { field: 'device_status', header: 'Device Status' },
    { field: 'polling_status', header: 'Polling Status' },
    { field: 'payment_status', header: 'Payment Status' }
  ];
  

  dealerDialog: boolean = false;

  device!: any;

  selectedDevices!: any[] | null;

  submitted: boolean = false;


    constructor(private toastService: ToastService, private confirmationService: ConfirmationService) {}

    ngOnInit() {}

    openNew() {
        this.device = {};
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
        for (let i = 0; i < this.devices.length; i++) {
            if (this.devices[i].id === id) {
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

        if (this.device.name?.trim()) {
            if (this.device.id) {
                this.devices[this.findIndexById(this.device.id)] = this.device;
                this.toastService.showSuccess('Success', 'This is a success message!');
            } else {
                this.device.id = this.createId();
                this.device.image = 'product-placeholder.svg';
                this.devices.push(this.device);
                this.toastService.showSuccess('Success', 'This is a success message!');
            }

            this.devices = [...this.devices];
            this.dealerDialog = false;
            this.device = {};
        }
    }


    editProduct(product: any) {
      this.device = { ...product };
      this.dealerDialog = true;
  }


    onEditProduct(product: any) {
      console.log('Editing product:', product);
      this.device = { ...product };
      this.dealerDialog = true;
    }
  
    onDeleteProduct(product: any) {
      console.log('Deleting product:', product);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + product.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.devices = this.devices.filter((val) => val.id !== product.id);
            this.device = {};
            this.toastService.showSuccess('Success', 'This is a success message!');

        }
    });
  }

  onSelectionChange(event: any[]) {
    console.log(event);
    this.selectedDevices = event;
    
  }


}
