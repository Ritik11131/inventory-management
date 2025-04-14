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

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, FormsModule, CalendarModule, ToolbarModule,DropdownModule,FloatLabelModule,FileUploadModule, GenericTableComponent],
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

  constructor(private authService:AuthService, private route: ActivatedRoute, private http:HttpService, private dynamicuserService:DynamicUserService,  private toastService: ToastService) {}

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
        this.getUserList()
      ]);
      this.users = userResponse?.data;
  
    } catch (error) {
      console.error('Error loading data:', error);
      // Handle errors appropriately (e.g., show an alert or fallback data)
    }
  }

  async loadSubUsers() {
    try {
      // Run both API calls in parallel
      const [subUserResponse] = await Promise.all([
        this.getUserList()
      ]);
      this.users = [];
  
    } catch (error) {
      console.error('Error loading data:', error);
      // Handle errors appropriately (e.g., show an alert or fallback data)
    }
  }
  
  async getUserList(): Promise<any> {
    return await this.dynamicuserService.getList();
  }

  async handleUserChange(e: any) {
    console.log(e);
    // await this.loadSubUsers();
  }

  async loadReport(): Promise<void> {    
    const formattedDates = this.selectedDate.map((date: any) => new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19));

    const payload = {
      distributorId:this.selectedUser?.sno,
      dealerId: null,
      fromTime: formattedDates[0],
      toTime: formattedDates[1]
  }
  this.isTableDataLoading = true;
    try {
      const response = await this.http.post('mis/activation/ActivationReport',payload);
      this.reportTableData = response?.data;
    } catch (error) {
      console.log(error);
      this.toastService.showError('Error', `Failed to fetch Report !`);
    } finally {
      this.isTableDataLoading = false;
    }
    
  }
}  