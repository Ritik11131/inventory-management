import { lastPosStatusColors, vehicleFilterCountObject } from './../../../shared/constants/dashboard';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { VehicleFiltersComponent } from './vehicle-filters/vehicle-filters.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleStatsComponent } from './vehicle-stats/vehicle-stats.component';

import { latLng, Map, tileLayer } from "leaflet";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { DashboardService } from '../../../core/services/dashboard.service';




@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [SplitterModule, VehicleFiltersComponent,VehicleListComponent,VehicleStatsComponent,LeafletModule,LeafletMarkerClusterModule],
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


    private plotVehicles(vehicleData: any, filterStatus?: string): void {
        const markers: L.CircleMarker[] = []; // Array to hold markers for fitBounds
         // Remove existing markers from the map
         this.map.removeLayer(this.markerClusterGroup);
    
         // Clear the marker cluster group
         this.markerClusterGroup.clearLayers();

          // Filtered list of vehicles to display in HTML
        this.filteredVehiclesList = [];
    
        // Iterate through vehicle statuses
        for (const status in vehicleData) {
            // If a filter is provided, only plot vehicles of that status
            if (filterStatus && filterStatus !== status) {
                continue; // Skip this status if it doesn't match the filter
            }
    
            vehicleData[status].forEach((vehicle: any) => {
                if (vehicle?.latitude && vehicle?.longitude) {
                    const marker: L.CircleMarker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
                        color: lastPosStatusColors[status],
                        radius: 5
                    });
                    marker.bindTooltip(`Vehicle No: ${vehicle.vehicleNo}`, { direction: 'top' });
                    markers.push(marker); // Add marker to the array
                    this.markerClusterGroup.addLayer(marker);

                     // Add the vehicle to filtered list for HTML rendering
                    this.filteredVehiclesList.push(
                      {
                        status, 
                        ...vehicle 
                      }
                    );
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

    handleFilterClick(event:any) {
      this.plotVehicles(this.lastPositionData,event.key === 'ALL' ? null : event.key);
    }
    

}
