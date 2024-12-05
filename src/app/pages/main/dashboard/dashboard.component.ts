import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { icon, latLng, Map, Marker, marker, tileLayer } from "leaflet";
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
import { concatMap, interval, Subscription, switchMap } from 'rxjs';
import { GenericOverlayComponent } from '../../../shared/components/generic-overlay/generic-overlay.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule, ChartModule, LeafletModule, ProgressBarModule, PanelModule, FormsModule, OverlayPanelModule, LottieComponent,
            CommonModule,ScrollPanelModule,NgApexchartsModule,KnobModule,LeafletMarkerClusterModule,GenericOverlayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  options: AnimationOptions = {
    path: '/assets/lottie/over-speed.json',
  };
  
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
      tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; Open Street Hot',
          maxZoom: 18,
      }),
      tileLayer(`https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/maptile?&dataset=Current&region:NA&SRS=EPSG:900913&authtoken=${environment.trimble.apiKey}&X={x}&Y={y}&Z={z}`,{
        attribution: '&copy; Trimble PCMiler Maps',
        subdomains: ['a', 'b', 'c', 'd'], // Leaflet supports subdomains for tile servers
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0
      })
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

  constructor(private dashboardService: DashboardService, private ticketService:TicketsService, private authService:AuthService) {}
    

  onMapReady(map: Map) {
    this.map = map;
    this.markerClusterGroup = L.markerClusterGroup();
    this.map.on('baselayerchange', this.handleBaseLayerChange.bind(this));
    this.addLayerControl();   
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

  ngOnInit(): void {
    this.initializeDashboard();
    this.startPolling();
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

  onInfoClick(event: MouseEvent,panel: any,op:any) {
    op.toggle(event);
    console.log(`Info clicked for ${panel.title}`);
    // Add additional logic if needed
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

}
