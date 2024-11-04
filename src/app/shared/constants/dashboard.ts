import { ChartPanel } from "../interfaces/dashboard";

export const vehicleStatusOverviewObject = [
    { label: 'Running Vehicles', count: 0, colorClass: 'green', bgColorClass: 'bg-green-100', textColorClass: 'text-green-500' }, 
    { label: 'Idle Vehicles', count: 0, colorClass: 'orange', bgColorClass: 'bg-orange-100', textColorClass: 'text-orange-500' }, 
    { label: 'Stop Vehicles', count: 0, colorClass: 'red', bgColorClass: 'bg-red-100', textColorClass: 'text-red-500' }, 
    { label: 'Offline Vehicles', count: 0, colorClass: 'blue', bgColorClass: 'bg-blue-100', textColorClass: 'text-blue-500' }
]


export const secondRowCharts: ChartPanel[] = [
    {
      header: 'Total Registration',
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#007BFF', // Cerulean Blue
            '#FF5733', // Sunset Orange
            '#28A745', // Lime Green
            '#FFC107'  // Golden Yellow
          ],
          hoverOffset: 4


        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right', labels: { usePointStyle: true, } }
        }
      }
    },
    {
      header: 'Last 7 days Activation',
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
              label: 'Activations 1',
              backgroundColor: '#3357FF', // Sky Blue
              data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
              label: 'Activations 2',
              backgroundColor: '#FFC733', // Coral
              data: [40, 50, 90, 65, 70, 40, 30] // Example data for the second dataset
            }
          ]
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { display: true }
        },
        plugins: {
          legend: { position: 'bottom',labels: { usePointStyle: true, } }
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
      }
    }
  ];


  // Define chart panel configurations in your component TypeScript file.
export const thirdRowCharts: ChartPanel[] = [
  {
    header: 'Vehicle Type Wise Installation',
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Installations',
          backgroundColor: '#42A5F5',
          data: [],
          barThickness:50
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true },
      },
      plugins: {
        legend: { position: 'bottom',labels: { usePointStyle: true, } },
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
    },
  },
  {
    header: 'Total Inventory',
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#66BB6A', // OEM - Vibrant Green
            '#FFA726', // Dealer - Bright Orange
            '#42A5F5', // Distributor - Sky Blue
            '#EF5350'  // Others - Crimson Red
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right',labels: { usePointStyle: true, } },
      },
    },
  },
  {
    header: 'Total Complaints Lodge',
    type: 'doughnut',
    data: {
      labels: ['Resolved', 'Pending', 'In Progress'],
      datasets: [
        {
          data: [180, 40, 30],
          backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right',labels: { usePointStyle: true, } },
      },
    },
  },
];