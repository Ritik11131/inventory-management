import 'leaflet-draw';
import { Component } from '@angular/core';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { routeColumns } from '../../../../shared/constants/columns';
import { GenericDrawerComponent } from '../../../../shared/components/generic-drawer/generic-drawer.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { RouteService } from '../../../../core/services/route.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-geofence',
  standalone: true,
  imports: [GenericTableComponent, GenericDrawerComponent, ButtonModule, LeafletModule, FormsModule],
  templateUrl: './geofence.component.html',
  styleUrl: './geofence.component.scss'
})
export class GeofenceComponent {
  geofences: any[] = [];
  columns = routeColumns;
  isLoading = false;
  geofenceDrawer = false;
  isEditing = false;
  geofenceName = '';
  geofence: any;

  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private currentLayer: L.Layer | null = null; // currently drawn/selected layer
  private selectedGeometry: any = null; // GeoJSON FeatureCollection (what we send to backend)

  options = {
    layers: [
      L.tileLayer(
        `https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=lite.day&apiKey=bhm0avrp9LuWfcoxd6E8Uzv1oZn3i2Mfcrsv77Bnw7Y`,
        { attribution: '&copy; HERE 2019' }
      ),
    ],
    zoom: 10,
    center: L.latLng(28.6139, 77.2090) // Delhi default
  };

  constructor(
    private toastService: ToastService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.fetchGeofences();
  }

    openNew(event: any) {
    this.isEditing = !event;
    this.geofenceDrawer = event;
  }

    hideDrawer(e:any) {
    this.geofenceDrawer = e;
    
  }

