import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { icon, latLng, Map, Marker, marker, tileLayer } from "leaflet";
import { ChartModule } from 'primeng/chart';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { chartOptions, complaintStatsObject, inventoryObject, renewalStatusObject, totalRegistrationObject, vehicleInstallationTypesObject, vehicleStatusOverviewObject } from '../../../shared/constants/dashboard';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgApexchartsModule } from 'ng-apexcharts';
import { KnobModule } from 'primeng/knob';
import { TicketsService } from '../../../core/services/tickets.service';





@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule, ChartModule, LeafletModule, ProgressBarModule, PanelModule, FormsModule, CommonModule,ScrollPanelModule,NgApexchartsModule,KnobModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  
  map!: Map;

  leafletOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
  };
  vehicleStatusOverview = vehicleStatusOverviewObject;
  totalRegistration = totalRegistrationObject;
  inventory = inventoryObject;
  renewalStatus = renewalStatusObject;
  vehicleInstallationTypes = vehicleInstallationTypesObject;
  complaintStats = complaintStatsObject;
  totalComplaints:number = 0;
  totalvehicleInstallation : number = 0;
  public chartOptions: any = chartOptions;

  constructor(private dashboardService: DashboardService, private ticketService:TicketsService) {}
    

  onMapReady(map: Map) {
    this.map = map;
  }



  ngOnInit(): void {
    this.initializeDashboard();
  }


  async initializeDashboard() {
    try {
      // Run all promises in parallel to reduce waiting time
      await Promise.all([
        this.fetchUserCountAndDeviceStock(),
        this.fetchVehicleTypesAndCount(),
        this.fetchTicketsGroupByStatus()
      ]);
    
      // Process or assign the results if needed
     
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }

  async fetchTicketsGroupByStatus() : Promise<any> {
    try {
      const response = await this.ticketService.getTicketsGroupByStatus();
      this.totalComplaints = response?.data?.closed + response?.data?.open;
      this.complaintStats[0].count = response?.data?.closed;
      this.complaintStats[1].count = response?.data?.open
    } catch (error) {
      console.log(error);
    }
  }

  async fetchVehicleTypesAndCount() : Promise<any> {
    try {
      const response = await this.dashboardService.getvehicleTypesAndCount();
      response?.data?.forEach((obj : any) => {
        this.totalvehicleInstallation += obj.deviceCount;
      });
      this.vehicleInstallationTypes = response?.data;
      
    } catch (error) {
      
    }
  }

  async fetchUserCountAndDeviceStock(): Promise<any> {
    try {
      const response = await this.dashboardService.getUserCountAndDeviceStock();
      console.log(response, 'response');
      this.totalRegistration[0].value = response.data.userCountTask.OEM;
      this.totalRegistration[1].value = response.data.userCountTask.Dealer;
      
    } catch (error) {

    }
  }

  onClick(event  :any) {
    console.log(event);
    
  }

}
