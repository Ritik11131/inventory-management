import { StatesService } from './../../../../core/services/states.service';
import { Component, OnInit } from '@angular/core';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { rtoColumns } from '../../../../shared/constants/columns';
import { RtoService } from '../../../../core/services/rto.service';
import { ToastService } from '../../../../core/services/toast.service';
import { rtoCreateFormFields } from '../../../../shared/constants/forms';

@Component({
  selector: 'app-rto',
  standalone: true,
  imports: [GenericDialogComponent, GenericTableComponent],
  templateUrl: './rto.component.html',
  styleUrl: './rto.component.scss'
})
export class RtoComponent implements OnInit {

  columns = rtoColumns;
  fields: any[] = []
  rtos: any[] = [];
  rto!: any;
  isLoading: boolean = false;
  rtoDialog: boolean = false;
  isEditing: boolean = false;
  toolbarRightActions:any[] = [
    {
      type:'dropdown',
      options:[],
      dropdownKeys:{},
      placeholder:'Select State',
    }
  ]
  toolbarDropDownSelected!:any



  constructor(private rtoService: RtoService, private toastService: ToastService,private stateService:StatesService) { }


  ngOnInit(): void {
    this.generateStatesOptions().then();
  }


  async generateStatesOptions() : Promise<any> {
    try {
      const response = await this.stateService.getList();
      this.generaTetoolBarStateOptions(response)
      console.log(this.toolbarRightActions);
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    }
  }

  generaTetoolBarStateOptions(response : any) {
    this.toolbarRightActions[0].options = response.data.map((state: any) => {
      // Extract the keys dynamically
      const keys = Object.keys(state);
      
      // Find the keys for 'id', 'statename', and 'statecode' dynamically
      const idKey:any = keys.find(key => key.includes('id'));
      const nameKey:any = keys.find(key => key.includes('stateName'));
      const valueKey:any = keys.find(key => key.includes('stateCode'));
      this.toolbarRightActions[0].dropdownKeys = { idKey, nameKey, valueKey };
      rtoCreateFormFields[0].dropdownKeys = { idKey, nameKey, valueKey };
      return {
        id: state[idKey],
        stateName: state[nameKey],
        stateCode: state[valueKey]
      };
    });
    rtoCreateFormFields[0].options = this.toolbarRightActions[0].options;
    this.fields = rtoCreateFormFields
    console.log(this.fields);
    
  }


  async onToolBarDropDownChange(selected:any) : Promise<any> {    
    this.toolbarDropDownSelected = selected;    
    await this.fetchRTOs(selected)
  }

  async fetchRTOs(selectedState: any): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.rtoService.getList(selectedState);
      this.rtos = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error : any) {
      this.rtos = [];
      this.toastService.showError(!selectedState ? 'Select a State' : 'Error', error?.error?.data);
    } finally {
      this.isLoading = false;
    }
  }


  onDialogDropDownChange(event: any) {
    console.log(event);
    console.log(this.rto);
  }


  onHideDialog(isVisible: boolean) {
    this.rtoDialog = isVisible;
    this.isEditing = false;
  }

  resetRTO() {
    return {
      state: null,
      rtoName: "",
      rtoCode: "",
    };
}


  onInputTextChange(event: any) {}



  /**
   * Saves a RTO.
   * @param data The RTO to be saved.
   * @returns A promise that resolves when the RTO is saved.
   */
  async onSaveRTO(data: any) : Promise<any> {    
    if (this.rto.id) {
      await this.updateRTO(data);
    } else {
      await this.createRTO(data);
    }
    await this.fetchRTOs(this.toolbarDropDownSelected);
    this.rtoDialog = false;
    this.rto = this.resetRTO();
    this.isEditing = false;
  }

  async createRTO(data : any) : Promise<any> {
    try {
      const response = await this.rtoService.createRTO(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'RTO Created Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to create RTO!`);
    }
  }


  async updateRTO(data : any) : Promise<any> {
    try {
      const response = await this.rtoService.updateRTO(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'RTO Updated Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to update RTO!`);
    }
  }


  openNew(event: any) {
    this.isEditing = !event;
    this.rto = this.resetRTO();
    this.rtoDialog = event;
  }
  onDeleteProduct($event: any) {
    throw new Error('Method not implemented.');
  }
  onEditState(rto: any) {
    this.isEditing = true;
    console.log('Editing user:', rto);
    this.rto = { ...rto };
    this.rtoDialog = true;
  }
  onSelectionChange(event: any) {
    console.log(event);
  }

}
