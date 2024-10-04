import { StatesService } from './../../../../core/services/states.service';
import { Component, OnInit } from '@angular/core';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { rtoColumns } from '../../../../shared/constants/columns';
import { RtoService } from '../../../../core/services/rto.service';
import { ToastService } from '../../../../core/services/toast.service';

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



  constructor(private rtoService: RtoService, private toastService: ToastService,private stateService:StatesService) { }


  ngOnInit(): void {
    this.fetchStates().then();
  }


  async fetchStates() : Promise<any> {
    try {
      const response = await this.stateService.getList();
      this.toolbarRightActions[0].options = response.data.map((state: any) => {
        // Extract the keys dynamically
        const keys = Object.keys(state);
        
        // Find the keys for 'id', 'statename', and 'statecode' dynamically
        const idKey:any = keys.find(key => key.toLowerCase().includes('id'));
        const nameKey:any = keys.find(key => key.toLowerCase().includes('statename'));
        const valueKey:any = keys.find(key => key.toLowerCase().includes('statecode'));
        this.toolbarRightActions[0].dropdownKeys = { idKey, nameKey, valueKey };
        return {
          id: state[idKey],
          statename: state[nameKey],
          statecode: state[valueKey]
        };
      });

      console.log(this.toolbarRightActions);
      
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    }
  }


  async onToolBarDropDownChange(selected:any) : Promise<any> {
    console.log(selected);
    
    await this.fetchRTOs(selected)
  }

  async fetchRTOs(selectedState: any): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.rtoService.getList(selectedState);
      this.rtos = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error : any) {
      this.rtos = []
      this.toastService.showError('Error', error.error.data);
    } finally {
      this.isLoading = false;
    }
  }


  onHideDialog($event: any) {
    throw new Error('Method not implemented.');
  }
  onInputTextChange($event: any) {
    throw new Error('Method not implemented.');
  }
  onSaveRTO($event: any) {
    throw new Error('Method not implemented.');
  }
  openNew($event: any) {
    throw new Error('Method not implemented.');
  }
  onDeleteProduct($event: any) {
    throw new Error('Method not implemented.');
  }
  onEditState($event: any) {
    throw new Error('Method not implemented.');
  }
  onSelectionChange($event: any) {
    throw new Error('Method not implemented.');
  }

}
