import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ToastService } from '../../../../core/services/toast.service';
import { InventoryColumns } from '../../../../shared/constants/columns';
import { AuthService } from '../../../../core/services/auth.service';
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  inventory:any[] = [];
  columns:any[] = InventoryColumns;
  isLoading: boolean = false;
  selectedInventory:any[] = [];
  selectedUser!:any;
  inventoryTransfer!:any;
  toolbarRightActions:any[] = [
    {
      type:'dropdown',
      options:[],
      dropdownKeys:{},
      placeholder:`Select ${this.authService.getUserType()}`,
    }
  ]

  constructor(private inventoryService:InventoryService,private toastService:ToastService,private authService:AuthService,private dynamicUserService:DynamicUserService) {}


  ngOnInit(): void {
    this.fetchInventory().then();
    this.generateDropdownValues().then()
  }

  resetTransferInventory() {
   return {
    DeviceId: [],
    userId : null
   } 
  }

  async fetchInventory(): Promise<any> {
    this.isLoading = true;
    this.inventory = [];
    try {
      const { data } = await this.inventoryService.getList(500, 1);
      this.inventory = data?.items || []; // Use optional chaining for safety
      console.log(data);
  
      const { pageSize, totalPage } = data;
  
      // Create an array of promises for fetching all pages
      const pageRequests = Array.from({ length: totalPage - 1 }, (_, i) =>
        this.inventoryService.getList(pageSize, i + 2) // Start from page 2
      );
  
      // Wait for all requests to complete
      const responses = await Promise.all(pageRequests);
  
      // Concatenate all items from the responses
      responses.forEach(response => {
        this.inventory = this.inventory.concat(response.data?.items || []);
      });
  
      // Optional: Show success message
      // this.toastService.showSuccess('Success', `${this.authService.getUser Type()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch State List!`);
    } finally {
      this.isLoading = false;
    }
  }


  async generateDropdownValues() : Promise<any> {
    try {
      const response = await this.dynamicUserService.getList();
      this.toolbarRightActions[0].options = response.data.map((user: any) => {
        const keys = Object.keys(user);        
        const idKey:any = keys.find(key => key.includes('sno'));
        const nameKey:any = keys.find(key => key.includes('name'));
        const valueKey:any = keys.find(key => key.includes('sno'));
        this.toolbarRightActions[0].dropdownKeys = { idKey, nameKey, valueKey };
        return {
          sno: user[idKey],
          name: user[nameKey],
          id: user[valueKey]
        };
      });
      
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error) {
      this.toastService.showError('Error', `Failed to fetch ${this.authService.getUserType()} List!`);
    }
  }


  
  onSelectionChange(event: any) {
    this.selectedInventory = event;    
  }

  async onTransferInventory(event: any) : Promise<any> {
   this.inventoryTransfer = { 
      userId : this.selectedUser.id,
      DeviceId : this.selectedInventory.map((inv:any) => inv.id)
    }
    try {
      const response = await this.inventoryService.transferInventory(this.inventoryTransfer);
      await this.fetchInventory();
      this.selectedInventory = []
      this.inventoryTransfer = this.resetTransferInventory();
      this.toastService.showSuccess('Success', response.data);
    } catch (error) {
      this.toastService.showError('Error', `Failed to Transfer Inventory!`);
    }
  }


  onToolBarDropDownChange(selected:any) {
    this.selectedUser = selected;    
  }
}
