import { Component, OnInit } from '@angular/core';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { simProviders } from '../../../../shared/constants/columns';
import { SimProvidersService } from '../../../../core/services/sim-providers.service';
import { ToastService } from '../../../../core/services/toast.service';
import { simProviderFormFields } from '../../../../shared/constants/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sim-provider',
  standalone: true,
  imports: [GenericDialogComponent,GenericTableComponent],
  templateUrl: './sim-provider.component.html',
  styleUrl: './sim-provider.component.scss'
})
export class SimProviderComponent implements OnInit {

  columns = simProviders;
  isLoading: boolean = false;
  providerDialog: boolean = false;
  isEditing: boolean = false;
  providers:any[] = [];
  provider!: any;
  fields:any[] = simProviderFormFields

  constructor(private simProviderService:SimProvidersService,private toastService:ToastService,private confirmationService: ConfirmationService) {}


  ngOnInit(): void {
    this.fetchSimProviders().then();
  }


  async fetchSimProviders(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.simProviderService.getList();
      this.providers = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.providers = [];
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }


  resetSimProvider() {
    return {
      id:undefined,
      provideName: "",
    };
  }


  async onSaveProvider(data: any) : Promise<any> {
    try {
      if (this.provider.id) {
        await this.updateSimProvider(data);
      } else {
        await this.createSimProvider(data);
      }
      await this.fetchSimProviders();
      this.providerDialog = false;
      this.provider = this.resetSimProvider();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }



  async createSimProvider(data : any) : Promise<any> {
    try {
      const response = await this.simProviderService.createSimProvider(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Created Successfully!');
    } catch (error : any) {
      this.toastService.showError('Error', error.error.data);
      throw error;
    }
  }


  async updateSimProvider(data : any) : Promise<any> {
    try {
      const response = await this.simProviderService.updateSimProvider(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Updated Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to update State!`);
      throw error;
    }
  }


  openNew(event: any) {
    this.isEditing = !event;
    this.provider = this.resetSimProvider();
    this.providerDialog = event;
  }


  onEditProvider(state: any) {
    this.isEditing = true;
    console.log('Editing user:', state);
    this.provider = { ...state };
    this.providerDialog = true;
  }


  onHideDialog(isVisible: boolean) {
    this.providerDialog = isVisible;
    this.isEditing = false;
  }


  async onDeleteProvider(event: any) : Promise<any> {
    console.log(event);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this provider?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      accept: async () => {
        try {
          const response = await this.simProviderService.deleteSimProvider(event.item);
          console.log(response);
          this.toastService.showSuccess('Success', 'Provider Deleted Successfully!');
          await this.fetchSimProviders()
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
      console.log(event);
    }
   
    
    onSelectionChange(event: any) {
      console.log(event);
    }

}
