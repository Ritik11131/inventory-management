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
import * as turf from '@turf/turf';
import { VehicleStatsComponent } from './vehicle-stats/vehicle-stats.component';
import { latLng, Map, tileLayer } from "leaflet";
import 'leaflet.markercluster';
import { DashboardService } from '../../../core/services/dashboard.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GenericDatepickerComponent } from "../../../shared/components/generic-datepicker/generic-datepicker.component";
import { TrackingService } from '../../../core/services/tracking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AddressService } from '../../../core/services/address.service';
import { catchError, interval, of, Subscription } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { RouteService } from '../../../core/services/route.service';
import { DropdownModule } from 'primeng/dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [VehicleFiltersComponent, VehicleListComponent, VehicleStatsComponent, LeafletModule, LeafletMarkerClusterModule, TagModule,DropdownModule,DragDropModule,
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

    // Polling related properties
  private pollingSubscription: Subscription | null = null;
  pollingConfig: any | null = null;
  isPolling: boolean = false;
  pollingErrorCount: number = 0;
  
  // Polling configuration constants
  private readonly DEFAULT_POLLING_INTERVAL = 5000; // 5 seconds
  private readonly MAX_POLLING_ERROR_COUNT = 3;
  

  playbackControlObject: any = {};
  vehicleHistoryInfo: any = {
    speed: 0,
    fixtime: '00:00:00',
  }

  leafletOptions = {
    layers: [
       tileLayer(`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=lite.day&apiKey=bhm0avrp9LuWfcoxd6E8Uzv1oZn3i2Mfcrsv77Bnw7Y`, {
              attribution: '&copy; HERE 2019'
            }),
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
  };

  routesOptions:any[] = []
  selectedRoute:any;
  routeLayer: L.GeoJSON | null = null;
  isLoadingRoute = false;
  geofenceLayer:any;
  disturbedZoom:any = null;
  disturbedBoundingBox: any=null
  userRole: string = '';

  constructor(private dashboardService: DashboardService, private trackingService: TrackingService,private toastService:ToastService,private addressService:AddressService, private routeService:RouteService, private authService:AuthService) {
    this.userRole = this.authService.getUserRole();    
   }

  ngOnInit() {
    this.fetchLastPositionStats().then();
  }


  onMapReady(map: Map) {
    this.map = map;
    this.markerClusterGroup = L.markerClusterGroup();
    L.control.scale().addTo(this.map);
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



  // async handleFilterClick(event: any): Promise<void> {
  //   this.resetPlaybackState();
  
  //   if (this.isSingleVehicleEvent(event)) {
  //     console.log(event,'event');
      
  //     await this.handleSingleVehicleEvent(event);
  //   } else {
  //     this.handleMultipleVehicles(event);
  //   }
  // }
  
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
  
  // async handleSingleVehicleEvent(event: any): Promise<void> {
  //   this.plotVehicles(event);
  //   try {
  //     const response = await this.trackingService.getInfoWindowDetails(event?.deviceSno);
  //     const address = await this.fetchSelectedVehicleAddress(response?.data);
  //     this.selectedVehicle = {
  //       vehicleNo: event?.vehicleNo,
  //       status: event?.status,
  //       address: address?.address || 'Unknown',
  //       ...response?.data,
  //     };
  //   } catch (error) {
  //     this.toastService.showError('Error', 'Failed to fetch vehicle details!');
  //     this.selectedVehicle = {};
  //   }
  // }
  
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

  handleSearch(event: any) {
    const searchTerm = event?.target?.value?.trim()?.toLowerCase();    
  
    // If there's no search term, reset filtered list to the original list
    if (!searchTerm) {
      this.filteredVehiclesList = [...this.vehicleList];  // Make sure we reset to a copy of the original list
      return;
    }
  
    // Apply filter based on the search term    
    this.filteredVehiclesList = this.vehicleList.filter((vehicle) => {
      return vehicle.vahanSno.toLowerCase().includes(searchTerm) || vehicle.vehicleNo.toLowerCase().includes(searchTerm) || vehicle.imei.includes(searchTerm);
    });
  
  }
  
  


  handlePlayback() {
    this.stopPolling();
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

   ngOnDestroy() {
    this.stopPolling();
  }

  // Comprehensive polling method
  startPolling(deviceSno: string, vehicleNo: string) {
    // Stop any existing polling
    this.stopPolling();

    // Set up polling configuration
    this.pollingConfig = {
      deviceSno,
      vehicleNo,
      pollingInterval: this.DEFAULT_POLLING_INTERVAL,
      maxErrorCount: this.MAX_POLLING_ERROR_COUNT
    };

    // Start new polling
    this.isPolling = true;
    this.pollingErrorCount = 0;

    this.pollingSubscription = interval(this.pollingConfig.pollingInterval)
      .pipe(
        catchError(error => {
          console.error('Polling error:', error);
          return of(null);
        })
      )
      .subscribe(async () => {
        try {
          // Fetch updated vehicle details
          const response = await this.trackingService.getInfoWindowDetails(deviceSno);
          
          if (response?.data) {
            // Update vehicle details and address
            const address = await this.fetchSelectedVehicleAddress(response.data);
            
            // Update selected vehicle with new information
            this.updateSelectedVehicle(response.data, address);
            
            // Update map marker
            this.updateVehicleMarker(response.data);
            
            // Reset error count
            this.pollingErrorCount = 0;
          }
        } catch (error) {
          this.pollingErrorCount++;
          
          // Log the error
          console.error(`Polling error (${this.pollingErrorCount}):`, error);
          
          // Stop polling if max error count is reached
          if (this.pollingErrorCount >= this.pollingConfig.maxErrorCount) {
            this.stopPolling();
            this.toastService.showError(
              'Polling Error', 
              `Unable to fetch updates for vehicle ${this.pollingConfig?.vehicleNo}`
            );
          }
        }
      });
  }

  // Stop polling method with optional message
  stopPolling(showMessage: boolean = true) {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
    
    // Reset polling state
    const vehicleNo = this.pollingConfig?.vehicleNo;
    this.isPolling = false;
    this.pollingConfig = null;
    this.pollingErrorCount = 0;

    // Show stop message if requested
    if (showMessage && vehicleNo) {
      this.toastService.showInfo(
        'Tracking Stopped', 
        `Live tracking for vehicle ${vehicleNo} has been stopped.`
      );
    }
  }

  // Toggle polling method
  togglePolling() {
    if (this.isPolling) {
      this.stopPolling();
    } else if (this.selectedVehicle?.device?.sno) {
      this.startPolling(
        this.selectedVehicle.device.sno, 
        this.selectedVehicle.vehicleNo
      );
    }
  }

  // Update selected vehicle details
  updateSelectedVehicle(vehicleData: any, address?: any) {
    this.selectedVehicle = {
      ...this.selectedVehicle,
      ...vehicleData,
      
      address: address?.address || this.selectedVehicle?.address || 'Unknown',
      location: {
        ...vehicleData.location,
        lastUpdate: new Date().toISOString()
      }
    };    
  }

  // Update vehicle marker on map
  updateVehicleMarker(vehicleData: any) {    
    // Remove existing markers from the map
    this.map.removeLayer(this.markerClusterGroup);
    this.markerClusterGroup.clearLayers();

    // Create new marker
    if (vehicleData?.location?.latitude && vehicleData?.location?.longitude) {
      const marker: L.CircleMarker = L.circleMarker(
        [vehicleData.location?.latitude, vehicleData.location?.longitude], 
        {
          color: lastPosStatusColors[this.selectedVehicle.status] || 'blue',
          radius: 5,
          fillOpacity: 0.7
        }
      );

      marker.bindTooltip(
        `Vehicle No: ${this.selectedVehicle.vehicleNo}<br>Status: ${this.selectedVehicle.status}`,
        { direction: 'top' }
      );

      this.markerClusterGroup.addLayer(marker);
      this.map.addLayer(this.markerClusterGroup);
      
      if (!this.selectedRoute) {
  const lat = vehicleData.location?.latitude;
  const lng = vehicleData.location?.longitude;

  if (lat != null && lng != null) {
    this.map.setView([lat, lng], this.map.getZoom());
  }
} else if (this.routeLayer) {
  const routeBounds = this.routeLayer.getBounds();
  const lat = vehicleData.location?.latitude;
  const lng = vehicleData.location?.longitude;

  if (routeBounds.isValid() && lat != null && lng != null) {
    const combinedBounds = routeBounds.extend([lat, lng]);
    this.map.fitBounds(combinedBounds, { padding: [20, 20] });
  } else {
    // Fallback: fit only route if vehicle location is missing
    this.map.fitBounds(routeBounds, { padding: [20, 20] });
  }
}


    }
  }

  // Existing method for handling filter click
  async handleFilterClick(event: any): Promise<void> {
    console.log(event,'event');

    this.map.on('zoomend', () => {
    console.log('Zoom changed:', this.map.getZoom());
    this.disturbedZoom = this.map.getZoom();
  });

  this.map.on('moveend', () => {
    const bounds = this.map.getBounds();
    console.log('New bounds:', bounds);
    this.disturbedBoundingBox = this.map.getBounds();
  });
    
    // Stop any existing polling
    this.stopPolling(false);

    this.resetPlaybackState();
  
    if (this.isSingleVehicleEvent(event)) {
      await this.handleSingleVehicleEvent(event);
      if(this.userRole !== 'User') {
        await this.fetchRoutes()
      }
    } else {
      this.handleMultipleVehicles(event);
    }
  }
  
  // Method to handle single vehicle selection
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

      // Start polling for this vehicle
      this.startPolling(event?.deviceSno, event?.vehicleNo);
    } catch (error) {
      this.toastService.showError('Error', 'Failed to fetch vehicle details!');
      this.selectedVehicle = {};
    }
  }


    async fetchRoutes(): Promise<any> {
    try {
      const response = await this.routeService.getList();
      this.routesOptions = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error : any) {
      this.routesOptions = [];
      this.toastService.showError('Error', error?.error?.data);
    } finally {
    }
  }


  reCenterToVehicle() {
    if (!this.selectedRoute) {
          const lat = this.selectedVehicle.location?.latitude;
          const lng = this.selectedVehicle.location?.longitude;

          if (lat != null && lng != null) {
            this.map.setView([lat, lng], this.map.getZoom());
          }
        } else if (this.routeLayer) {
          const routeBounds = this.routeLayer.getBounds();
          const lat = this.selectedVehicle.location?.latitude;
          const lng = this.selectedVehicle.location?.longitude;

          if (routeBounds.isValid() && lat != null && lng != null) {
            const combinedBounds = routeBounds.extend([lat, lng]);
            this.map.fitBounds(combinedBounds, { padding: [20, 20] });
          } else {
            // Fallback: fit only route if vehicle location is missing
            this.map.fitBounds(routeBounds, { padding: [20, 20] });
          }
        }
  }

async handleRouteSelection(e: any): Promise<void> {
  if (!e?.value) {
     // Route cleared – remove layers and focus on vehicle
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }

    if (this.geofenceLayer) {
      this.map.removeLayer(this.geofenceLayer);
      this.geofenceLayer = null;
    }

    // Focus back to vehicle location
    if (this.selectedVehicle?.location?.latitude && this.selectedVehicle?.location?.longitude) {
      this.map.setView(
        [this.selectedVehicle.location.latitude, this.selectedVehicle.location.longitude],
        this.map.getZoom()
      );
    }

    return;
  };
  
  this.isLoadingRoute = true;
  
  try {
    const response = await this.routeService.getRouteById(e.value);
    const { geometry, name } = response?.data;
    const parsedGeometry = JSON.parse(geometry);
    
    if (!parsedGeometry) {
      console.warn('No geometry found for the selected route.');
      return;
    }
    
    // Remove existing route and geofence layers if present
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
    
    if (this.geofenceLayer) {
      this.map.removeLayer(this.geofenceLayer);
      this.geofenceLayer = null;
    }
    
    const customIcon = L.icon({
      iconUrl: 'assets/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'assets/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
    
    // Add the original route
    this.routeLayer = L.geoJSON(parsedGeometry, {
      style: {
        color: '#007bff',
        weight: 4,
        opacity: 0.9
      },
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: customIcon });
      }
    }).addTo(this.map);
    
      // Create a polygon geofence with 50 meter buffer around the route
    this.createRouteGeofencePolygon(parsedGeometry, 50);
    
    // Fit the map bounds to include both the route and its buffer
    const combinedBounds = this.routeLayer.getBounds();
    if (this.geofenceLayer) {
      const geofenceBounds = this.geofenceLayer.getBounds();
      if (geofenceBounds.isValid()) {
        combinedBounds.extend(geofenceBounds);
      }
    }
    
    if (combinedBounds.isValid()) {
      this.map.fitBounds(combinedBounds, { padding: [20, 20] });
    }
  } catch (error) {
    console.error('Failed to load route:', error);
  } finally {
    this.isLoadingRoute = false;
  }
}

