import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { icon, latLng, Map, Marker, marker, tileLayer } from "leaflet";
import { ChartModule } from 'primeng/chart';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { secondRowCharts, thirdRowCharts, vehicleStatusOverviewObject } from '../../../shared/constants/dashboard';
import { DashboardService } from '../../../core/services/dashboard.service';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule, ChartModule, LeafletModule, ProgressBarModule, PanelModule, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  vehicleStatusOverview = vehicleStatusOverviewObject;
  secondRowCharts = secondRowCharts;
  thirdRowCharts = thirdRowCharts;

  constructor(private dashboardService: DashboardService) { }


  map!: Map;

  lealfetOptions = {
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
    this.fetchUserCountAndDeviceStock().then()
  }


  async fetchUserCountAndDeviceStock(): Promise<any> {
    try {
      const response = await this.dashboardService.getUserCountAndDeviceStock();
      console.log(response, 'response');

      this.secondRowCharts[0].data = {
        ...this.secondRowCharts[0].data,
        labels: Object.keys(response.data.userCountTask),
        datasets: [{
          ...this.secondRowCharts[0].data.datasets[0],  // Keep other dataset properties like backgroundColor
          data: Object.values(response.data.userCountTask)
        }]
      };

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

}
