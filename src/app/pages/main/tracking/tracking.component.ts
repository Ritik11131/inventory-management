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
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GenericDatepickerComponent } from "../../../shared/components/generic-datepicker/generic-datepicker.component";
import { TrackingService } from '../../../core/services/tracking.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';




@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [VehicleFiltersComponent, VehicleListComponent, VehicleStatsComponent, LeafletModule, LeafletMarkerClusterModule, ButtonModule, CommonModule, GenericDatepickerComponent,ProgressSpinnerModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss',
  animations: [
    trigger('collapse', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-out')
      ]),
    ])
  ]
})
export class TrackingComponent implements OnInit {
  map!: Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  filteredVehiclesList: any[] = [];
  lastPositionData: any[] = []
  vehicleFilterCount = vehicleFilterCountObject;
  totalvehicleCount: number = 0;
  selectedVehicle: any = null; // Tracks the currently selected vehicle
  isCollapsed: boolean = false;
  makeDatepickerVisible: boolean = false;
  creatingPlaybackPath:boolean = false;
  private trackLine!: L.Polyline;
  private startMarker!: L.Marker;
  private endMarker!: L.Marker;
  

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


  constructor(private dashboardService: DashboardService, private trackingService: TrackingService) { }

  ngOnInit() {
    this.fetchLastPositionStats().then();
  }


  onMapReady(map: Map) {
    this.map = map;
    this.markerClusterGroup = L.markerClusterGroup();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  async fetchLastPositionStats(): Promise<any> {
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
      this.map.dragging?.disable(); // Disable map dragging
      this.map.scrollWheelZoom?.disable(); // Disable scroll zoom
      this.map.touchZoom?.disable(); // Disable touch zoom (pinch zoom)
      this.map.doubleClickZoom?.disable(); // Disable double-click zoom
    }
  }

  enableMapInteractions() {
    if (this.map) {
      this.map.dragging?.enable(); // Enable map dragging
      this.map.scrollWheelZoom?.enable(); // Enable scroll zoom
      this.map.touchZoom?.enable(); // Enable touch zoom (pinch zoom)
      this.map.doubleClickZoom?.enable(); // Enable double-click zoom
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
        let allCount: any = 0;
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
    this.clearReplayObjects();

    if (event?.status && event?.latitude && event?.longitude) {
      // If the event contains a single vehicle's details
      this.plotVehicles(event);
      try {
        const response = await this.trackingService.getInfoWindowDetails(event?.deviceSno);
        this.selectedVehicle = { vehicleNo: event?.vehicleNo, status: event?.status, ...response?.data };
      } catch (error) {
        this.selectedVehicle = {};
      }
    } else {
      // If the event is for filtering multiple vehicles
      const filterStatus = event?.key === 'ALL' ? null : event?.key;
      this.plotVehicles(this.lastPositionData, filterStatus);
    }
  }


  handlePlayback() {
    this.makeDatepickerVisible = true;
  }

  onHideDatepicker(event: any) {
    this.makeDatepickerVisible = event
  }

  async onDateSelected(event: any): Promise<any> {
    this.creatingPlaybackPath = true;
    const start = (new Date(event.start.getTime() + (5 * 60 + 30) * 60 * 100)).toISOString().split('.')[0];
    const end = (new Date(event.end.getTime() + (5 * 60 + 30) * 60 * 100)).toISOString().split('.')[0];
    try {
      const response = await this.trackingService.getLastPositionRelay({ sno: this.selectedVehicle?.device?.sno, FromTime: start, ToTime: end });
      this.isCollapsed = true;
      this.updateTrackData(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      this.creatingPlaybackPath = false;
    }
  }



  public updateTrackData(trackData: any[]): void {

    // Remove existing markers from the map
    this.map.removeLayer(this.markerClusterGroup);
    // Clear the marker cluster group
    this.markerClusterGroup.clearLayers();
    this.clearReplayObjects();
    
    // Create polyline
    const coordinates = trackData.map(point => [point.latitude, point.longitude]);
    this.trackLine = L.polyline(coordinates as L.LatLngExpression[], {
      color: '#1E90FF',
      weight: 5
    }).addTo(this.map);

    // Add click event to polyline for popup
    this.trackLine.on('click', (e: L.LeafletMouseEvent) => {
      const closest = this.findClosestPoint(e.latlng, trackData);
      if (closest) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(this.createPopupContent(closest))
          .openOn(this.map);
      }
    });

    // Add start and end markers
    if (trackData.length > 0) {
      const startPoint = trackData[0];
      const endPoint = trackData[trackData.length - 1];

      this.startMarker = L.marker([startPoint.latitude, startPoint.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(this.map);

      this.endMarker = L.marker([endPoint.latitude, endPoint.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(this.map);
    }

    // Fit bounds to show all points
    this.map.fitBounds(this.trackLine.getBounds());
  }

  private findClosestPoint(clickPoint: L.LatLng, points: any[]): any | null {
    let minDist = Infinity;
    let closest: any | null = null;

    points.forEach(point => {
      const dist = clickPoint.distanceTo(L.latLng(point.latitude, point.longitude));
      if (dist < minDist) {
        minDist = dist;
        closest = point;
      }
    });

    return closest;
  }

  private createPopupContent(point: any): string {
    return `
      <div class="custom-popup">
        <h4>Vehicle Details</h4>
        <p><b>Speed:</b> ${point?.speed} km/h</p>
        <p><b>Time:</b> ${new Date(point.fixtime).toLocaleString()}</p>
      </div>
    `;
  }

  clearReplayObjects() {
    if (this.trackLine) {
      this.map.removeLayer(this.trackLine);
    }
    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
    }
    if (this.endMarker) {
      this.map.removeLayer(this.endMarker);
    }
  }
}
