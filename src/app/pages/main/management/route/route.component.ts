import { latLng } from 'leaflet';
import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import * as turf from '@turf/turf';
import { routeColumns } from '../../../../shared/constants/columns';
import { GenericDrawerComponent } from "../../../../shared/components/generic-drawer/generic-drawer.component";
import { ButtonModule } from 'primeng/button';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouteService } from '../../../../core/services/route.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [GenericTableComponent, GenericDrawerComponent, ButtonModule, LeafletModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent implements OnInit {

  columns = routeColumns;
  fields: any[] = []
  route!: any;
  routes: any[] = [];
  isLoading: boolean = false;
  routeDrawer: boolean = false;
  isEditing: boolean = false;
  private routeGeofenceLayer: L.Layer | null = null; 

  private map!: L.Map;
  private routingControl!: any;

  options = {
    layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' })],
    zoom: 10,
    center: L.latLng(28.6139, 77.2090) // Default center (Delhi)
  };

  constructor(private routeService : RouteService, private toastService : ToastService) {}



  private initRoutingControl(): void {
    // Custom marker creation function
    this.routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(51.5, -0.09), // Start point
        L.latLng(51.51, -0.1)  // End point
      ],
      routeWhileDragging: true,
      createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
        // Create custom markers only for the first and last waypoint
        console.log(waypointIndex, waypoint, numberOfWaypoints);
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
      console.log(e);
      // const routes = e.routes;
      // localStorage.setItem('savedRoute', JSON.stringify(routes));


      const route = e.routes[0]; // Get first route
      const coordinates = route.coordinates.map((c: any) => [c.lng, c.lat]); // Extract lat-lng
  
      // Store route in local storage
      localStorage.setItem('savedRoute', JSON.stringify(route));
  
      // Draw geofence around the route
      this.createRouteGeofence(coordinates);


    });
  }

  public loadSavedRoute(): void {
    const savedRoute = localStorage.getItem('savedRoute');

    if (savedRoute) {
      const savedCoordinates = JSON.parse(savedRoute).coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
      const savedWaypoints = JSON.parse(savedRoute).waypoints.map((coord: any) => coord.latLng);

      if (savedCoordinates.length > 0) {
        // Remove existing routing control if present
        if (this.routingControl) {
          this.map.removeControl(this.routingControl);
        }

        console.log('yeahh');


        // Custom routing control using your own waypoints
        this.routingControl = (L as any).Routing.control({
          waypoints: savedWaypoints, // This will be your custom waypoints
          createMarker: (waypointIndex: any, waypoint: any, numberOfWaypoints: any) => {
            console.log(waypointIndex, waypoint, numberOfWaypoints);

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





        // Listen to the 'routesfound' event to detect when the route is newly created
        this.routingControl.on('routesfound', (event: any) => {
          // event.routes contains the route information
          console.log('New route found:', event.routes);
          const routes = event.routes;
          localStorage.setItem('savedRoute', JSON.stringify(routes));
        });
      }


    }


  }

  ngOnInit(): void {
      this.fetchRoutes()
  }


  onMapReady(map: L.Map) {
    console.log('Leaflet Map is Ready', map);
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    this.initRoutingControl()
  }


  onEditState(route: any) {
    this.isEditing = true;
    console.log('Editing user:', route);
    this.route = { ...route };
    this.routeDrawer = true;
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




}
