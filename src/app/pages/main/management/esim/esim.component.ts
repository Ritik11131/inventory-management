import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { GenericDialogComponent } from '../../../../shared/components/generic-dialog/generic-dialog.component';
import { FormFields } from '../../../../shared/interfaces/forms';
import { eSimColumns } from '../../../../shared/constants/columns';
import { eSimFormFields } from '../../../../shared/constants/forms';
import { SimProvidersService } from '../../../../core/services/sim-providers.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EsimService } from '../../../../core/services/esim.service';
import { downloadFile } from '../../../../shared/utils/common';

@Component({
  selector: 'app-esim',
  standalone: true,
  imports: [GenericTableComponent, GenericDialogComponent],
  templateUrl: './esim.component.html',
  styleUrl: './esim.component.scss'
})
export class EsimComponent {


  fields: FormFields[] = eSimFormFields;
    eSims: any[] = [];
    columns = eSimColumns;
    isEditing: boolean = false;
    isLoading: boolean = false;
    eSimDialog: boolean = false;
    eSim!: any;
    submitted: boolean = false;

    constructor(private simProviderService:SimProvidersService, private toastService:ToastService, private eSimService:EsimService) {}

    ngOnInit(): void {
      this.fetchESIMList()
    }

    reseteSim() {
      return {
        serviceproviderid: null,
        file:null
      };
    }

    onHideDialog(isVisible: boolean) {
      this.eSimDialog = isVisible;
      this.isEditing = false;
    }

    async fetchESIMList(): Promise<any> {
      this.isLoading = true;
      this.eSims = [];
      try {
        const { data } = await this.eSimService.getList(500, 1);
        this.eSims = data?.items || []; // Use optional chaining for safety
        console.log(data);
    
        const { pageSize, totalPage } = data;
    
        // Create an array of promises for fetching all pages
        const pageRequests = Array.from({ length: totalPage - 1 }, (_, i) =>
          this.eSimService.getList(pageSize, i + 2) // Start from page 2
        );
    
        // Wait for all requests to complete
        const responses = await Promise.all(pageRequests);
    
        // Concatenate all items from the responses
        responses.forEach(response => {
          this.eSims = this.eSims.concat(response.data?.items || []);
        });
    
        // Optional: Show success message
        // this.toastService.showSuccess('Success', `${this.authService.getUser Type()} List fetched successfully!`);
      } catch (error:any) {
        this.toastService.showError('Error', error.error.data || 'Failed to Fetch List!');
      } finally {
        this.isLoading = false;
      }
    }


    handledDropdownChange(event:any) {
      console.log(event);
      const csvData = [
        ['serviceproviderid', 'iccid'], // Headers
        [event?.selectedValue?.id.toString(), 'ICCID67890'], // Sample Row
      ];
      
      // Convert array to CSV string
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      // Call the function to download as CSV
      downloadFile(csvString, 'sample.csv', 'text/csv');
      
    }

    /**
       * Populate the model dropdown with the list of available device models.
       * 
       * @returns {Promise<any>} Resolves with the populated dropdown options.
       */
      async generateDropdownValues(type: string): Promise<any> {
        try {
          const response = type === 'bulkUpload' ? await this.simProviderService.getList() : [];
          // Determine which form fields to use based on the 'type'
          const formFields = type === 'bulkUpload' ? eSimFormFields : [];
      
          formFields[0].options = response.data.map((obj: any) => {
            const keys = Object.keys(obj);       
            const idKey: any = keys.find(key => key.includes((type === 'bulkUpload') ? 'id' : 'sno'));
            const nameKey: any = keys.find(key => key.includes(type === 'bulkUpload' ? 'providerName' :  'name'));
      
            // Setting dropdownKeys based on found keys
            formFields[0].dropdownKeys = { idKey, nameKey };
    
    
      
            return (type === 'bulkUpload')
              ? {
                id: obj[idKey],
                providerName: obj[nameKey],
              }
                : {
                  sno: obj[idKey],
                  name: obj[nameKey],
                };
          });
      
          console.log(formFields);
      
          // Show success message (optional)
          // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
        } catch (error) {
          // If there's an error, clear the options
          const formFields = eSimFormFields;
      
          formFields[0].options = [];
          this.toastService.showError('Error', `Something Went Wrong!`);
        }
      }

    async openNew(event: any) : Promise<any> {
      await this.generateDropdownValues('bulkUpload');
      this.isEditing = !event;
      this.eSim = this.reseteSim();
      this.eSimDialog = event;
    }

    async onSave(data: any): Promise<any> {
      console.log(data);
      const formData = new FormData();
      formData.append('file', data.file, data.file.name);
  
      const fileReader = new FileReader();
      fileReader.onload = async (e: any) => {
        const fileContent = e.target.result.trim(); // Read full file content and trim whitespace
        const lines = fileContent.split('\n'); // Split by new lines
  
        if (lines.length < 2) {
          return this.toastService.showError('Error', 'File must contain at least one data row.');
        }
  
        const uploadedHeaders = lines[0].split(',').map((header: any) => header.trim()); // Extract and trim headers
        const expectedHeaders = ['serviceproviderid', 'iccid']; // Define expected headers
  
        // Check if headers match exactly
        const isValidHeaders = uploadedHeaders.join(',') === expectedHeaders.join(',');
  
        if (isValidHeaders) {
          try {
            await this.handleBulkUpload(formData); // Upload file if headers match
            await this.fetchAndResetESims(); // Reset state after success
          } catch (error) {
            console.error('Bulk upload failed:', error);
          }
        } else {
          this.toastService.showError('Error', 'Invalid file format. Please upload a file with the correct headers: serviceproviderid, iccid.');
        }
      };
  
      fileReader.readAsText(data.file); // Read file as text
    }

    async handleBulkUpload(data: any): Promise<any> {
      try {
        const response = await this.eSimService.bulkUpload(data);
        console.log(response);
        this.toastService.showSuccess('Success', 'Provider Created Successfully!');
      } catch (error: any) {
        this.toastService.showError('Error', error.error.data.message);
        downloadFile(error?.error?.data?.error, 'error_rows.txt','text/plain');
        throw error;
      }
    }

    async fetchAndResetESims(): Promise<any> {
      await this.fetchESIMList();
      this.eSimDialog = false;
      this.eSim = this.reseteSim();
      this.isEditing = false;
      // this.currentAction = null;
    }


}
