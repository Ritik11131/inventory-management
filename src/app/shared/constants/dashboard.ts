// import { ChartPanel } from "../interfaces/dashboard";

export const vehicleStatusOverviewObject = [
  { label: 'Running Vehicles', count: 0, colorClass: 'green', bgColorClass: 'bg-green-100', textColorClass: 'text-green-500', key: 'RUNNING' },
  { label: 'Idle Vehicles', count: 0, colorClass: 'yellow', bgColorClass: 'bg-yellow-100', textColorClass: 'text-yellow-400', key: 'DORMANT' },
  { label: 'Stop Vehicles', count: 0, colorClass: 'red', bgColorClass: 'bg-red-100', textColorClass: 'text-red-500', key: 'STOP' },
  { label: 'Offline Vehicles', count: 0, colorClass: 'surface', bgColorClass: 'bg-bluegray-100', textColorClass: 'text-bluegray-700', key: 'OFFLINE' },
];

export const renewalStatusObject = [
  { value : 0, key:'Due',bgColor: 'bg-yellow-500' },
  { value: 0, key: 'Lapse', bgColor: 'bg-red-500' },
];

export const totalRegistrationObject = [
  { value: 0, key: 'OEM', bgColor: 'bg-green-500' },
  { value: 0, key: 'RFC', bgColor: 'bg-yellow-500' },
];

export const inventoryObject = [
  { value: 0, key: 'Total', bgColor: 'bg-green-500' },
  { value: 0, key: 'Fitted', bgColor: 'bg-yellow-500' },
];

export const lastPosStatusColors : any = {
  "RUNNING": 'green',
  "STOP": 'red',
  "DORMANT": 'yellow',
  "OFFLINE": 'grey'
};



export const vehicleInstallationTypesObject = [
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
    { categoryName: 'Car', deviceCount: 0, totalCount:0 }, 
];

export const complaintStatsObject = [
  {
    status: 'Resolved',
    count: 0,
    colorClass: 'green',
    icon: 'pi-file-check'
  },
  {
    status: 'Pending',
    count: 0,
    colorClass: 'red',
    icon: 'pi-file-excel'
  }
];



  export const chartOptions = {
    series: [44122121, 55212121],
    chart: {
      width: 330,
      type: "pie"
    },
    colors:['#eec137','#ff3d32'],
    dataLabels: {
      enabled: true
    },
    fill: {
      type: "gradient"
    },
    labels: ["Due", "Lapse"],
    legend: {
      offsetY:0, // Adds space by moving the legend downward
      fontWeight: 600,    // Set font weight
      fontFamily:  'Urbanist ,sans-serif',
      fontSize: '14px',
      floating: false,
      itemMargin: {
        horizontal: 5,
        vertical: 0
    },
      formatter: (label:any, opts:any) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${label}: ${value}`;  // Display label and corresponding value
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };


// export const secondRowCharts: ChartPanel[] = [
//     {
//       header: 'Total Registration',
//       type: 'pie',
//       data: {
//         labels: [],
//         datasets: [{
//           data: [],
//           backgroundColor: [
//             '#007BFF', // Cerulean Blue
//             '#FF5733', // Sunset Orange
//             '#28A745', // Lime Green
//             '#FFC107'  // Golden Yellow
//           ],
//           hoverOffset: 4


//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { position: 'right', labels: { usePointStyle: true, } }
//         }
//       }
//     },
//     {
//       header: 'Last 7 days Activation',
//       type: 'bar',
//       data: {
//         labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//         datasets: [
//             {
//               label: 'Activations 1',
//               backgroundColor: '#3357FF', // Sky Blue
//               data: [65, 59, 80, 81, 56, 55, 40]
//             },
//             {
//               label: 'Activations 2',
//               backgroundColor: '#FFC733', // Coral
//               data: [40, 50, 90, 65, 70, 40, 30] // Example data for the second dataset
//             }
//           ]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           x: { display: true },
//           y: { display: true }
//         },
//         plugins: {
//           legend: { position: 'bottom',labels: { usePointStyle: true, } }
//         },
//         elements: {
//             bar: {
//               borderRadius: {
//                 topLeft: 8,
//                 topRight: 8,
//                 bottomLeft: 0,
//                 bottomRight: 0
//               },
//             }
//           }
//       }
//     }
//   ];


//   // Define chart panel configurations in your component TypeScript file.
// export const thirdRowCharts: ChartPanel[] = [
//   {
//     header: 'Vehicle Type Wise Installation',
//     type: 'bar',
//     data: {
//       labels: [],
//       datasets: [
//         {
//           label: 'Installations',
//           backgroundColor: '#42A5F5',
//           data: [],
//           barThickness:50
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       scales: {
//         x: { display: true },
//         y: { display: true },
//       },
//       plugins: {
//         legend: { position: 'bottom',labels: { usePointStyle: true, } },
//       },
//       elements: {
//         bar: {
//           borderRadius: {
//             topLeft: 8,
//             topRight: 8,
//             bottomLeft: 0,
//             bottomRight: 0
//           },
//         }
//       }
//     },
//   },
//   {
//     header: 'Total Inventory',
//     type: 'doughnut',
//     data: {
//       labels: [],
//       datasets: [
//         {
//           data: [],
//           backgroundColor: [
//             '#66BB6A', // OEM - Vibrant Green
//             '#FFA726', // Dealer - Bright Orange
//             '#42A5F5', // Distributor - Sky Blue
//             '#EF5350'  // Others - Crimson Red
//           ],
//         },
//       ],
//     },
//     options: {
//         cutout: 120,
//       responsive: true,
//       plugins: {
//         legend: { position: 'right',labels: { usePointStyle: true, } },
//       },
//     },
//   },
//   {
//     header: 'Total Complaints Lodge',
//     type: 'doughnut',
//     data: {
//       labels: ['Resolved', 'Pending', 'In Progress'],
//       datasets: [
//         {
//           data: [180, 40, 30],
//           backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB'],
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { position: 'right',labels: { usePointStyle: true, } },
//       },
//     },
//   },
// ];