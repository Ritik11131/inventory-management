import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import {icon, latLng, Map, Marker, marker, tileLayer} from "leaflet";
import { ChartModule } from 'primeng/chart';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DividerModule,ChartModule,LeafletModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor() {}


  map!: Map;

  lealfetOptions = {
    layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
    ],
    zoom: 5,
    center: latLng(27.54095593, 79.16035184)
};


  data = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [540, 325, 702],
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC733'],
            hoverBackgroundColor: ['#FF6F4B', '#4BFF6F', '#4B6FFF', '#FF4BA8', '#FFD04B'] 
        }
    ]
};

options = {
    plugins: {
        legend: {
            labels: {
                usePointStyle: true,

            }
        }
    }
};

  onMapReady(map: Map) {
      this.map = map;
}

}