/**
 * Creates a polygon geofence with specified buffer distance around the route
 * @param geometry The GeoJSON geometry of the route
 * @param bufferDistance Buffer distance in meters
 */
private createRouteGeofencePolygon(geometry: any, bufferDistance: number): void {
  try {
    // Convert the route geometry to a proper GeoJSON feature if needed
    let routeFeature;
    
    if (geometry.type === 'FeatureCollection') {
      // If it's a FeatureCollection, we'll merge all features
      routeFeature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'GeometryCollection',
          geometries: geometry.features.map((feature: any) => feature.geometry)
        }
      };
    } else if (geometry.type === 'Feature') {
      routeFeature = geometry;
    } else {
      // If it's just a geometry object, wrap it in a Feature
      routeFeature = {
        type: 'Feature',
        properties: {},
        geometry: geometry
      };
    }
    
    // Create a buffer around the route (buffer distance in kilometers)
    const buffered: any = turf.buffer(routeFeature, bufferDistance / 1000, { units: 'kilometers' });
    
    if (!buffered) {
      console.warn('Failed to create buffer around route');
      return;
    }
    
    // Sometimes the buffer results in a Feature, sometimes in a FeatureCollection
    // We need to standardize to make sure we have a FeatureCollection
    let geofencePolygon;
    if (buffered.type === 'FeatureCollection') {
      geofencePolygon = buffered;
    } else {
      geofencePolygon = {
        type: 'FeatureCollection',
        features: [buffered]
      };
    }
    
    // Create and add the geofence polygon layer to the map
    this.geofenceLayer = L.geoJSON(geofencePolygon, {
      style: {
        color: '#ff7800',        // Orange border
        weight: 2,               // Border width
        opacity: 0.8,            // Border opacity
        fillColor: '#ff7800',    // Fill color (same as border)
        fillOpacity: 0.2         // Fill opacity (transparent)
      }
    }).addTo(this.map);
    
    // You can add popup information if needed
    this.geofenceLayer.bindPopup('Route geofence - 50m buffer');
    
  } catch (error) {
    console.error('Failed to create route geofence polygon:', error);
  }
}
}
