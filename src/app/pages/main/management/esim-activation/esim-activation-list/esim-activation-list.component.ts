import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ESimColumns } from '../../../../../shared/constants/columns';
import { EsimService } from '../../../../../core/services/esim.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SimProvidersService } from '../../../../../core/services/sim-providers.service';

@Component({
  selector: 'app-esim-activation-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ToolbarModule, ButtonModule,TableModule,ProgressSpinnerModule, TooltipModule,DialogModule,DropdownModule],
  templateUrl: './esim-activation-list.component.html',
  styleUrl: './esim-activation-list.component.scss'
})
export class EsimActivationListComponent {

  columns:any[] = ESimColumns;
  currentSelectedRow!:any;
  eSimtableData:any[] = [];
  isLoading: boolean = false;
  isDialogVisible:boolean= false;
  fetchingActivateTypeOptions:boolean = false;
  dialogContentType: string = 'activateFields';
  selectedSimProvider!:any;
  selectedType!:any;
  selectedPlan!:any
  simProvidersOptions:any[] = [];
  activateTypeOptions:any[] = [];
  availablePlanOptions:any[] = [];


  constructor(private esimService:EsimService, private toastService:ToastService, private simProviderService:SimProvidersService) {

  }

  ngOnInit(): void {
    this.fetchActivationList();
  }

  async fetchActivationList(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.esimService.getActivationList();
      this.eSimtableData = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchSimProviders(): Promise<any> {
    try {
      const response = await this.simProviderService.getList();
      this.simProvidersOptions = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.simProvidersOptions = [];
      this.toastService.showError('Error', `Failed to fetch State List!`);
    }
  }


  async fetchActivationTypes(id:number): Promise<any> {
    this.fetchingActivateTypeOptions = true;
    try {
      const response = await this.esimService.getActivationTypes(id);
      this.activateTypeOptions = response.data;
      this.fetchingActivateTypeOptions = false;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
    this.fetchingActivateTypeOptions = false;
      this.activateTypeOptions = [];
      this.toastService.showError('Error', `Failed to fetch Types!`);
    }
  }


  onCurrentRowSelectionChange(e:any) {
    console.log(e);
  }

  handleActivateClick = async () => {
    this.isDialogVisible=true; 
    this.dialogContentType = 'activateFields';
    await this.fetchSimProviders();
  }

  async handleSimProviderChange(e:any): Promise<any> {
    console.log(this.selectedSimProvider);
    await this.fetchActivationTypes(this.selectedSimProvider?.id)
  }

  hideDialog() {

  }

  save() {

  }

}
