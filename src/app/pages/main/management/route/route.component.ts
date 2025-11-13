import 'leaflet-routing-machine';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import * as turf from '@turf/turf';
import { routeColumns } from '../../../../shared/constants/columns';
import { GenericDrawerComponent } from "../../../../shared/components/generic-drawer/generic-drawer.component";
import { ButtonModule } from 'primeng/button';
import { RouteService } from '../../../../core/services/route.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

// Interfaces
interface MarkerData {
  id: number;
  marker: L.Marker;
  lat: number;
  lng: number;
  geoJson: GeoJSONFeature;
  timestamp: Date;
}

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    id: number;
    name: string;
    timestamp: string;
    coordinates: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [GenericTableComponent, GenericDrawerComponent, ButtonModule, LeafletModule, FormsModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent implements OnInit, OnDestroy {

  columns = routeColumns;
  fields: any[] = []
  route!: any;
  routes: any = [];
  isLoading: boolean = false;
  routeDrawer: boolean = false;
  isEditing: boolean = false;
  private routeGeofenceLayer: L.Layer | null = null; 

  private map!: L.Map;
  private routingControl!: any;

   // Signals for reactive state management
  private markersSignal = signal<MarkerData[]>([]);
  private markerCounter = signal<number>(0);
   // Computed properties
  markers = computed(() => this.markersSignal());
  markerCountText = computed(() => {
    const count = this.markers().length;
    return `${count} Marker${count !== 1 ? 's' : ''}`;
  });

  options = {
    layers: [L.tileLayer(`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=lite.day&apiKey=bhm0avrp9LuWfcoxd6E8Uzv1oZn3i2Mfcrsv77Bnw7Y`, {
                  attribution: '&copy; HERE 2019'
                }),],
    zoom: 10,
    center: L.latLng(28.6139, 77.2090) // Default center (Delhi)
  };

   // New properties for start and end points
   startPoint: string = '28.6231,77.1208';
   endPoint: string = '28.6665,77.2333';
   routeName: string = '';

  constructor(private routeService : RouteService, private toastService : ToastService) {
  }

  ngOnInit(): void {
      this.fetchRoutes()
  }


  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    L.control.scale().addTo(this.map);
    // Add click event listener
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      this.addMarkerOnClick(lat, lng);
    });
    // this.initRoutingControl()
  }



  addMarkerOnClick(lat: number, lng: number): MarkerData {    
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    // Increment counter
    const newId = this.markerCounter() + 1;
    this.markerCounter.set(newId);
    
    // Create marker
    // const marker = L.marker([lat, lng]).addTo(this.map);

    // Create marker
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/images/marker-icon.png',
        shadowUrl: 'assets/images/marker-shadow.png',
      }),
      draggable: false, // Make the marker draggable
    }).addTo(this.map);
    
    // Create GeoJSON object for this marker
    const geoJsonData: GeoJSONFeature = {
      type: "Feature",
      properties: {
        id: newId,
        name: `Marker ${newId}`,
        timestamp: new Date().toISOString(),
        coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
      }
    };
    
    // Add popup to marker
    marker.bindPopup(`
      <div style="min-width: 200px;">
        <h4>Marker ${newId}</h4>
        <p><strong>Lat:</strong> ${lat.toFixed(6)}</p>
        <p><strong>Lng:</strong> ${lng.toFixed(6)}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
    `);
    
    // Create marker data object
    const markerData: MarkerData = {
      id: newId,
      marker: marker,
      lat: lat,
      lng: lng,
      geoJson: geoJsonData,
      timestamp: new Date()
    };
    
    // Update markers signal
    this.markersSignal.update(markers => [...markers, markerData]);
    
    // Push the newly created GeoJSON data to route.geometry
    if (this.route && this.route.geometry) {
      try {
        // Parse the stringified geometry
        let geometryData = typeof this.route.geometry === 'string' 
          ? JSON.parse(this.route.geometry) 
          : this.route.geometry;
        
        // Ensure geometryData has features array
        if (!geometryData.features) {
          geometryData.features = [];
        }
        
        // Push the new GeoJSON feature
        geometryData.features.push(geoJsonData);
        
        // Stringify back if original was a string
        this.route.geometry = typeof this.route.geometry === 'string' 
          ? JSON.stringify(geometryData)
          : geometryData;
        
      } catch (error) {
        console.error('Error updating route geometry:', error);
      }
    }
    return markerData;
  }

  clearAllMarkers(): void {
    if (!this.map) return;

    // Remove all markers from map
    this.markers().forEach(markerData => {
      this.map!.removeLayer(markerData.marker);
    });
    
    // Clear signals
    this.markersSignal.set([]);
    this.markerCounter.set(0);
    
  }

  exportAllMarkersAsGeoJSON(): any {
    const featureCollection: any = {
      type: "FeatureCollection",
      features: this.markers().map(markerData => markerData.geoJson)
    };
    
    
    // Optional: Download as file
    this.downloadGeoJSON(featureCollection);
    
    return featureCollection;
  }

  private downloadGeoJSON(geoJsonData: any): void {
    const dataStr = JSON.stringify(geoJsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `markers_${new Date().toISOString().split('T')[0]}.geojson`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Public methods for programmatic access
  getMarkers(): MarkerData[] {
    return this.markers();
  }

  getMarkerCount(): number {
    return this.markers().length;
  }


  async onEditState(selectedRoute: any): Promise<void> {
    this.isEditing = true;
    this.routeDrawer = true;

    try {
      const response = await this.routeService.getRouteById(selectedRoute);
      const {id , userId, geometry, name} = response?.data
      this.routeName = name
      const modifiedroute = this.reverseGeoJSONToRoute(JSON.parse(geometry));
      

      if (modifiedroute) {
        const savedCoordinates = modifiedroute.coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
        const savedWaypoints = modifiedroute.waypoints.map((coord: any) => coord.latLng);
        
  
        if (savedCoordinates.length > 0) {
          // Remove existing routing control if present
          if (this.routingControl) {
            this.map.removeControl(this.routingControl);
          }
  
  
  
          // Custom routing control using your own waypoints
          this.routingControl = (L as any).Routing.control({
            waypoints: savedWaypoints, // This will be your custom waypoints
            addWaypoints: false,
            createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
  
              // Create the marker for each waypoint
              const marker = L.marker(waypoint.latLng, {
                icon: L.icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: 'assets/images/marker-icon.png',
                  shadowUrl: 'assets/images/marker-shadow.png',
                }),
                draggable: true, // Make the marker draggable
                
              });
  
              // Hide markers for intermediate waypoints (not the first and last)
              if (waypointIndex !== 0 && waypointIndex !== numberOfWaypoints - 1) {
                marker.options.icon = L.divIcon({
                  className: 'hide-marker', // Apply a custom class for hiding
                  iconSize: [0, 0], // Set icon size to zero for hiding
                });
              }
  
              return marker; // Return the marker
            },
          }).addTo(this.map);
  
  
  
  

          // Save route to local storage when the route is changed
          this.routingControl.on('routesfound', (e: any) => {
            // const routes = e.routes;
            // localStorage.setItem('savedRoute', JSON.stringify(routes));

            this.startPoint = e.waypoints[0].latLng.lat + ',' + e.waypoints[0].latLng.lng
            this.endPoint = e.waypoints[1].latLng.lat + ',' + e.waypoints[1].latLng.lng
            const route = e.routes[0]; // Get first route
            const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng

            // Store route in local storage
            // localStorage.setItem('savedRoute', JSON.stringify(route));

            const geoJSON = this.convertToGeoJSON(route);
            this.route = { id: id, geometry: JSON.stringify(geoJSON) }
            


            // Draw geofence around the route
            // this.createRouteGeofence(coordinates);


          });
        }
  
  
      }


      
    } catch (error:any) {
      this.toastService.showError('Error', 'Failed to get Route');
    }


  }


  async onDeleteState(event:any): Promise<any> {
    
    try {
      await this.routeService.deleteRoute(event.item);
      this.toastService.showSuccess('Success', 'Route Created Successfully!');
      await this.fetchRoutes();
    } catch (error) {
      this.toastService.showError('Error', `Failed to create Route!`);
    }
  }

  openNew(event: any) {
    this.isEditing = !event;
    this.route = this.resetRoute();
    this.routeDrawer = event;
  }

  resetRoute() {
    return {
      name: 'test',
      geometry: null
    };
  }

  async fetchRoutes(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.routeService.getList();
      this.routes = response.data;
      // this.toastService.showSuccess('Success', `${this.authService.getUserType()} List fetched successfully!`);
    } catch (error : any) {
      this.routes = [];
      this.toastService.showError('Error', error?.error?.data);
    } finally {
      this.isLoading = false;
    }
  }


  private createRouteGeofence(routeCoordinates: [number, number][]): void {  
    // Remove existing geofence if it exists
    if (this.routeGeofenceLayer) {
      this.map.removeLayer(this.routeGeofenceLayer);
    }
  
    // Create new geofence
    const line = turf.lineString(routeCoordinates);
    const buffered = turf.buffer(line, 50, { units: 'meters' });
  
    this.routeGeofenceLayer = L.geoJSON(buffered, {
      style: {
        color: '#4A90E2', // Nice blue shade
        fillColor: 'rgba(74, 144, 226, 0.4)', // Softer blue fill
        fillOpacity: 0.6, // Slightly transparent
        weight: 3, // Slightly thicker border
        dashArray: '5, 5' // Dashed border for a stylish effect
      }
    }).addTo(this.map);
  }










  plotStartPoint() {
    const [lat, lng] = this.startPoint.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      // const marker = L.marker([lat, lng]).addTo(this.map);
      // marker.bindPopup('Start Point').openPopup();
    } else {
      this.toastService.showError('Error', 'Invalid Start Point');
    }
  }

  plotEndPoint() {
    const [lat, lng] = this.endPoint.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      // const marker = L.marker([lat, lng]).addTo(this.map);
      // marker.bindPopup('End Point').openPopup();
      this.initializeRoutingControl();
    } else {
      this.toastService.showError('Error', 'Invalid End Point');
    }
  }

  private initializeRoutingControl() {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    const startLatLng = this.startPoint.split(',').map(Number);
    const endLatLng = this.endPoint.split(',').map(Number);
    this.routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(startLatLng[0], startLatLng[1]),
        L.latLng(endLatLng[0], endLatLng[1])
      ],
      routeWhileDragging: true,
      addWaypoints: false, // Disable adding waypoints
      createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
        // Create custom markers only for the first and last waypoint
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/images/marker-icon.png',
            shadowUrl: 'assets/images/marker-shadow.png',
          }),
          draggable: true

        });
      },
    }).addTo(this.map);


     // Save route to local storage when the route is changed
     this.routingControl.on('routesfound', (e: any) => {
      // const routes = e.routes;
      // localStorage.setItem('savedRoute', JSON.stringify(routes));

      this.startPoint = e.waypoints[0].latLng.lat + ',' + e.waypoints[0].latLng.lng
      this.endPoint = e.waypoints[1].latLng.lat + ',' + e.waypoints[1].latLng.lng
      const route = e.routes[0]; // Get first route
      const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng
  
      // Store route in local storage
      // localStorage.setItem('savedRoute', JSON.stringify(route));

      const geoJSON = this.convertToGeoJSON(route);
      this.route = {geometry: JSON.stringify(geoJSON) }
      
  
      // Draw geofence around the route
      // this.createRouteGeofence(coordinates);


    });
  }

  resetInputs() {
    // this.startPoint = '';
    // this.endPoint = '';
    this.routeName = '';
    this.routingControl = null
  }

  hideDrawer(e:any) {
    this.routeDrawer = e;
    this.resetInputs();
    
  }

  async createUpdateRoute(): Promise<any> {
    try {
      const response = this.isEditing ? await this.routeService.updateRoute({name: this.routeName,...this.route}) :  await this.routeService.createRoute({name: this.routeName,...this.route});
      this.routeDrawer = false;
      await this.fetchRoutes()
      this.toastService.showSuccess('Success', 'Route Created Successfully!');
    } catch (error) {
      this.toastService.showError('Error', `Failed to create Route!`);
    }
  }


  reverseGeoJSONToRoute(geoJSON: any) {
    const route: any = {
      name: "",  // Add a name if you have it
      coordinates: [],
      instructions: [],
      summary: {
        totalDistance: 0,  // You'll need logic to calculate distance
        totalTime: 0       // You'll need logic to calculate time
      },
      waypointIndices: [],
      inputWaypoints: [],
      waypoints: [],
      properties: {
        isSimplified: true
      },
      routesIndex: 0
    };

    // Convert LineString coordinates back to the 'coordinates' array
    geoJSON.features.forEach((feature: any) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: any) => {
          route.coordinates.push({
            lat: coord[1],
            lng: coord[0]
          });
        });
      }

      // Convert Point features back to waypoints
      if (feature.geometry.type === "Point" && !feature.properties.id) {
        route.waypoints.push({
          options: {
            allowUTurn: false
          },
          latLng: {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0]
          },
          name: feature.properties.name || ""
        });
      }

      if( feature.geometry.type === "Point" && feature.properties.id) {
        this.addMarkerOnClick(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      }
    });

    // You can calculate totalDistance and totalTime from the coordinates if needed
    // (this would require logic to calculate distance and time based on the route)

    // Example: Setting dummy distance and time (you should replace this with actual calculations)
    route.summary.totalDistance = 3996.7;  // Update with actual logic
    route.summary.totalTime = 373.5;       // Update with actual logic

    // For simplicity, let's assume the waypointIndices are [0, 1]
    route.waypointIndices = [0, 1];

    return route;

  };

  convertToGeoJSON(data:any) {
    const features = [];

    // Convert coordinates to LineString geometry
    const coordinates = data.coordinates.map((coord:any) => [coord.lng, coord.lat]);

    features.push({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coordinates
        },
        properties: {}
    });

    // Only consider waypoints for Point geometry
    data.waypoints.forEach((waypoint:any) => {
        features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [waypoint.latLng.lng, waypoint.latLng.lat]
            },
            properties: {
                name: waypoint.name || "Unknown"
            }
        });
    });

    return {
        type: "FeatureCollection",
        features: features
    };
}


 ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

}
