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
import { StatesService } from '../../../../core/services/states.service';
import { ReportService } from '../../../../core/services/report.service';
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
  selectedRto!:any;
  selectedOem!:any;
  selectedDate!:any;
  rtos!:any
  oems!:any
  states: any[] = [];
  selectedState!: any;
  reportTableData:any[] = [];
  isReportLoading: boolean = false;

  constructor(private route: ActivatedRoute, private rtoService:RtoService, private dynamicuserService:DynamicUserService,
     private stateService:StatesService, private reportService:ReportService, private toastService:ToastService) {}

  ngOnInit() {
    this.route.data.subscribe(({ report }) => {
      this.report = report;
      this.initReport();
    });
  }
  
  async initReport() {
    try {
      // Run both API calls in parallel
      const [statesResponse, oemsResponse] = await Promise.all([
        this.getStateList(),
        this.getOEMList()
      ]);
  
      // Update the local variables after both calls finish
      this.states = statesResponse?.data;
      this.oems = oemsResponse?.data;
  
    } catch (error) {
      console.error('Error loading data:', error);
      // Handle errors appropriately (e.g., show an alert or fallback data)
    }
  }
  
  async getRTOList(state: any): Promise<any> {
    return await this.rtoService.getList(state);
  }
  
  async getOEMList(): Promise<any> {
    return await this.dynamicuserService.getList();
  }

  async getStateList(): Promise<any> {
    return await this.stateService.getList();
  }

  async onStateChange(event: any): Promise<void> {
    try {
      this.selectedState = event.value;
  
      const [rtosResponse] = await Promise.all([
        this.getRTOList({ id: this.selectedState?.id })
      ]);
  
      this.rtos = rtosResponse?.data || [];
  
      if (this.rtos.length === 0) {
        this.toastService.showWarn('No RTOs Found for the selected state', 'warn');
      }
  
    } catch (error: any) {
      this.rtos = [];
      console.error('Error fetching RTO list:', error);
      this.toastService.showError(error.error.data, 'Oops!');
    }
  }
  

  async loadReportData(): Promise<void> {
    let payload: any = {
      rtoId: this.selectedRto.map((item: any) => item.id),
      OemId: this.selectedOem.map((item: any) => item.sno),
    }

    if(this.report.filters.date?.enabled) {
      payload['reportDate'] = (() => { const d = new Date(this.selectedDate); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00`; })();

    }

    this.isReportLoading = true;
    
    // Call your service to fetch the report data here
    try {
      const response = await this.reportService.getReportData(this.report.api, payload);
    
      // Assign data first
      this.reportTableData = response?.data || [];
    
      if (this.reportTableData.length === 0) {
        this.toastService.showWarn('No Data Found', 'warn');
      } else {
        this.toastService.showSuccess('Data Loaded Successfully', 'success');
      }
    
    } catch (error) {
      this.reportTableData = [];
      console.error('Error loading report data:', error);
      this.toastService.showError('Failed to load report data', 'error');
    } finally {
      this.isReportLoading = false;
    }
    
  }


}  