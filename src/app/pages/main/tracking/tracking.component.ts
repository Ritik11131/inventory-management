import 'leaflet-trackplayer';
import { lastPosStatusColors, vehicleFilterCountObject } from './../../../shared/constants/dashboard';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { VehicleFiltersComponent } from './vehicle-filters/vehicle-filters.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import * as L from 'leaflet';
import { VehicleStatsComponent } from './vehicle-stats/vehicle-stats.component';
import { latLng, Map, tileLayer } from "leaflet";
import 'leaflet.markercluster';
import { DashboardService } from '../../../core/services/dashboard.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GenericDatepickerComponent } from "../../../shared/components/generic-datepicker/generic-datepicker.component";
import { TrackingService } from '../../../core/services/tracking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AddressService } from '../../../core/services/address.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [VehicleFiltersComponent, VehicleListComponent, VehicleStatsComponent, LeafletModule, LeafletMarkerClusterModule, 
            ButtonModule, CommonModule, GenericDatepickerComponent,ProgressSpinnerModule,SliderModule,ProgressBarModule,FormsModule],
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
  vehicleList:any[] = []
  filteredVehiclesList: any[] = [];
  lastPositionData: any[] = []
  vehicleFilterCount = vehicleFilterCountObject;
  totalvehicleCount: number = 0;
  selectedVehicle: any = null; // Tracks the currently selected vehicle
  isCollapsed: boolean = false;
  makeDatepickerVisible: boolean = false;
  creatingPlaybackPath:boolean = false;
  showPlaybackControls:boolean = false;
  trackPlayer!: any;
  

  playbackControlObject: any = {};
  vehicleHistoryInfo: any = {
    speed: 0,
    fixtime: '00:00:00',
  }

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


  constructor(private dashboardService: DashboardService, private trackingService: TrackingService,private toastService:ToastService,private addressService:AddressService) { }

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


  private plotVehicles(vehicleDataOrSingleVehicle: any, filterStatus?: string | null): void {
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

      marker.on('click', ()=>{
        console.log(vehicle);
      })

      this.markerClusterGroup.addLayer(marker);
      this.map.addLayer(this.markerClusterGroup);
      this.map.setView([vehicle.latitude, vehicle.longitude], 15); // Zoom level 15 for focus

    } else if (typeof vehicleDataOrSingleVehicle === 'object') {
      // Multiple vehicles scenario
      const vehicleData = vehicleDataOrSingleVehicle;

      // Filtered list of vehicles to display in HTML
      this.filteredVehiclesList = [];
      this.vehicleList = [];

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
            marker.on('click', ()=>{
              console.log(vehicle);
            })
            markers.push(marker);
            this.markerClusterGroup.addLayer(marker);

            this.filteredVehiclesList.push({
              status,
              ...vehicle,
            });

            this.vehicleList.push({
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



  async handleFilterClick(event: any): Promise<void> {
    this.resetPlaybackState();
  
    if (this.isSingleVehicleEvent(event)) {
      console.log(event,'event');
      
      await this.handleSingleVehicleEvent(event);
    } else {
      this.handleMultipleVehicles(event);
    }
  }
  
  resetPlaybackState(): void {
    this.selectedVehicle = null;
    this.isCollapsed = false;
    this.showPlaybackControls = false;
  
    if (this.trackPlayer) {
      this.trackPlayer.remove();
    }
  }
  
  isSingleVehicleEvent(event: any): boolean {
    return event?.status && event?.latitude && event?.longitude;
  }
  
  async handleSingleVehicleEvent(event: any): Promise<void> {
    this.plotVehicles(event);
    try {
      const response = await this.trackingService.getInfoWindowDetails(event?.deviceSno);
      const address = await this.fetchSelectedVehicleAddress(response?.data);
      this.selectedVehicle = {
        vehicleNo: event?.vehicleNo,
        status: event?.status,
        address: address?.address || 'Unknown',
        ...response?.data,
      };
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch vehicle details!');
      this.selectedVehicle = {};
    }
  }
  
  handleMultipleVehicles(event: any): void {
    const filterStatus = event?.key === 'ALL' ? null : event?.key;
    this.plotVehicles(this.lastPositionData, filterStatus);
  }
  
  async fetchSelectedVehicleAddress(data: any): Promise<any> {
    try {
      const { latitude, longitude } = data?.location || {};
      const response = await this.addressService.fetchAddress(latitude, longitude);
      return response?.data;
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch Address!');
      return null;
    }
  }

  // async handleFilterClick(event: any): Promise<any> {
  //   this.selectedVehicle = null;
  //   this.isCollapsed = false;
  //   this.showPlaybackControls = false;
  //   if(this.trackPlayer) {
  //     this.trackPlayer.remove();
  //   }

  //   if (event?.status && event?.latitude && event?.longitude) {
  //     // If the event contains a single vehicle's details
  //     this.plotVehicles(event);
  //     try {
  //       const response = await this.trackingService.getInfoWindowDetails(event?.deviceSno);
  //       const address = await this.fetchSelectedVehicleAddress(response?.data);
  //       this.selectedVehicle = { vehicleNo: event?.vehicleNo, status: event?.status, address:address?.address, ...response?.data };
        
  //     } catch (error) {
  //       this.selectedVehicle = {};
  //     }
  //   } else {
  //     // If the event is for filtering multiple vehicles
  //     const filterStatus = event?.key === 'ALL' ? null : event?.key;
  //     this.plotVehicles(this.lastPositionData, filterStatus);
  //   }
  // }

  // async fetchSelectedVehicleAddress(object:any) : Promise<any> {
  //   try {
  //     const response = (await this.addressService.fetchAddress(object?.location?.latitude,object?.location?.longitude))?.data;
  //     return response;
  //   } catch (error) {
  //     this.toastService.showError('Error','Failed to fetch Address!')
  //   }
  // }

  handleSearch(event: any) {
    const searchTerm = event?.target?.value?.trim()?.toLowerCase();    
  
    // If there's no search term, reset filtered list to the original list
    if (!searchTerm) {
      this.filteredVehiclesList = [...this.vehicleList];  // Make sure we reset to a copy of the original list
      return;
    }
  
    // Apply filter based on the search term
    this.filteredVehiclesList = this.vehicleList.filter((vehicle) => {
      return vehicle.vehicleNo.toLowerCase().includes(searchTerm);
    });
  
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
      if(response?.data.length) {
        const uniqueTrackPath = this.convertedValidJson(response?.data);

        this.map.fitBounds(uniqueTrackPath);
        this.initilizeTrackPlayer(uniqueTrackPath);
        this.showPlaybackControls = true;
      } else {
        this.toastService.showInfo('Info','No Data Found');
      }
    } catch (error) {
      console.log(error);
      this.toastService.showError('Error','Something Went Wrong')
    } finally {
      this.creatingPlaybackPath = false;
    }
  }

  convertedValidJson(data:any) : any[] {
    const trackPath = data?.map((obj:any)=>{
      return { lat:obj.latitude, lng:obj.longitude, speed:obj?.speed, fixtime:obj?.fixtime  }
    })    
    console.log(trackPath,'trackPath');
    
    
    // Find the first unique point
    const firstUniqueIndex = trackPath.findIndex((point:any, index:any) =>
        point.lat !== trackPath[0].lat || point.lng !== trackPath[0].lng
    );

    // Slice the array from the first unique point (including the first unique)
    return firstUniqueIndex > 0 ? trackPath.slice(firstUniqueIndex - 1) : trackPath;
  }

  public initilizeTrackPlayer(trackPathData: any[]) {
    // Remove existing markers from the map
    this.map.removeLayer(this.markerClusterGroup);
    // Clear the marker cluster group
    this.markerClusterGroup.clearLayers();
    // Check if TrackPlayer already exists, and remove it from the map if present
    if (this.trackPlayer) {
      this.trackPlayer.remove();
      this.trackPlayer = null; // Reset the TrackPlayer instance
    }
    this.trackPlayer = new (L as any).TrackPlayer(trackPathData, {
      speed: 500,
      markerIcon: L.icon({
        iconUrl: 'assets/images/car.png',
        iconSize: [27, 54],
        iconAnchor: [13.5, 27],
      }),
      passedLineColor: '#00ff00',
      notPassedLineColor: '#ff0000',
    });

    // Add the TrackPlayer to the map
    this.trackPlayer.addTo(this.map);

    this.initializetrackListeners(trackPathData);
    this.playbackControlObject = this.initializePlayBackControlObject();
  }

  initializePlayBackControlObject() {
    return {
      speed: this.trackPlayer.options.speed,
      progress: this.trackPlayer.options.progress * 100,
      start: () => {
        this.map.setZoom(17, {
          animate: false,
        });
        this.trackPlayer.start();
      },
      pause: () => {
        this.trackPlayer.pause();
      },
      remove: () => {
        this.trackPlayer.remove();
        this.showPlaybackControls = false;
        this.plotVehicles(this.lastPositionData, null);
        this.selectedVehicle = null;
        this.isCollapsed = false;
      },
      updateSpeed: (updatedSpeed:any) => {
        this.playbackControlObject.speed = updatedSpeed;
        this.trackPlayer.setSpeed(updatedSpeed);
      },
      updateProgress: (updatedProgress:any) => {
        this.playbackControlObject.progress = updatedProgress
        this.trackPlayer.setProgress(updatedProgress);
      },
      reset: () => {
        this.playbackControlObject.progress = 0;
        this.playbackControlObject.speed = 500;
        this.trackPlayer.setSpeed(500);
        this.trackPlayer.setProgress(0);
      },
      status: "PlayBack",
    };
  }

  handlePlaybackControls(control:string,event?:any) {    
    if(control === 'play') {
      this.playbackControlObject.start();
    } else if(control === 'pause') {
      this.playbackControlObject.pause();
    } else if(control === 'updatespeed') {
      this.playbackControlObject.updateSpeed(event?.value)
      // this.playbackControlObject.speed = event.value;
      // this.trackPlayer.setSpeed(event.value);
    } else if(control === 'updateprogress') {
      // this.playbackControlObject.progress = event.value / 100
      // this.trackPlayer.setProgress(event.value / 100);
      this.playbackControlObject.updateProgress(event?.value / 100)
    } else if(control === 'close') {
      this.playbackControlObject.remove()
    } else if(control === 'reset') {
      this.playbackControlObject.reset();
    }
  }


  public initializetrackListeners(trackPathData: any[]) {
    this.trackPlayer.on("start", () => {
      this.playbackControlObject.status = 'Started'
    });
    this.trackPlayer.on("pause", () => {
      this.playbackControlObject.status = 'Paused'
    });
    this.trackPlayer.on("finished", () => {
      this.playbackControlObject.status = 'Finished'
      
    });
    this.trackPlayer.on("progress", (progress:any, { lng, lat }:any,index:any) => {      
      this.vehicleHistoryInfo = {
        speed: trackPathData[index]?.speed || 0,
        fixtime: trackPathData[index]?.fixtime ? new Date(trackPathData[index].fixtime).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
      }
      this.playbackControlObject.status = 'Moving';
      this.playbackControlObject.progress = progress * 100;      
    });
  }
}
