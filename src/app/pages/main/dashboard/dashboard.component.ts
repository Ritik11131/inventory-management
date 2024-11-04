import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { icon, latLng, Map, Marker, marker, tileLayer } from "leaflet";
import { ChartModule } from 'primeng/chart';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { secondRowCharts, thirdRowCharts, totalRegistrationObject, vehicleStatusOverviewObject } from '../../../shared/constants/dashboard';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartComponent } from "ng-apexcharts";
import { KnobModule } from 'primeng/knob';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule, ChartModule, LeafletModule, ProgressBarModule, PanelModule, FormsModule, CommonModule,ScrollPanelModule,NgApexchartsModule,KnobModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  vehicleStatusOverview = vehicleStatusOverviewObject;
  totalRegistrationObject = totalRegistrationObject
  secondRowCharts = secondRowCharts;
  thirdRowCharts = thirdRowCharts;


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private dashboardService: DashboardService) {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: true
      },
      fill: {
        type: "gradient"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 380
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
   }


  map!: Map;

  leafletOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
  };

  onMapReady(map: Map) {
    this.map = map;
  }



  ngOnInit(): void {
    this.fetchUserCountAndDeviceStock().then();
    this.fetchVehicleTypesAndCount().then()
  }

  async fetchVehicleTypesAndCount() : Promise<any> {
    try {
      const response = await this.dashboardService.getvehicleTypesAndCount();
      console.log(response,'ressss');
      const availableVehicleTypes = response.data.reduce((acc : any, { categoryName, deviceCount } : any) => {
        acc[categoryName] = (acc[categoryName] || 0) + deviceCount; // Increment if exists, or initialize
        return acc;
      }, {} as { [key: string]: number });


      this.thirdRowCharts[0].data = {
        ...this.thirdRowCharts[0].data,
        labels: Object.keys(availableVehicleTypes),
        datasets: [{
          ...this.thirdRowCharts[0].data.datasets[0],  // Keep other dataset properties like backgroundColor
          data: Object.values(availableVehicleTypes)
        }]
      };
      
    } catch (error) {
      
    }
  }

  async fetchUserCountAndDeviceStock(): Promise<any> {
    try {
      const response = await this.dashboardService.getUserCountAndDeviceStock();
      console.log(response, 'response');

      this.totalRegistrationObject = response?.data?.userCountTask;

      const filtereddeviceInStock = response?.data?.deviceInStock?.filter((object : any) => object?.user?.usertype !== 'User');
      console.log(filtereddeviceInStock,'filtered');

      let availableUsers: Record<string, number> = {
        OEM: 0,
        Distributor: 0,
        Dealer: 0,
        User: 0
      };
      
      // Loop through filtered devices and dynamically increment user counts
      filtereddeviceInStock.forEach((obj: any) => {
        const userType = obj.user.usertype;
        
        // Only increment if the user type exists in availableUsers
        if (availableUsers.hasOwnProperty(userType)) {
          availableUsers[userType] += obj.count;
        }
      });


      this.thirdRowCharts[1].data = {
        ...this.thirdRowCharts[1].data,
        labels: Object.keys(availableUsers),
        datasets: [{
          ...this.thirdRowCharts[1].data.datasets[0],  // Keep other dataset properties like backgroundColor
          data: Object.values(availableUsers)
        }]
      };


      console.log(availableUsers);
      
      


    } catch (error) {

    }
  }

  onClick(event  :any) {
    console.log(event);
    
  }

}