  // -------------------- MAP / DRAW SETUP --------------------
  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => this.map.invalidateSize(), 100);
    L.control.scale().addTo(this.map);

    // FeatureGroup to store editable layers
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // Draw control - enable circle and polygon as per your use-case
    const drawControl = new (L as any).Control.Draw({
      edit: { featureGroup: this.drawnItems, remove: true },
      draw: {
        polygon: true,
        polyline: false,
        circle: true,
        rectangle: true,
        marker: false
      }
    });
    this.map.addControl(drawControl);

    // CREATED
    this.map.on((L as any).Draw.Event.CREATED, (event: any) => {
      const layer: L.Layer = event.layer;

      // if you want only one geofence at a time, clear previous
      this.drawnItems.clearLayers();
      this.drawnItems.addLayer(layer);
      this.currentLayer = layer;

      // attach feature for circles so toGeoJSON won't lose radius
      if (layer instanceof L.Circle) {
        const center = (layer as L.Circle).getLatLng();
        const radius = Math.round((layer as L.Circle).getRadius());
        // attach a Feature so L.geoJSON / toGeoJSON may pick properties
        (layer as any).feature = {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
          properties: { radius }
        };
      }

      // update selectedGeometry from currentLayer
      try {
        this.selectedGeometry = this.generateGeoJSONFromLayer(this.currentLayer);
      } catch (err) {
        this.selectedGeometry = null;
      }

      console.log('Created layer -> selectedGeometry:', this.selectedGeometry);
    });

    // EDITED
    this.map.on((L as any).Draw.Event.EDITED, (event: any) => {
      let firstLayer: L.Layer | null = null;
      event.layers.eachLayer((layer: L.Layer) => {
        // if circle, preserve radius property (because toGeoJSON loses radius)
        if (layer instanceof L.Circle) {
          const center = (layer as L.Circle).getLatLng();
          const radius = Math.round((layer as L.Circle).getRadius());
          (layer as any).feature = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
            properties: { radius }
          };
        }
        if (!firstLayer) firstLayer = layer;
      });

      // update currentLayer & selectedGeometry based on first edited layer
      if (firstLayer) {
        this.currentLayer = firstLayer;
        try {
          this.selectedGeometry = this.generateGeoJSONFromLayer(this.currentLayer);
        } catch (err) {
          this.selectedGeometry = null;
        }
        console.log('Edited -> selectedGeometry:', this.selectedGeometry);
      }
    });

    // DELETED
    this.map.on((L as any).Draw.Event.DELETED, () => {
      this.drawnItems.clearLayers();
      this.currentLayer = null;
      this.selectedGeometry = null;
      console.log('All drawings deleted');
    });
  }

  // -------------------- CREATE / UPDATE --------------------
  async createUpdateGeofence(): Promise<any> {
    if (!this.geofenceName) {
      this.toastService.showError('Validation', 'Please enter geofence name!');
      return;
    }

    // Ensure we build geometry fresh from currentLayer if available
    if (!this.selectedGeometry && this.currentLayer) {
      try {
        this.selectedGeometry = this.generateGeoJSONFromLayer(this.currentLayer);
      } catch (err) {
        // ignore, will validate below
      }
    }

    if (!this.selectedGeometry) {
      this.toastService.showError('Validation', 'Please draw a geofence on map!');
      return;
    }

    try {
      // Send FeatureCollection as string (backend seems to expect JSON string)
      const payload = {
        id: this.isEditing ? this.geofence?.id : undefined,
        name: this.geofenceName,
        geometry: JSON.stringify(this.selectedGeometry)
      };

      const response = this.isEditing
        ? await this.routeService.updateRoute(payload)
        : await this.routeService.createRoute(payload);

      console.log('Save response:', response);
      this.geofenceDrawer = false;
      await this.fetchGeofences();
      this.toastService.showSuccess('Success', this.isEditing ? 'Geofence Updated!' : 'Geofence Created!');
    } catch (error) {
      console.error(error);
      this.toastService.showError('Error', `Failed to save Geofence!`);
    }
  }

  // -------------------- EDIT FLOW (load existing geofence) --------------------
  async onEditState(geofence: any) {
    try {
      const response: any = await this.routeService.getRouteById(geofence);
      const { id,geometry, name } = response?.data ?? {};
      this.isEditing = true;
      this.geofenceDrawer = true;
      this.geofenceName = name ?? '';
      this.geofence = response?.data;

      if (!geometry) {
        this.selectedGeometry = null;
      } else {
        // backend stored a stringified GeoJSON — parse it
        const parsed = typeof geometry === 'string' ? JSON.parse(geometry) : geometry;
        this.selectedGeometry = parsed;
      }

      // wait for drawer & map to be ready — 200ms is usually fine
      setTimeout(() => {
        if (this.map && this.drawnItems) {
          this.loadGeometryOnMap(this.selectedGeometry);
        }
      }, 200);
    } catch (err) {
      console.error('Failed to load route for edit', err);
      this.toastService.showError('Error', 'Failed to load geofence for edit');
    }
  }

  // -------------------- LOAD / RENDER GEOJSON --------------------
  private loadGeometryOnMap(geojson: any) {
    this.drawnItems.clearLayers();
    this.currentLayer = null;

    if (!geojson) return;

    // Accept either a FeatureCollection or single Feature
    const fc = this.normalizeToFeatureCollection(geojson);

    const geoJsonLayer = L.geoJSON(fc, {
      style: () => ({
        color: '#3388ff',
        weight: 3,
        fillOpacity: 0.2
      }),
      pointToLayer: (feature: any, latlng: L.LatLng) => {
        // if radius present -> create real circle
        if (feature.properties?.radius) {
          const circle = L.circle(latlng, {
            radius: feature.properties.radius,
            weight: 3,
            fillOpacity: 0.2
          });
          // keep feature attached so edits can reuse properties
          (circle as any).feature = feature;
          return circle;
        }
        // fallback to marker (shouldn't be used for geofences)
        return L.marker(latlng);
      }
    });

    geoJsonLayer.eachLayer((layer: L.Layer) => {
      this.drawnItems.addLayer(layer);
      // set the currentLayer to the last added (if multiple features, use last)
      this.currentLayer = layer;
    });

    // update selectedGeometry to normalized fc (important)
    this.selectedGeometry = fc;

    // fit map
    this.fitMapToGeometry();
  }

  // -------------------- UTIL: GENERATE GEOJSON FROM A LAYER --------------------
  private generateGeoJSONFromLayer(layer: L.Layer | null): any {
    if (!layer) throw new Error('No geometry selected');

    // Circle -> save as FeatureCollection with Point + radius in properties
    if (layer instanceof L.Circle) {
      const center = (layer as L.Circle).getLatLng();
      const radius = Math.round((layer as L.Circle).getRadius());
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
            properties: { radius }
          }
        ]
      };
    }

    // Polygon / Rectangle
    if (layer instanceof L.Polygon) {
      const coords = this.getPolygonCoordinates(layer as L.Polygon);
      if (coords.length < 4) {
        throw new Error('Polygon must have at least 3 points');
      }
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [coords] },
            properties: {}
          }
        ]
      };
    }

    // Fallback: try to use layer.toGeoJSON()
    const raw = (layer as any).toGeoJSON ? (layer as any).toGeoJSON() : null;
    if (raw) {
      // If raw is a geometry, wrap it into FeatureCollection
      if (raw.type && raw.type === 'Feature') {
        return { type: 'FeatureCollection', features: [raw] };
      } else if (raw.type && raw.type === 'FeatureCollection') {
        return raw;
      } else if (raw.type) {
        // geometry object
        return { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: raw, properties: {} }] };
      }
    }

    throw new Error('Unsupported geometry type');
  }

  // -------------------- HELPERS --------------------
  private getPolygonCoordinates(polygon: L.Polygon): [number, number][] {
    // Handles nested latlng arrays for rectangle/polygon
    const raw = polygon.getLatLngs() as any;
    let latlngs: L.LatLng[] = [];

    // raw can be array of arrays => take first ring
    if (Array.isArray(raw) && Array.isArray(raw[0])) {
      latlngs = raw[0] as L.LatLng[];
    } else {
      latlngs = raw as L.LatLng[];
    }

    return latlngs.map((ll: L.LatLng) => [ll.lng, ll.lat]);
  }

  private fitMapToGeometry() {
    if (!this.currentLayer) return;
    const layerAny: any = this.currentLayer as any;
    if (layerAny.getBounds && typeof layerAny.getBounds === 'function') {
      const bounds = layerAny.getBounds();
      if (bounds && bounds.isValid && bounds.isValid()) {
        this.map.fitBounds(bounds, { maxZoom: 16 });
        return;
      }
    }
    // fallback: if circle -> center + setZoom
    if (this.currentLayer instanceof L.Circle) {
      const center = (this.currentLayer as L.Circle).getLatLng();
      this.map.setView(center, this.map.getZoom());
    }
  }

  private normalizeToFeatureCollection(anyGeo: any) {
    if (!anyGeo) return null;
    if (anyGeo.type === 'FeatureCollection') return anyGeo;
    if (anyGeo.type === 'Feature') return { type: 'FeatureCollection', features: [anyGeo] };
    // if it looks like an array of features
    if (Array.isArray(anyGeo.features)) return { type: 'FeatureCollection', features: anyGeo.features };
    // if it is a geometry object (Polygon / Point)
    if (anyGeo.type && (anyGeo.type === 'Polygon' || anyGeo.type === 'Point' || anyGeo.type === 'MultiPolygon')) {
      return { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: anyGeo, properties: {} }] };
    }
    // else return as-is (attempt)
    return anyGeo;
  }

  // -------------------- FETCH / DELETE --------------------
  async fetchGeofences(): Promise<any> {
    this.isLoading = true;
    try {
      const response = await this.routeService.getList();
      this.geofences = response.data;
    } catch (error: any) {
      this.geofences = [];
      this.toastService.showError('Error', error?.error?.data);
    } finally {
      this.isLoading = false;
    }
  }

  onDeleteState(geofence: any) {
    console.log('Delete Geofence:', geofence);
    // implement delete call if needed
  }
}
