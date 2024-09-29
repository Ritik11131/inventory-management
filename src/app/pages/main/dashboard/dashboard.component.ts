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
    labels: ['A', 'B', 'C','D','E'],
    datasets: [
        {
            data: [88,9,8,10,5],
            backgroundColor: [
                "#FE475D",
                "#FE6C7D",
                "#FE919E",
                "#FFB5BE",
                "#FFDADF"
              ],
            hoverBackgroundColor: [
                "#FA5267",
                "#FA7585",
                "#FF9CA7",
                "#FABEC5",
                "#FCE1E4"
              ] 
        }
    ]
};

options = {
    cutout: '60%',
      plugins: {
          legend: { display: true,position: 'top', labels: { usePointStyle: true } },
          tooltip: { enabled: true }
      },
      animation: {
          animateRotate: true,
          animateScale: true,
          easing: 'easeInOutQuart',
          animateOnInit: true,
      },
  };


bardata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            type: 'line',
            label: 'My First dataset',
            borderColor:"#39C8A6",
            fill: true,
            tension: 0.6,
            data: [50, 25, 12, 48, 56, 76, 42]
        },
        {
            type:'bar',
            label: 'My Second dataset',
            backgroundColor: ['#3357FF'],
            // hoverBackgroundColor: ['#FF6F4B', '#4BFF6F', '#4B6FFF', '#FF4BA8', '#FFD04B'], 
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            type:'bar',
            label: 'My Third dataset',
            backgroundColor: ['#FFC733'],
            // hoverBackgroundColor: ['#FF6F4B', '#4BFF6F', '#4B6FFF', '#FF4BA8', '#FFD04B'],
            data: [22, 42, 32, 12, 82, 22, 82]
        }
    ]
};


baroptions = {
    animation: {
      easing: 'easeInOutQuart',
      animateOnInit: true,
  },
    plugins: {
        legend: { display : true ,position:'bottom'},
        tooltip:{ enabled:true }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#252525'
        },
        title: {
          display: true,
        //   text: 'Trip Distance',
          color: 'black',
          font: {
            weight: 400,
            size: 12,
          },
        }
      },
      y: {
        display: true,
        grid: {
          display: false
        },
        title: {
          display: true,
        //   text: 'No of Events(%)',
          color: 'black',
          font: {
            weight: 400,
            size: 12,
          },
        }
      }
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0
        },
      }
    }
  };

  onMapReady(map: Map) {
      this.map = map;
}


ngOnInit(): void {
    
}

}
