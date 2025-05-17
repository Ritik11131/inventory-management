import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [MultiSelectModule, CommonModule, FormsModule, CalendarModule, InputTextModule, ToolbarModule,DropdownModule,FloatLabelModule,FileUploadModule,InputNumberModule, GenericTableComponent],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss',
  providers:[ConfirmationService, DatePipe]
})
export class ReportDetailComponent implements OnInit {
  report: any;
  selectedRto!:any;
  selectedOem!:any;
  selectedDate!:any;
  rtos:any = []
  oems!:any
  states: any[] = [];
  selectedState!: any;
  selectedDays!: number;
  selectedDayRange!: any;
  selectedSpecificVehicle: any;
  reportTableData:any[] = [];
  isReportLoading: boolean = false;
  maxDate: any = null

  today: Date = new Date();
  yesterday: Date = new Date(new Date().setDate(new Date().getDate() - 1));

  daysRangeOptions: any[] = [
    { label: '1 - 3 day', value: [1,3] },
    { label: '3 - 7 day', value: [3,7] },
    { label: '7 - 15 day', value: [7,15] },
    { label: '15 - 30 day', value: [15,30] },
    { label: '> 30 day', value: [30,0] },
  ];

  private previousStates: any[] = [];

  constructor(private route: ActivatedRoute, private rtoService:RtoService, private dynamicuserService:DynamicUserService, private confirmationService: ConfirmationService,
     private stateService:StatesService, private reportService:ReportService, private toastService:ToastService) {}

  ngOnInit() {
    this.route.data.subscribe(({ report }) => {
      this.report = report;
      const disableFuture = this.report?.filters?.date?.disableFutureDate;
      const disableCurrent = this.report?.filters?.date?.disableCurrentDate;

      this.maxDate = disableFuture
        ? (disableCurrent ? this.yesterday : this.today)
        : null;

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
    return await this.rtoService.getList(state) || [];
  }
  
  async getOEMList(): Promise<any> {
    return await this.dynamicuserService.getList();
  }

  async getStateList(): Promise<any> {
    return await this.stateService.getList();
  }

  // async onStateChange(event: any): Promise<void> {
  //   try {
  //     const currentStates = event.value;
  //     const removedStates = this.previousStates.filter(
  //       prev => !currentStates.some((cur: any) => cur?.id === prev?.id)
  //     );
  
  //     const addedStates = currentStates.filter(
  //       (cur: any) => !this.previousStates.some((prev: any) => prev?.id === cur?.id)
  //     );
  
  //     this.selectedState = currentStates;
  //     this.previousStates = [...currentStates]; // Update previous selection
  
  //     // Remove RTOs corresponding to deselected states
  //     removedStates.forEach((state: any) => {
  //       this.rtos = this.rtos.filter((rto: any) => rto.stateId !== state?.id);
  //       this.selectedRto = null
  //     });
  
  //     // If all states removed
  //     if (currentStates.length === 0) {
  //       this.rtos = [];
  //       this.selectedRto = null;
  //       this.toastService.showWarn('No states selected', 'Warning');
  //       return;
  //     }
  
  //     // Fetch RTOs only for newly added states
  //     const newRtos: any[] = [];
  //     const errors: string[] = [];
  
  //     await Promise.all(
  //       addedStates.map(async (state: any) => {
  //         try {
  //           const res = await this.getRTOList({ id: state?.id });
  //           if (res?.data?.length) {
  //             // Attach stateId to each RTO entry for tracking
  //             const enrichedRtos = res.data.map((rto: any) => ({
  //               ...rto,
  //               stateId: state?.id
  //             }));
  //             newRtos.push(...enrichedRtos);
  //           }
  //         } catch (err) {
  //           console.error(`Failed for state ${state?.name}`, err);
  //           errors.push(`Failed for ${state?.name}`);
  //         }
  //       })
  //     );
  
  //     this.rtos = [...this.rtos, ...newRtos];
  
  //     if (this.rtos.length === 0) {
  //       this.selectedRto = null;
  //       this.toastService.showWarn('No RTOs found for selected states.', 'Warning');
  //     }
  
  //     if (errors.length > 0) {
  //       this.toastService.showError(errors.join(', '), 'Partial Failure');
  //     }
  
  //   } catch (error) {
  //     console.error('Unexpected error in onStateChange', error);
  //     this.toastService.showError('Something went wrong', 'Oops!');
  //   }
  // }


  async onStateChange(event: any): Promise<void> {
  try {
    const selectedState = event.value;
    this.selectedState = selectedState;

    // Clear previous RTOs
    this.rtos = [];
    this.selectedRto = null;

    try {
      const res = await this.getRTOList({ id: selectedState.id });
      if (res?.data?.length) {
        // Attach stateId to each RTO entry for tracking (if needed)
        this.rtos = res.data.map((rto: any) => ({
          ...rto,
          stateId: selectedState.id
        }));
      } else {
        this.toastService.showWarn('No RTOs found for selected state.', 'Warning');
      }
    } catch (err: any) {
      console.error(`Failed to fetch RTOs for ${selectedState.name}`, err);
      this.toastService.showError(err.error.data, 'Error');
    }

  } catch (error) {
    console.error('Unexpected error in onStateChange', error);
    this.toastService.showError('Something went wrong', 'Oops!');
  }
}

  
  

  async onDaysRangeChange(event: any): Promise<void> {

  }
  

  async loadReportData(): Promise<void> {
    let payload: any = {
      rtoId: this.selectedRto.map((item: any) => item.id),
      OemId: this.selectedOem.map((item: any) => item.sno),
      filter : this.selectedSpecificVehicle || ""
    }

    if(this.report.filters.date?.enabled) {
      payload['reportDate'] = (() => { const d = new Date(this.selectedDate); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00.000+05:30`; })();
    }

    if(this.report.filters.days) {
      payload['days'] = this.selectedDays;
    }

    if(this.report.filters.daysRange) {
      payload['range'] = this.selectedDayRange.value;
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
    
    } catch (error: any) {
      this.reportTableData = [];
      console.error('Error loading report data:', error);
      this.toastService.showError(error.error.data, 'error');
    } finally {
      this.isReportLoading = false;
    }
    
  }


  async handleSendMessage(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to send message?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: "p-button-danger p-button-text",
      acceptButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: async () => {
        try {
          const response = await this.reportService.sendMessageFromReport('report/Expired/SendMessage', event?.item);
          this.toastService.showSuccess('Message Sent Successfully', 'success');
        } catch (error: any) {
          console.error('Error sending message:', error);
          this.toastService.showError(error.error.data, 'error');
        }
      },
      reject: () => {
        this.toastService.showInfo('Rejected', 'You have rejected');
      }
    });
   
  }


}  