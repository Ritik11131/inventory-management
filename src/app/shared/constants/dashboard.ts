// import { ChartPanel } from "../interfaces/dashboard";

export const vehicleStatusOverviewObject = [
  { label: 'Running Vehicles', count: 0, colorClass: 'green', bgColorClass: 'bg-green-100', textColorClass: 'text-green-500', key: 'RUNNING',lottiePath: '/assets/lottie/running-truck.json'  },
  { label: 'Idle Vehicles', count: 0, colorClass: 'yellow', bgColorClass: 'bg-yellow-100', textColorClass: 'text-yellow-400', key: 'DORMANT',lottiePath: '/assets/lottie/idle-truck.json'  },
  { label: 'Stop Vehicles', count: 0, colorClass: 'red', bgColorClass: 'bg-red-100', textColorClass: 'text-red-500', key: 'STOP',lottiePath: '/assets/lottie/stop-truck.json'  },
  { label: 'Offline Vehicles', count: 0, colorClass: 'surface', bgColorClass: 'bg-bluegray-100', textColorClass: 'text-bluegray-700', key: 'OFFLINE',lottiePath: '/assets/lottie/offline-truck.json' },
];

export const renewalStatusObject = [
  { value : 0, key:'Due',bgColor: 'bg-yellow-500',lottiePath: '/assets/lottie/deadline.json' },
  { value: 0, key: 'Lapse', bgColor: 'bg-red-500',lottiePath: '/assets/lottie/expired.json' },
];

export const totalRegistrationObject = [
  { value: 0, key: 'OEM', bgColor: 'bg-green-500',lottiePath: '/assets/lottie/factory.json' },
  { value: 0, key: 'RFC', bgColor: 'bg-yellow-500',lottiePath: '/assets/lottie/rfc.json' },
];

export const inventoryObject = [
  { value: 0, key: 'Total', bgColor: 'bg-green-500',lottiePath: '/assets/lottie/total.json' },
  { value: 0, key: 'Fitted', bgColor: 'bg-yellow-500',lottiePath: '/assets/lottie/fitted.json' },
];

export const lastPosStatusColors : any = {
  "RUNNING": 'green',
  "STOP": 'red',
  "DORMANT": 'yellow',
  "OFFLINE": 'grey'
};


export const SOSALertOverSpeed = [
  {
    title: 'SOS',
    image: 'assets/images/sos.png',
    fields: [],
    bgClass: 'bg-red-500',
    value: 0,
    lottiePath: '/assets/lottie/push-button.json'
  },
  {
    title: 'Over Speed',
    image: 'assets/images/overspeed.png',
    fields: [],
    bgClass: 'bg-orange-500',
    value: 0,
    lottiePath: '/assets/lottie/over-speed.json'
  },
  {
    title: 'Alert',
    image: 'assets/images/alert.png',
    fields:[
      { key: 'ignitionOn', label: 'Ignition On', colSpan: '4', textAlign: 'left' },
      { key: 'ignitionOff', label: 'Ignition Off', colSpan: '4', textAlign: 'center' },
      { key: 'tampering', label: 'Tampering', colSpan: '4', textAlign: 'right' },
      { key: 'powerCut', label: 'Power Cut', colSpan: '4', textAlign: 'left' },
      { key: 'powerRestored', label: 'Power Resume', colSpan: '4', textAlign: 'center' },
      { key: 'lowBattery', label: 'Power Low Battery', colSpan: '4', textAlign: 'right' },
      { key: 'hardAcceleration', label: 'Hasrh Acceleration', colSpan: '4', textAlign: 'left' },
      { key: 'hardBraking', label: 'Harsh Breaking', colSpan: '4', textAlign: 'center' },
      { key: 'hardCornering', label: 'Harsh Turning', colSpan: '4', textAlign: 'right' },
      { key: 'geofenceEnter', label: 'Geofence In', colSpan: '4', textAlign: 'left' },
      { key: 'geofenceExit', label: 'Geofence Out', colSpan: '4', textAlign: 'center' }
    ],
    response:{},
    bgClass: 'bg-yellow-500',
    value: 0,
    lottiePath: '/assets/lottie/alert.json'
  }
];


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