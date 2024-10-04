import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { stateColumns } from '../../../../shared/constants/columns';
import { StatesService } from '../../../../core/services/states.service';
import { ToastService } from '../../../../core/services/toast.service';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { stateCreateFormFields } from '../../../../shared/constants/forms';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [GenericTableComponent, GenericDialogComponent],
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss'
})
export class StateComponent implements OnInit {

  columns = stateColumns;
  fields: any[] = stateCreateFormFields
  states: any[] = [];
  state!: any
  isLoading: boolean = false;
  stateDialog: boolean = false;
  isEditing: boolean = false;




  constructor(private stateService: StatesService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.fetchStates().then();
  }

  async fetchStates(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.stateService.getList();
      this.states = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }

  resetState() {
    return {
      statename: "",
      statecode: ""
    };
  }

  async onSaveProduct(data: any) : Promise<any> {
    if (this.state.id) {
      await this.updateState(data);
    } else {
      await this.createSate(data);
    }
    await this.fetchStates();
    this.stateDialog = false;
    this.state = this.resetState();
    this.isEditing = false;
  }



  onHideDialog(isVisible: boolean) {
    this.stateDialog = isVisible;
    this.isEditing = false;
  }


  async createSate(data : any) : Promise<any> {
    try {
      const response = await this.stateService.createState(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'User Created Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to create State!`);
    }
  }


  async updateState(data : any) : Promise<any> {
    try {
      const response = await this.stateService.updateState(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'State Updated Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to update State!`);
    }
  }


  onInputTextChange(event: any) {
    throw new Error('Method not implemented.');
  }

  openNew(event: any) {
    this.isEditing = !event;
    this.state = this.resetState();
    this.stateDialog = event;
  }
  onSelectionChange($event: any) {
    throw new Error('Method not implemented.');
  }
  onEditState(state: any) {
    this.isEditing = true;
    console.log('Editing user:', state);
    this.state = { ...state };
    this.stateDialog = true;
  }
  onDeleteProduct($event: any) {
    throw new Error('Method not implemented.');
  }

}
