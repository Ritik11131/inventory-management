import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';
import { portsColumns } from '../../../../shared/constants/columns';
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

  columns = portsColumns;
    fields: any[] = []
    ports: any[] = [];
    port!: any;
    isLoading: boolean = false;
    portDialog: boolean = false;
    isEditing: boolean = false;
    toolbarRightActions:any[] = [
    {
      type:'dropdown',
      options:[],
      dropdownKeys:{},
      placeholder:'Select Oem',
    }
  ]
  toolbarDropDownSelected!:any
  
    constructor(private toastService: ToastService,private dynamicUserService: DynamicUserService,  private portService:PortService, private simProviderService:SimProvidersService) { }
  
  
    ngOnInit(): void {
      this.fillDropDownOptions().then();
    }

    async onToolBarDropDownChange(selected:any) : Promise<any> {   
    this.toolbarDropDownSelected = selected;   
    await this.fetchPorts(selected)
  }
  
    async fetchPorts(oemId: any): Promise<any> {
      this.isLoading = true;
      try {
        const response = await this.portService.getList(oemId);
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
      const [userResponse, simProviderResponse, domainTypeResponse] = await Promise.all([
        this.dynamicUserService.getList(),
        this.simProviderService.getList(),
        this.portService.getDomainTypeList()
      ]);

      const mapToOptions = (data: any[], type?:string) =>
        data.map(item => {
          const keys = Object.keys(item);
          return {
            label: item[keys[1]], // assumes label is at second key
            value: type && type === 'domainType' ? item[keys[1]] : item[keys[0]], // assumes value is at first key
          };
        });

      this.fields = assignPortFormFields;
      this.toolbarRightActions[0].options = mapToOptions(userResponse?.data)
      this.fields[0].options = mapToOptions(userResponse.data);
      this.fields[1].options = mapToOptions(simProviderResponse.data);
      this.fields[2].options = mapToOptions(domainTypeResponse.data, 'domainType');      

    } catch (error) {
      console.error('Dropdown options load failed:', error);
      this.toastService.showError('Error', 'Failed to fetch dropdown data!');
    }
  }

  
  
    onDialogDropDownChange(event: any) {
    }
  
  
    onHideDialog(isVisible: boolean) {
      this.portDialog = isVisible;
      this.isEditing = false;
    }
  
    resetPort() {
      return {
        fkUserId: null,
        FkServiceProvider: null,
        domainType: null,
        domain: '',
        port: null,
      };
  }
  
  
    onInputTextChange(event: any) {
    }
  
  
  
    /**
     * Saves a RTO.
     * @param data The RTO to be saved.
     * @returns A promise that resolves when the RTO is saved.
     */
    async onSavePort(data: any) : Promise<any> {      
      if (this.port.id) {
        await this.updatePort(data);
      } else {
        await this.createPort(data);
      }
      await this.fetchPorts(this.toolbarDropDownSelected);
      this.portDialog = false;
      this.port = this.resetPort();
      this.isEditing = false;
    }
  
    async createPort(data : any) : Promise<any> {
      try {
        const response = await this.portService.createPort(data);
        this.toastService.showSuccess('Success', response?.data || 'Port Created Successfully!');
      } catch (error: any) {
        this.toastService.showError('Error', error.error?.data || 'Failed to create Port!');
      }
    }
  
  
    async updatePort(data : any) : Promise<any> {
      try {
        const response = await this.portService.updatePort(data);
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
      this.port = { ...port };
      this.portDialog = true;
    }
    onSelectionChange(event: any) {
    }

}
