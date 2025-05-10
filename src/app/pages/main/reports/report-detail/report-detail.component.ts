import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { RtoService } from '../../../../core/services/rto.service';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicUserService } from '../../../../core/services/dynamic-user.service';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpService } from '../../../../core/services/http.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DialogModule } from 'primeng/dialog';
import { EsimService } from '../../../../core/services/esim.service';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ExportService } from '../../../../core/services/export.service';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, FormsModule, CalendarModule, ToolbarModule,DropdownModule,FloatLabelModule,FileUploadModule, GenericTableComponent, DialogModule, TableModule, ProgressSpinnerModule],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnInit {
  report: any;
  selectedSubUser!:any;
  selectedUser!:any;
  selectedDate!:any;
  subUsers!:any
  users!:any
  distributors!:any
  userType!:any
  reportTableData:any[] = [];
  isTableDataLoading: boolean = false;
  isDialogVisible: boolean = false;
  dialogContentType: string = '';
  selectedLinkedDevicesData:any = [];


  constructor(private authService:AuthService, private route: ActivatedRoute, private http:HttpService, private dynamicuserService:DynamicUserService,  private toastService: ToastService, private esimService:EsimService, private exportService:ExportService, private loaderService:LoaderService) {}

  ngOnInit() {
    this.userType = this.authService.getUserType()
    this.route.data.subscribe(({ report }) => {
      this.report = report;      
      this.loadUsers();
    });
  }
  
  async loadUsers() {
    try {
      // Run both API calls in parallel
      const [userResponse] = await Promise.all([
        this.getDistruibutorList()
      ]);
      this.users = userResponse?.data;
      this.selectedUser = this.users[0]; // Set the first user as selected by default
      this.loadSubUsers(this.selectedUser?.sno); // Load sub-users for the first user
  
    } catch (error) {
      console.error('Error loading data:', error);
      // Handle errors appropriately (e.g., show an alert or fallback data)
    }
  }

  async loadSubUsers(selectedDistributor:number) {
    try {
      // Run both API calls in parallel
      const [subUserResponse] = await Promise.all([
        this.getDealerList(selectedDistributor)
      ]);
      this.subUsers = subUserResponse?.data;
      // this.selectedSubUser = this.subUsers[0]; // Set the first sub-user as selected by default
  
    } catch (error) {
      console.error('Error loading data:', error);
      // Handle errors appropriately (e.g., show an alert or fallback data)
    }
  }

  async getDistruibutorList(): Promise<any> {
    return await this.dynamicuserService.getDistributorList();  
  }
  
  async getDealerList(selectedDistributor:number): Promise<any> {
    return await this.dynamicuserService.getDealerListByDistributor(selectedDistributor);
  }

  async handleUserChange(e: any) {
    console.log(e);
    this.selectedSubUser = null
    await this.loadSubUsers(e?.value?.sno);
  }

  async handleTableRowBtnClick(e: any): Promise<void> {
    this.selectedLinkedDevicesData = [];
    this.isDialogVisible = true;
    this.dialogContentType = e?.key;
    if(e?.key === 'showLinkedDevices') {
       try {
      const response = await this.esimService.getActivationRquestDetailsById(e?.item?.request.requestId);
      let { requestjson } = response?.data;
      if (requestjson) {
        requestjson = JSON.parse(requestjson).map((item: any) => ({
          ...item,
          Type: e?.item?.type.name,
          Plan: e?.item?.plan.name,
          ServiceProvider: e?.item?.serviceProvider.providername,
          RequestedBy: e?.item?.user.orgname,
        }));
      }
      
      this.selectedLinkedDevicesData = requestjson;
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch');
    }
    }
    
  }

  hideDialog() {
     this.isDialogVisible = false;
  }

   exportLinkedDevices() {
    this.exportService.exportToExcel(this.selectedLinkedDevicesData, 'Linked Devices');
  }


async handleExportReportTableData(e: any) {

  if (e) {
    const toExportData: any[] = [];
     this.loaderService.show();
    try {
      const promises = this.reportTableData.map(async (row: any) => {
        try {
          const response = await this.esimService.getActivationRquestDetailsById(row?.request.requestId);
          let { requestjson } = response?.data;

          if (requestjson) {
            const parsedJson = JSON.parse(requestjson).map((item: any) => ({
              ...item,
              Type: row?.type.name,
              Plan: row?.plan.name,
              ServiceProvider: row?.serviceProvider.providername,
              RequestedBy: row?.user.orgname,
              Date:row.request.requestedon,
              SrId:row.request.srId,

            }));
            toExportData.push(...parsedJson); // Spread to flatten arrays
          }
        } catch (error) {
          this.toastService.showError('Error', 'Failed to fetch');
        }
      });

      await Promise.all(promises); // Wait for all to finish
      console.log(toExportData, 'EXPORT');
      this.loaderService.hide();
      // Now safe to export
      this.exportService.exportToExcel(toExportData, 'Linked Devices');

    } catch (err) {
      this.toastService.showError('Error', 'Something went wrong during export');
    }
  }
}


  async loadReport(): Promise<void> {    
    // const formattedDates = this.selectedDate.map((date: any) => new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19));
    const formattedDates = this.selectedDate.map((date: any, index: number) => {
      const d = new Date(date);
      if (index === 1) {
        d.setHours(23, 59, 59, 999);
      }
      return new Date(d.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    });
        
    const payload = {
      distributorId:this.selectedUser?.sno,
      dealerId: this.selectedSubUser?.map((subUser: any) => subUser.sno),
      fromTime: formattedDates[0],
      toTime: formattedDates[1]
  }
  this.isTableDataLoading = true;
    try {
      const response = await this.http.post('mis/activation/ActivationReport',payload);
      this.reportTableData = response?.data;      
    } catch (error: any) {
      console.log(error);
      this.toastService.showError('Error', error.error.data);
    } finally {
      this.isTableDataLoading = false;
    }
    
  }
}  