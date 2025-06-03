import 'leaflet-draw';
import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { routeColumns } from '../../../../shared/constants/columns';
import { GenericDrawerComponent } from '../../../../shared/components/generic-drawer/generic-drawer.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';


@Component({
  selector: 'app-geofence',
  standalone: true,
  imports: [GenericTableComponent, GenericDrawerComponent,ButtonModule, LeafletModule, FormsModule],
  templateUrl: './geofence.component.html',
  styleUrl: './geofence.component.scss'
})
export class GeofenceComponent {

  geofences:any[] = []
  columns = routeColumns;
  isLoading = false;
  geofenceDrawer: boolean = false;
  isEditing: boolean = false;
  geofenceName: string = '';
    private map!: L.Map;
  

    options = {
      layers: [L.tileLayer(`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=lite.day&apiKey=bhm0avrp9LuWfcoxd6E8Uzv1oZn3i2Mfcrsv77Bnw7Y`, {
                    attribution: '&copy; HERE 2019'
                  }),],
      zoom: 10,
      center: L.latLng(28.6139, 77.2090) // Default center (Delhi)
    };

    
     onMapReady(map: L.Map) {
  console.log('Leaflet Map is Ready', map);
  this.map = map;

  setTimeout(() => {
    this.map.invalidateSize();
  }, 100);

  L.control.scale().addTo(this.map);

  // FeatureGroup to store editable layers
  const drawnItems = new L.FeatureGroup();
  this.map.addLayer(drawnItems);

  // Initialize the draw control
  const drawControl = new (L as any).Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },
    draw: {
      polygon: true,
      polyline: true,
      circle: true,
      marker: true
    }
  });
  this.map.addControl(drawControl);

  // Handle creation event
  this.map.on((L as any).Draw.Event.CREATED, (event: any) => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
  });
}
  

  onEditState(geofence: any) {

  }

onDeleteState(geofence: any) {

}
  openNew(event: any) {
    this.isEditing = !event;
    this.geofenceDrawer = event;
  }
  hideDrawer(e:any) {
    this.geofenceDrawer = e;
    
  }

}
