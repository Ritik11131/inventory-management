import { Component } from '@angular/core';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { ToastService } from '../../../../core/services/toast.service';
import { VehicleCategoryService } from '../../../../core/services/vehicle-category.service';
import { vehicleCategoryColumns } from '../../../../shared/constants/columns';
import { vehicleCategoryFormFields } from '../../../../shared/constants/forms';

@Component({
  selector: 'app-vehicle-category',
  standalone: true,
  imports: [GenericDialogComponent,GenericTableComponent],
  templateUrl: './vehicle-category.component.html',
  styleUrl: './vehicle-category.component.scss'
})
export class VehicleCategoryComponent {



  columns = vehicleCategoryColumns;
  isLoading: boolean = false;
  categoryDialog: boolean = false;
  isEditing: boolean = false;
  categories:any[] = [];
  category!: any;
  fields:any[] = vehicleCategoryFormFields;

  constructor(private vehicleCategory:VehicleCategoryService,private toastService:ToastService) {}


  ngOnInit(): void {
    this.fetchVehicleCategories().then();
  }


  async fetchVehicleCategories(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.vehicleCategory.getList();
      this.categories = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.categories = [];
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }


  resetVehicleCategory() {
    return {
      id:undefined,
      name: "",
      totalCount:0
    };
  }


  async onSaveCategory(data: any) : Promise<any> {
    try {
      if (this.category.id) {
        await this.updateVehicleCategory(data);
      } else {
        await this.createVehicleCategory(data);
      }
      await this.fetchVehicleCategories();
      this.categoryDialog = false;
      this.category = this.resetVehicleCategory();
      this.isEditing = false;
    } catch (error) {
      console.log(error);
    }
  }



  async createVehicleCategory(data : any) : Promise<any> {
    try {
      const response = await this.vehicleCategory.create(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Created Successfully!');
    } catch (error : any) {
      this.toastService.showError('Error', error.error.data);
      throw error;
    }
  }


  async updateVehicleCategory(data : any) : Promise<any> {
    try {
      const response = await this.vehicleCategory.update(data);
      console.log(response);
      this.toastService.showSuccess('Success', 'Provider Updated Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to update State!`);
      throw error;
    }
  }


  openNew(event: any) {
    this.isEditing = !event;
    this.category = this.resetVehicleCategory();
    this.categoryDialog = event;
  }


  onEditCategory(state: any) {
    this.isEditing = true;
    console.log('Editing user:', state);
    this.category = { ...state };
    this.categoryDialog = true;
  }


  onHideDialog(isVisible: boolean) {
    this.categoryDialog = isVisible;
    this.isEditing = false;
  }



    onInputTextChange(event: any) {
      console.log(event);
    }
   
    
    onSelectionChange(event: any) {
      console.log(event);
    }



}
