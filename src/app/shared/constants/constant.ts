export const vehicleOverlayFields = [
    { key: 'vehicleNo', label: 'Vehicle No', colSpan: '6', textAlign: 'left' },
    { key: 'manufacturingYear', label: 'Manufacturing Year', colSpan: '6', textAlign: 'right' },
    { key: 'chassisNo', label: 'Chassis No', colSpan: '4', textAlign: 'left' },
    { key: 'engineNo', label: 'Engine No', colSpan: '4', textAlign: 'center' },
    { key: 'vehicleCategory', subfield:'name', label: 'Vehicle Category', colSpan: '4', textAlign: 'right' },
    { key: 'vehicleMake', label: 'Vehicle Make', colSpan: '4', textAlign: 'left' },
    { key: 'vehicleModel', label: 'Vehicle Model', colSpan: '4', textAlign: 'center' },
  ];
  
  export const userOverlayFields = [
    { key: 'permitHolderName', label: 'Name', colSpan: '4', textAlign: 'left' },
    { key: 'permitHolderMobile', label: 'Mobile No', colSpan: '4', textAlign: 'center' },
    { key: 'aadhaarNumber', label: 'Aadhar No', colSpan: '4', textAlign: 'right' },
  ];

  export const simOverlayFields = [
    { key: 'provider', subfield:'providerName', label: 'Provider', colSpan: '6', textAlign: 'left' },
    { key: 'activationOn', label: 'Activation On', colSpan: '6', textAlign: 'right', isDate: true },
    { key: 'primarySimNo', label: 'Primary SIM No', colSpan: '4', textAlign: 'left' },
    { key: 'primaryOpt', label: 'Primary Operator', colSpan: '4', textAlign: 'center' },
    { key: 'primaryValidTill', label: 'Primary Valid Till', colSpan: '4', textAlign: 'right', isDate: true },
    { key: 'secondarySimNo', label: 'Secondary SIM No', colSpan: '4', textAlign: 'left' },
    { key: 'secondaryOpt', label: 'Secondary Operator', colSpan: '4', textAlign: 'center' },
    { key: 'secondaryValidTill', label: 'Secondary Valid Till', colSpan: '4', textAlign: 'right', isDate: true },
  ];

  export const srOverlayFields = [
    { key: 'srid', label: 'SR ID', colSpan: '4', textAlign: 'left' },
    { key: 'actionRequested', label: 'Action Requested', colSpan: '4', textAlign: 'center' },
    { key: 'cardCount', label: 'Card Count', colSpan: '4', textAlign: 'right' },
    { key: 'closureDate', label: 'Closure Date', colSpan: '4', textAlign: 'left', isDate: true },
    { key: 'failReason', label: 'Fail Reason', colSpan: '4', textAlign: 'center' },
    { key: 'requestedDate', label: 'Requested Date', colSpan: '4', textAlign: 'right', isDate: true },
    { key: 'srStatus', label: 'SR Status', colSpan: '4', textAlign: 'left' },
];
