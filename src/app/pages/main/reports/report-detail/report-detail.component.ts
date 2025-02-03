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

  constructor(private route: ActivatedRoute, private rtoService:RtoService, private dynamicuserService:DynamicUserService) {}

  ngOnInit() {
    this.route.data.subscribe(({ report }) => {
      this.report = report;
      this.loadData();
    });
  }
  
  async loadData() {
    try {
      // Run both API calls in parallel
      const [rtosResponse, oemsResponse] = await Promise.all([
        this.getRTOList({ id: 35 }),
        this.getOEMList()
      ]);
  
      // Update the local variables after both calls finish
      this.rtos = rtosResponse?.data;
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
}  