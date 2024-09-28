import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
export class DashboardComponent implements OnInit {

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


bardata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC733'],
            hoverBackgroundColor: ['#FF6F4B', '#4BFF6F', '#4B6FFF', '#FF4BA8', '#FFD04B'], 
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC733'],
            hoverBackgroundColor: ['#FF6F4B', '#4BFF6F', '#4B6FFF', '#FF4BA8', '#FFD04B'],
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};


baroptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
            }
        }
    },
    scales: {
        x: {
            ticks: {
                font: {
                    weight: 500
                }
            },
            grid: {
                drawBorder: false
            }
        },
        y: {
            ticks: {
            },
            grid: {
                drawBorder: false
            }
        }

    }
};

  onMapReady(map: Map) {
      this.map = map;
}


ngOnInit(): void {
    
}

}
