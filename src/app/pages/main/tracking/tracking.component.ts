import { lastPosStatusColors, vehicleFilterCountObject } from './../../../shared/constants/dashboard';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { VehicleFiltersComponent } from './vehicle-filters/vehicle-filters.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleStatsComponent } from './vehicle-stats/vehicle-stats.component';
import { latLng, Map, tileLayer } from "leaflet";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [VehicleFiltersComponent,VehicleListComponent,VehicleStatsComponent,LeafletModule,LeafletMarkerClusterModule,ButtonModule,CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit {
  map!: Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  filteredVehiclesList:any[] = [];
  lastPositionData:any[] = []
  vehicleFilterCount = vehicleFilterCountObject;
  totalvehicleCount:number = 0;
  selectedVehicle: any = null; // Tracks the currently selected vehicle


    leafletOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; Open Street Hot',
            maxZoom: 18,
        })
      ],
      zoom: 5,
      center: latLng(27.54095593, 79.16035184)
    };


    constructor(private dashboardService:DashboardService) {}

    ngOnInit() {
      this.fetchLastPositionStats().then();
    }


    onMapReady(map: Map) {
        this.map = map;
        this.markerClusterGroup = L.markerClusterGroup();
    }

    async fetchLastPositionStats() : Promise<any> {
      try {
      const response = await this.dashboardService.getLastPositionStats();
      this.lastPositionData = response?.data
      this.updateVehicleFilterCounts(this.lastPositionData);
      this.plotVehicles(this.lastPositionData)
       
      } catch (error) {
        
      }
    }

    disableMapInteractions() {
      if (this.map) {
        this.map.dragging.disable(); // Disable map dragging
        this.map.scrollWheelZoom.disable(); // Disable scroll zoom
        this.map.touchZoom.disable(); // Disable touch zoom (pinch zoom)
        this.map.doubleClickZoom.disable(); // Disable double-click zoom
      }
    }
  
    enableMapInteractions() {
      if (this.map) {
        this.map.dragging.enable(); // Enable map dragging
        this.map.scrollWheelZoom.enable(); // Enable scroll zoom
        this.map.touchZoom.enable(); // Enable touch zoom (pinch zoom)
        this.map.doubleClickZoom.enable(); // Enable double-click zoom
      }
    }


    private plotVehicles(vehicleDataOrSingleVehicle: any, filterStatus?: string): void {
      const markers: L.CircleMarker[] = []; // Array to hold markers for fitBounds
  
      // Remove existing markers from the map
      this.map.removeLayer(this.markerClusterGroup);
  
      // Clear the marker cluster group
      this.markerClusterGroup.clearLayers();
  
      // Check if it's a single vehicle object or vehicle data list
      if (vehicleDataOrSingleVehicle?.latitude && vehicleDataOrSingleVehicle?.longitude) {
          // Single vehicle scenario
          const vehicle = vehicleDataOrSingleVehicle;
          const marker: L.CircleMarker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
              color: lastPosStatusColors[vehicle.status] || 'blue', // Default to 'blue' if status color is unavailable
              radius: 5,
          });
  
          marker.bindTooltip(
              `Vehicle No: ${vehicle.vehicleNo}<br>Status: ${vehicle.status}`,
              { direction: 'top' }
          );
  
          this.markerClusterGroup.addLayer(marker);
          this.map.addLayer(this.markerClusterGroup);
          this.map.setView([vehicle.latitude, vehicle.longitude], 15); // Zoom level 15 for focus
  
      } else if (typeof vehicleDataOrSingleVehicle === 'object') {
          // Multiple vehicles scenario
          const vehicleData = vehicleDataOrSingleVehicle;
  
          // Filtered list of vehicles to display in HTML
          this.filteredVehiclesList = [];
  
          for (const status in vehicleData) {
              if (filterStatus && filterStatus !== status) {
                  continue; // Skip this status if it doesn't match the filter
              }
  
              vehicleData[status].forEach((vehicle: any) => {
                  if (vehicle?.latitude && vehicle?.longitude) {
                      const marker: L.CircleMarker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
                          color: lastPosStatusColors[status],
                          radius: 5,
                      });
  
                      marker.bindTooltip(`Vehicle No: ${vehicle.vehicleNo}`, { direction: 'top' });
                      markers.push(marker);
                      this.markerClusterGroup.addLayer(marker);
  
                      this.filteredVehiclesList.push({
                          status,
                          ...vehicle,
                      });
                  }
              });
          }
  
          this.map.addLayer(this.markerClusterGroup);
  
          // Fit the map bounds to the markers
          if (markers.length > 0) {
              const group = L.featureGroup(markers);
              this.map.fitBounds(group.getBounds());
          }
      }
  }


    private updateVehicleFilterCounts(response: any) {
      this.vehicleFilterCount.forEach(item => {
        if (item.key === 'ALL') {
          // Calculate the sum of all other keys in response
          let allCount:any = 0;
          Object.keys(response).forEach(key => {
            if (key !== 'ALL') {
              allCount += response[key]?.length || 0;
            }
          });
          item.label = allCount; // Assign the sum to the 'ALL' key's label
          this.totalvehicleCount = allCount;
        } else {
          // For other keys, just use their respective counts
          item.label = response[item.key]?.length || 0;
        }
      });
    }

    async handleFilterClick(event: any): Promise<any> { 
      this.selectedVehicle = null;
           
      if (event?.status && event?.latitude && event?.longitude) {
          // If the event contains a single vehicle's details
          this.plotVehicles(event);
          try {
            const response = await this.dashboardService.getInfoWindowDetails(event?.deviceSno);
            this.selectedVehicle = {vehicleNo:event?.vehicleNo, status:event?.status, ...response?.data};
            
          } catch (error) {
            this.selectedVehicle = {};
          }
      } else {
          // If the event is for filtering multiple vehicles
          const filterStatus = event?.key === 'ALL' ? null : event?.key;
          this.plotVehicles(this.lastPositionData, filterStatus);
      }
  }
    

}
