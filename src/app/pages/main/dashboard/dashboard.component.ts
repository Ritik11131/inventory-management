import { oemInfoTableColumns, rfcInfoTableColumns } from './../../../shared/constants/columns';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { latLng, Map, tileLayer } from "leaflet";
import { ChartModule } from 'primeng/chart';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { chartOptions, complaintStatsObject, inventoryObject, lastPosStatusColors, renewalStatusObject, SOSALertOverSpeed, totalRegistrationObject, vehicleInstallationTypesObject, vehicleStatusOverviewObject } from '../../../shared/constants/dashboard';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgApexchartsModule } from 'ng-apexcharts';
import { KnobModule } from 'primeng/knob';
import { TicketsService } from '../../../core/services/tickets.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { concatMap, interval, Subscription } from 'rxjs';
import { GenericOverlayComponent } from '../../../shared/components/generic-overlay/generic-overlay.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { GenericDialogComponent } from "../../../shared/components/generic-dialog/generic-dialog.component";
import { alertInfotableColumns, inventoryInfoTableColumns, lastUpdateInfoColumns, overspeedInfotableColumns, renewalInfoTableColumns, sosInfotableColumns, vehicleTypeInstallationInfotableColumns } from '../../../shared/constants/columns';

import {
  CompactType,
  DisplayGrid,
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
  PushDirections,
  Resizable
} from 'angular-gridster2';

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule, ChartModule, LeafletModule, ProgressBarModule, PanelModule, FormsModule, OverlayPanelModule, LottieComponent,
    CommonModule, ScrollPanelModule, NgApexchartsModule, KnobModule, LeafletMarkerClusterModule, GenericOverlayComponent, GenericDialogComponent,GridsterComponent,
    GridsterItemComponent],
    
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {


  options: AnimationOptions = {
    path: '/assets/lottie/over-speed.json',
  };

  gridsteroptions!: Safe
;
  dashboard!: Array<GridsterItem>
  
  map!: Map;
  style = 'normal.day';
  private lastPositionMarkersLayer: L.LayerGroup = L.layerGroup();
  lastPositionData!:any;
  lastPosStatusColors = lastPosStatusColors;
  private markerClusterGroup!: L.MarkerClusterGroup;
  selectedOverlayObj!:any;

  markerClusterOptions = {
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true
  };

  leafletOptions = {
    layers: [
      tileLayer(`https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${this.style}/{z}/{x}/{y}/512/png8?apiKey=${environment.here.apiKey}&ppi=320`, {
        attribution: '&copy; HERE 2019'
      }),
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; Open Street Hot',
          maxZoom: 18,
      }),
      tileLayer(`https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/maptile?&dataset=Current&region:NA&SRS=EPSG:900913&authtoken=${environment.trimble.apiKey}&X={x}&Y={y}&Z={z}`,{
        attribution: '&copy; Trimble PCMiler Maps',
        subdomains: ['a', 'b', 'c', 'd'], // Leaflet supports subdomains for tile servers
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0
      }),
      tileLayer(`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${environment.tomtom.apiKey}`, 
        {attribution:'&copy; TOMTOM Maps', maxZoom: 18,}
     )
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
  SOSALertOverSpeed = SOSALertOverSpeed;
  totalComplaints:number = 0;
  totalvehicleInstallation : number = 0;
  maxKnobvalue:number = 0
  public chartOptions: any = chartOptions;
  private pollingSubscription!: Subscription | null; 


  infoDialog:boolean = false;
  currentInfoData : any[] = [];
  currentInfoTitle : string = '';
  currentInfoColumns:any[] = [];

  constructor(private dashboardService: DashboardService, private ticketService:TicketsService, private authService:AuthService) {}
    

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
      this.markerClusterGroup = L.markerClusterGroup();
      this.map.on('baselayerchange', this.handleBaseLayerChange.bind(this));
      this.addLayerControl();   
    }, 100);
  }

  private handleBaseLayerChange(e: any) {
    // this.clearMarkers();
    // this.plotVehicles(this.lastPositionData);
  }

  // Function to clear all markers
  private clearMarkers(): void {
    if (this.lastPositionMarkersLayer) {
      this.lastPositionMarkersLayer.clearLayers();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item:any): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }


  ngOnInit(): void {
    this.initializeDashboard();
    this.startPolling();



    // this.gridsteroptions = {
    //   gridType: GridType.Fit, // Automatically adjusts grid size to fit the container
    //   compactType: CompactType.None, // No compacting; items remain where placed
    //   margin: 7, // Margin between grid items
    //   outerMargin: true,
    //   outerMarginTop: null,
    //   outerMarginRight: null,
    //   outerMarginBottom: null,
    //   outerMarginLeft: null,
    //   useTransformPositioning: true,
    //   mobileBreakpoint: 640, // Define mobile behavior breakpoint
    //   useBodyForBreakpoint: false,
    //   minCols: 4, // Minimum number of columns
    //   maxCols: 4, // Maximum number of columns
    //   minRows: 6, // Minimum number of rows
    //   maxRows: 6, // Maximum number of rows
    //   maxItemCols: 4, // Maximum columns an item can span
    //   minItemCols: 1, // Minimum columns an item can span
    //   maxItemRows: 6, // Maximum rows an item can span
    //   minItemRows: 1, // Minimum rows an item can span
    //   maxItemArea: 24, // Maximum area (cols * rows)
    //   minItemArea: 1, // Minimum area (cols * rows)
    //   defaultItemCols: 1, // Default item column span
    //   defaultItemRows: 1, // Default item row span
    //   fixedColWidth: 105, // Width of each column (fixed size)
    //   fixedRowHeight: 55, // Height of each row (fixed size)
    //   keepFixedHeightInMobile: true, // Maintain fixed height on mobile
    //   keepFixedWidthInMobile: true, // Maintain fixed width on mobile
    //   scrollSensitivity: 10,
    //   scrollSpeed: 20,
    //   enableEmptyCellClick: false,
    //   enableEmptyCellContextMenu: false,
    //   enableEmptyCellDrop: false,
    //   enableEmptyCellDrag: false,
    //   enableOccupiedCellDrop: false,
    //   emptyCellDragMaxCols: 4,
    //   emptyCellDragMaxRows: 6,
    //   ignoreMarginInRow: true,
    //   draggable: {
    //     enabled: true, // Enable drag functionality
    //   },
    //   resizable: {
    //     enabled: true, // Enable resize functionality
    //   },
    //   swap: false,
    //   pushItems: true,
    //   disablePushOnDrag: false,
    //   disablePushOnResize: false,
    //   pushDirections: { north: true, east: true, south: true, west: true },
    //   pushResizeItems: false,
    //   displayGrid: DisplayGrid.OnDragAndResize, // Show grid only during drag/resize
    //   disableWindowResize: false,
    //   disableWarnings: false,
    //   scrollToNewItems: false,
    // };


    this.gridsteroptions = {
      pushDirections: { north: true, east: true, south: true, west: true },
      gridType: GridType.Fit, // Adjusts grid to fit the container
      compactType: CompactType.None, // No compacting of items
      margin: 10, // Space between grid items
      outerMargin: true, // Include margin outside the grid
      useTransformPositioning: true, // Enable transform-based positioning
      mobileBreakpoint: 640, // Grid adjusts below this width
      minCols: 1, // Fixed minimum columns for 12x12 grid
      maxCols: 100, // Fixed maximum columns
      minRows: 1, // Fixed minimum rows
      maxRows: 100, // Fixed maximum rows
      defaultItemCols: 1, // Default column span for new items
      defaultItemRows: 1, // Default row span for new items
      maxItemCols: 100, // Maximum columns an item can span
      maxItemRows: 100, // Maximum rows an item can span
      minItemCols: 1, // Minimum columns an item can span
      minItemRows: 1, // Minimum rows an item can span
      fixedColWidth: 60, // Width of each grid column (adjust as needed)
      fixedRowHeight: 60, // Height of each grid row (adjust as needed)
      resizable: {
        enabled: true, // Enable resizing
        start: (item, gridsterItem, event) => {
          console.log('Resize start:', item, gridsterItem, event);
        },
        stop: (item, gridsterItem, event) => {
          console.log('Resize stop:', item, gridsterItem, event);
        },
      },
      draggable: {
        enabled: true, // Enable dragging
        start: (item, gridsterItem, event) => {
          console.log('Drag start:', item, gridsterItem, event);
        },
        stop: (item, gridsterItem, event) => {
          console.log('Drag stop:', item, gridsterItem, event);
        },
      },
      swap:false,
      pushItems: true, // Enable pushing items
      displayGrid: DisplayGrid.OnDragAndResize, // Show grid during drag and resize
    };
    this.dashboard = [
      // Vehicle Status Cards
      { cols: 3, rows: 2, y: 0, x: 0, lastPosition: true, label: 'Running Vehicles', count: 0, colorClass: 'green', bgColorClass: 'bg-green-100', textColorClass: 'text-green-500', key: 'RUNNING', lottiePath: '/assets/lottie/running-truck.json' },
      { cols: 3, rows: 2, y: 0, x: 3, lastPosition: true, label: 'Idle Vehicles', count: 0, colorClass: 'yellow', bgColorClass: 'bg-yellow-100', textColorClass: 'text-yellow-400', key: 'DORMANT', lottiePath: '/assets/lottie/idle-truck.json' },
      { cols: 3, rows: 2, y: 0, x: 6, lastPosition: true, label: 'Stop Vehicles', count: 0, colorClass: 'red', bgColorClass: 'bg-red-100', textColorClass: 'text-red-500', key: 'STOP', lottiePath: '/assets/lottie/stop-truck.json' },
      { cols: 3, rows: 2, y: 0, x: 9, lastPosition: true, label: 'Offline Vehicles', count: 0, colorClass: 'surface', bgColorClass: 'bg-bluegray-100', textColorClass: 'text-bluegray-700', key: 'OFFLINE', lottiePath: '/assets/lottie/offline-truck.json' },
    
      // Total Complaints
      { cols: 6, rows: 4, y: 4, x: 0, totalComplaints: true },
    
      // Alerts (SOS, Over Speed, General Alerts)
      {
        cols: 2, rows: 3, y: 4, x: 6, SOSALertOverSpeed: true, key: 'sos',
        title: 'SOS',
        image: 'assets/images/sos.png',
        fields: [],
        bgClass: 'bg-red-500',
        value: 0,
        lottiePath: '/assets/lottie/push-button.json'
      },
      {
        cols: 2, rows: 3, y: 7, x: 6, SOSALertOverSpeed: true, key: 'overspeed',
        title: 'Over Speed',
        image: 'assets/images/overspeed.png',
        fields: [],
        bgClass: 'bg-orange-500',
        value: 0,
        lottiePath: '/assets/lottie/over-speed.json'
      },
      {
        cols: 2, rows: 6, y: 4, x: 8, SOSALertOverSpeed: true, key: 'alert',
        title: 'Alert',
        image: 'assets/images/alert.png',
        fields: [
          { key: 'ignitionOn', label: 'Ignition On', colSpan: '4', textAlign: 'left' },
          { key: 'ignitionOff', label: 'Ignition Off', colSpan: '4', textAlign: 'center' },
          { key: 'tampering', label: 'Tampering', colSpan: '4', textAlign: 'right' },
          { key: 'powerCut', label: 'Power Cut', colSpan: '4', textAlign: 'left' },
          { key: 'powerRestored', label: 'Power Resume', colSpan: '4', textAlign: 'center' },
          { key: 'lowBattery', label: 'Power Low Battery', colSpan: '4', textAlign: 'right' },
          { key: 'hardAcceleration', label: 'Harsh Acceleration', colSpan: '4', textAlign: 'left' },
          { key: 'hardBraking', label: 'Harsh Braking', colSpan: '4', textAlign: 'center' },
          { key: 'hardCornering', label: 'Harsh Turning', colSpan: '4', textAlign: 'right' },
          { key: 'geofenceEnter', label: 'Geofence In', colSpan: '4', textAlign: 'left' },
          { key: 'geofenceExit', label: 'Geofence Out', colSpan: '4', textAlign: 'center' }
        ],
        response: {},
        bgClass: 'bg-yellow-500',
        value: 0,
        lottiePath: '/assets/lottie/alert.json'
      },
    
      // Vehicle Installation and Map
      { cols: 5, rows: 7, y: 10, x: 0, vehicleInstallation: true },
      { cols: 7, rows: 7, y: 10, x: 5, dashboardMap: true, dragEnabled: false },
    ];
    


   
  }

  startPolling() {
    this.pollingSubscription = interval(60000)
      .pipe(concatMap(() => {
        this.resetDashboardData(); // Reset data before initializing the dashboard
        return this.initializeDashboard(); // Return the observable from initializeDashboard
      }))
      .subscribe({
        next: () => {
          // Handle successful polling if needed
        },
        error: (error) => {
          console.error("Error during polling:", error);
        }
      });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }


  async initializeDashboard() {
    try {
      // Run all promises in parallel to reduce waiting time
      await Promise.all([
        this.fetchLastPositionStats(),
        this.fetchUserCountAndDeviceStock(),
        this.fetchVehicleTypesAndCount(),
        this.fetchTicketsGroupByStatus(),
        this.fetchInventoryStockActivationCount(),
        this.fetchSOSAlertCount(),
        this.fetchRenewalDueCounts()
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


  async fetchInventoryStockActivationCount() : Promise<any> {
    try {
      const response = await this.dashboardService.getInventoryStockActivationCount()
      this.inventory[0].value = response?.data?.inStock +  response?.data?.inActivation;
      this.inventory[1].value = response?.data?.inActivation; 
    } catch (error) {
      console.log(error);
    }
  }

  async fetchVehicleTypesAndCount() : Promise<any> {
    try {
      const response = await this.dashboardService.getvehicleTypesAndCount();
      response?.data?.forEach((obj : any) => {
        obj.key = 'vehicle_installation'
        this.totalvehicleInstallation += obj?.deviceCount;
        this.maxKnobvalue += obj?.totalCount
      });      
      this.vehicleInstallationTypes = response?.data;
      
    } catch (error) {
      
    }
  }

  async fetchUserCountAndDeviceStock(): Promise<any> {
    try {
      const response = await this.dashboardService.getUserCountAndDeviceStock();
      this.totalRegistration[0].value = response.data.userCountTask.OEM;
      this.totalRegistration[1].value = response.data.userCountTask.Dealer;
      
    } catch (error) {

    }
  }

  async fetchLastPositionStats() : Promise<any> {
    try {
      const response = await this.dashboardService.getLastPositionStats();
      this.lastPositionData = response?.data
      this.updateVehicleStatusCounts(this.lastPositionData);
      this.plotVehicles(this.lastPositionData)
    } catch (error) {
      
    }
  }

  async fetchRenewalDueCounts() :Promise<any> {
    try {
      const response = await this.dashboardService.getRenewalDueCounts();
      console.log(response,'ress');
      this.renewalStatus[0].value = response?.data?.Due?.length;
      this.renewalStatus[1].value =  response?.data?.Laps?.length;
      
    } catch (error) {
      
    }
  }


  async fetchSOSAlertCount() : Promise<any> {
    try {
      const response = await this.dashboardService.getSOSAletCounts();
      this.updatePanelValues(response?.data);
      console.log(response,'responseeee');
      
    } catch (error) {
      
    }
  }

  private updateVehicleStatusCounts(response: any) {
    this.vehicleStatusOverview.forEach(item => {
      item.count = response[item.key]?.length || 0;
    });
  }

  private updatePanelValues(data: any): void {
    // Update SOS and OverSpeed directly
    this.SOSALertOverSpeed[0].value = data.SOS;
    this.SOSALertOverSpeed[1].value = data.OverSpeed;

    const alertTotal = (Object.values(data.Other) as number[]).reduce(
      (sum, count) => sum + count,
      0
    );

    this.SOSALertOverSpeed[2].value = alertTotal;
    this.SOSALertOverSpeed[2].response = data.Other
  }

  private addLayerControl(): void {
    L.control.layers(
      {
        'Trimble': this.leafletOptions.layers[2],
        'HERE Map (Day)': this.leafletOptions.layers[0],
        'OpenStreet Map (Hot)': this.leafletOptions.layers[1],
        'Tom Tom Map':this.leafletOptions.layers[3]
      },
    ).addTo(this.map);

    this.addMarkerFilterControl();

  }

  private plotVehicles(vehicleData: any, filterStatus?: string): void {
    const markers: L.CircleMarker[] = []; // Array to hold markers for fitBounds
     // Remove existing markers from the map
     this.map.removeLayer(this.markerClusterGroup);

     // Clear the marker cluster group
     this.markerClusterGroup.clearLayers();

    // Iterate through vehicle statuses
    for (const status in vehicleData) {
        // If a filter is provided, only plot vehicles of that status
        if (filterStatus && filterStatus !== status) {
            continue; // Skip this status if it doesn't match the filter
        }

        vehicleData[status].forEach((vehicle: any) => {
            if (vehicle?.latitude && vehicle?.longitude) {
                const marker: L.CircleMarker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
                    color: this.lastPosStatusColors[status],
                    radius: 5
                });
                marker.bindTooltip(`Vehicle No: ${vehicle.vehicleNo}`, { direction: 'top' });
                markers.push(marker); // Add marker to the array
                this.markerClusterGroup.addLayer(marker);
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


  resetDashboardData() {
    // Reset all relevant properties to their initial state
    this.totalComplaints = 0;
    this.complaintStats = complaintStatsObject;
    this.inventory = inventoryObject;
    this.totalvehicleInstallation = 0;
    this.vehicleInstallationTypes = [];
    this.totalRegistration = totalRegistrationObject;
    this.lastPositionData = null;
    this.vehicleStatusOverview.forEach(item => { item.count = 0; });
    // this.markerClusterGroup.clearLayers(); // Clear existing markers if using Leaflet
  }

  onClick(event  :any) {
    console.log(event);
    
  }

  async onInfoClick(event: MouseEvent, panel: any, op?: { toggle: (e: MouseEvent) => void }): Promise<void> {    
    if (event.type === 'click') {
      console.log(panel);
      this.currentInfoTitle = panel?.title || panel?.label || panel?.categoryName || panel?.key || panel?.toUpperCase();
      this.infoDialog = true;
      this.currentInfoColumns = panel.key === 'alert' ? alertInfotableColumns : 
                                (panel.key === 'vehicle_installation') ? vehicleTypeInstallationInfotableColumns : 
                                (panel.key === 'RUNNING' || panel.key === 'STOP' || panel.key === 'DORMANT' || panel.key === 'OFFLINE') ? lastUpdateInfoColumns : 
                                (panel.key === 'overspeed') ? overspeedInfotableColumns : 
                                (panel === 'inventory') ? inventoryInfoTableColumns : 
                                (panel === 'renewal') ? renewalInfoTableColumns : 
                                (panel.key === 'OEM') ? oemInfoTableColumns : 
                                (panel.key === 'RFC') ? rfcInfoTableColumns : sosInfotableColumns;

  
      const keyToEndpointMap: Record<string, string> = {
        sos: 'Alert/details/SOS',
        overspeed: 'Alert/details/OverSpeed',
        alert: 'Alert/others',
        RUNNING: 'LastPosition/Filter/RUNNING',
        STOP: 'LastPosition/Filter/STOP',
        DORMANT: 'LastPosition/Filter/DORMANT',
        OFFLINE: 'LastPosition/Filter/OFFLINE',
        vehicle_installation:`Dashboard/GetDetailsVehicleType/${panel.categoryId}`,
        inventory: 'Dashboard/StockVsActivationDetails',
        renewal : 'Dashboard/RenewalDetails',
        OEM:'Dashboard/GetOemList',
        RFC:'Dashboard/GetRfcList'
      };

      const endpoint = keyToEndpointMap[(panel === 'inventory' || panel === 'renewal') ? panel : panel?.key];
      
      if(endpoint) { 
        try {
          // Flattened response
          const unflattenedData = (await this.fetchSelectedInfoData(endpoint))?.data;
          this.currentInfoData = (panel === 'inventory' || panel === 'renewal' || panel.key === 'OEM' || panel.key === 'RFC')
            ? unflattenedData
            : unflattenedData.map((unflattenedObject: any) => {
              const obj = this.flattenInfoTableResponse(unflattenedObject, panel);
              return obj;
            });
          
          
        } catch (error) {
          console.error('Failed to fetch data:', error);
          this.currentInfoData = [];
        }
      }
    } else {
      if (op && typeof op.toggle === 'function') {
        op.toggle(event);
        console.log(`Info clicked for ${panel.title}`);
      } else {
        console.warn('op is not defined or does not have a toggle function');
      }
    }
  }

  flattenInfoTableResponse(response: any,selectedPanel:any) {
    const result: any = {
      vehicleNo: response.vehicle?.vehicleno || '',
      oem: response.oem?.oemorgname || '',
      permitHolderName: response.permitHolder?.permitholdername || '',
      permitHolderMobile: response.permitHolder?.permitholdermobile || '',
      deviceSno: response.device?.devicesno || '',
      deviceImei: response.device?.imei || '',
      lastUpdateOn: response.position?.lastUpdateOn || '',
      speed: response.position?.speed || '-',
      latLng: response.position
        ? `${response.position.latitude}, ${response.position.longitude}`
        : ''
    };
  
    if (selectedPanel.key === 'alert') {
      result.eventType = response.eventType.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w|\s\w/g, (match: any) => match.toUpperCase());
    }
  
    return result;
  }

  onHideDialog(isVisible: boolean) {
    this.infoDialog = isVisible;
    this.currentInfoColumns = [];
    this.currentInfoData = [];
  }


  async fetchSelectedInfoData(endpoint:string) : Promise<any> {
    try {
      const response = await this.dashboardService.getInfoTableData(endpoint);
      return response;
    } catch (error) {
      return [];
    }
  }


  private addMarkerFilterControl(): void {
    const filterControl = new L.Control({ position: 'topright' });

    filterControl.onAdd = (map: L.Map) => {
        const div = L.DomUtil.create('div', 'filter-control');

        // Use PrimeIcons for the filter control
        div.innerHTML = `
            <i class="pi pi-car" id="show-running" style="color: green; cursor: pointer; font-size:22px; margin-bottom:8px;margin-right:10px" title="Show Running"></i><br>
            <i class="pi pi-car" id="show-stop" style="color: red; cursor: pointer; font-size:22px; margin-bottom:8px;margin-right:10px" title="Show Stop"></i><br>
             <i class="pi pi-car" id="show-idle" style="color: orange; cursor: pointer; font-size:22px; margin-bottom:8px;margin-right:10px" title="Show Idle"></i><br>
            <i class="pi pi-car" id="show-offline" style="color: gray; cursor: pointer; font-size:22px; margin-bottom:8px;margin-right:10px" title="Show Offline"></i><br>
            <i class="pi pi-car" id="show-all" style="color: blue;cursor: pointer; font-size:22px;margin-right:10px" title="Show All"></i>
        `;
        return div;
    };

    filterControl.addTo(this.map);

    // Event listeners for the filter icons
    document.getElementById('show-running')?.addEventListener('click', () => {
      this.plotVehicles(this.lastPositionData, 'RUNNING'); // Plot only running vehicles
    });

    document.getElementById('show-stop')?.addEventListener('click', () => {
      this.plotVehicles(this.lastPositionData, 'STOP'); // Plot only stopped vehicles
    });

    document.getElementById('show-all')?.addEventListener('click', () => {
      this.plotVehicles(this.lastPositionData); // Plot all vehicles
    });

    document.getElementById('show-idle')?.addEventListener('click', () => {
      this.plotVehicles(this.lastPositionData, 'DORMANT'); // Plot only idle vehicles
    });

    document.getElementById('show-offline')?.addEventListener('click', () => {
      this.plotVehicles(this.lastPositionData, 'OFFLINE'); // Plot only offline vehicles
    });
  }


  ngOnDestroy(): void {
      this.stopPolling()
  }

}
