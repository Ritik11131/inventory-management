import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';
import { rtoColumns } from '../../../../shared/constants/columns';
import { PortService } from '../../../../core/services/port.service';
import { assignPortFormFields } from '../../../../shared/constants/forms';
import { SimProvidersService } from '../../../../core/services/sim-providers.service';
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';

@Component({
  selector: 'app-assign-port',
  standalone: true,
  imports: [GenericTableComponent,GenericDialogComponent],
  templateUrl: './assign-port.component.html',
  styleUrl: './assign-port.component.scss'
})
export class AssignPortComponent {

  columns = rtoColumns;
    fields: any[] = []
    ports: any[] = [];
    port!: any;
    isLoading: boolean = false;
    portDialog: boolean = false;
    isEditing: boolean = false;
  
    constructor(private toastService: ToastService,private dynamicUserService: DynamicUserService,  private portService:PortService, private simProviderService:SimProvidersService) { }
  
  
    ngOnInit(): void {
      this.fillDropDownOptions().then();
      this.fetchPorts().then();
    }
  
    async fetchPorts(): Promise<any> {
      this.isLoading = true;
      try {
        const response = await this.portService.getList();
        this.ports = response.data;
        // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
      } catch (error : any) {
        this.ports = [];
        this.toastService.showError('Error', error?.error?.data);
      } finally {
        this.isLoading = false;
      }
    }

  async fillDropDownOptions(): Promise<void> {
    try {
      const [userResponse, simProviderResponse] = await Promise.all([
        this.dynamicUserService.getList(),
        this.simProviderService.getList()
      ]);

      const mapToOptions = (data: any[]) =>
        data.map(item => {
          const keys = Object.keys(item);
          return {
            label: item[keys[1]], // assumes label is at second key
            value: item[keys[0]], // assumes value is at first key
          };
        });

      this.fields = assignPortFormFields;
      this.fields[0].options = mapToOptions(userResponse.data);
      this.fields[1].options = mapToOptions(simProviderResponse.data);

    } catch (error) {
      console.error('Dropdown options load failed:', error);
      this.toastService.showError('Error', 'Failed to fetch dropdown data!');
    }
  }

  
  
    onDialogDropDownChange(event: any) {
      console.log(event);
      console.log(this.port);
    }
  
  
    onHideDialog(isVisible: boolean) {
      this.portDialog = isVisible;
      this.isEditing = false;
    }
  
    resetPort() {
      return {
        oem: null,
        serviceProvider: null,
        port: "",
      };
  }
  
  
    onInputTextChange(event: any) {
      console.log(event,'event');
      
    }
  
  
  
    /**
     * Saves a RTO.
     * @param data The RTO to be saved.
     * @returns A promise that resolves when the RTO is saved.
     */
    async onSavePort(data: any) : Promise<any> {    
      if (this.port.id) {
        await this.updateRTO(data);
      } else {
        await this.createRTO(data);
      }
      await this.fetchPorts();
      this.portDialog = false;
      this.port = this.resetPort();
      this.isEditing = false;
    }
  
    async createRTO(data : any) : Promise<any> {
      try {
        const response = await this.portService.createRTO(data);
        console.log(response);
        this.toastService.showSuccess('Success', 'RTO Created Successfully!');
      } catch (error) {
        this.toastService.showError('Error', `Failed to create RTO!`);
      }
    }
  
  
    async updateRTO(data : any) : Promise<any> {
      try {
        const response = await this.portService.updateRTO(data);
        console.log(response);
        this.toastService.showSuccess('Success', 'RTO Updated Successfully!');
      } catch (error) {
        this.toastService.showError('Error', `Failed to update RTO!`);
      }
    }
  
  
    openNew(event: any) {
      this.isEditing = !event;
      this.port = this.resetPort();
      this.portDialog = event;
    }
    onDeleteProduct($event: any) {
      throw new Error('Method not implemented.');
    }
    onEditState(port: any) {
      this.isEditing = true;
      console.log('Editing user:', port);
      this.port = { ...port };
      this.portDialog = true;
    }
    onSelectionChange(event: any) {
      console.log(event);
    }

}
