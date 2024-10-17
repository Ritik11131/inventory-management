import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ToastService } from '../../../../core/services/toast.service';
import { InventoryColumns } from '../../../../shared/constants/columns';

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

  constructor(private inventoryService:InventoryService,private toastService:ToastService) {}


  ngOnInit(): void {
    this.fetchInventory().then();
  }

  async fetchInventory(): Promise<any> {
    this.isLoading = true;
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
  onSelectionChange(event: any) {
    console.log(event,'event');
  }
}
