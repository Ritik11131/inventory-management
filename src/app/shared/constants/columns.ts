export const dynamicUserColumns = [
    { field: 'name', header: 'Name', minWidth: '10rem' },
    { field: 'orgName', header: 'Org Name', minWidth: '13rem' },
    { field: 'mobileNo', header: 'Mobile No', minWidth: '10rem' },
    { field: 'alternate_no', header: 'Alternate No', minWidth: '10rem' },
    { field: 'emailId', header: 'Email', minWidth: '15rem' },
    { field: 'address', header: 'Address', minWidth: '15rem' },
    { field: 'active', header: 'Status', minWidth: '7rem', frozen:true },
];


export const deviceColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'sno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No', hyperlink: true},
    { field: 'vehicle', header: 'Vehicle No', nested:true, subfield:'vehicleNo', hyperlink: true},
    { field: 'user', header: 'Permit Holder',nested:true, subfield:'name', hyperlink: true },
    { field: 'downloadCertificate',header:'Download Certificate'},
    { field: 'lastPosition', header: 'Online Status',nested:true, subfield:'status' },
    { field: 'inStock', header: 'Stock Status', minWidth: '12rem' },
    { field: 'activationStatusText', header: 'Activation Status', frozen:true, minWidth: '12rem' },
];


export const transferDeviceColumns = [
    { field: 'index', header: 'S.NO' },
    { field: 'sno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No'},
]

export const eSimDeviceColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'devicesno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No'},
    // { field: 'vehicle', header: 'Vehicle No', nested:true, subfield:'vehicleNo'},
]

export const InventoryColumns = [
    { field: 'sno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No' },
];

export const ESimColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    // { field: 'user', subfield: 'orgname', header: 'Organization Name', minWidth: '12rem' },
    { field: 'user', subfield: 'orgname', header: 'Requested By', minWidth: '12rem' },
    { field: 'serviceProvider', subfield: 'providername', header: 'Service Provider', minWidth: '12rem' },
    { field: 'type', subfield: 'name', header: 'Type', minWidth: '10rem' },
    { field: 'plan', subfield: 'name', header: 'Plan', minWidth: '10rem' },
    { field: 'request', subfield: 'srId', header: 'Sr Id', minWidth: '10rem' },
    { field: 'request', subfield: 'requestedon', header: 'Requested On', minWidth: '15rem', type:'date' },
    // { field: 'request', subfield: 'lastupdatetime', header: 'Last Updated', minWidth: '15rem', type:'date' },
    { field: 'request', subfield: 'status', header: 'Status', minWidth: '10rem' }
];


export const deviceModelColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'oemName', header: 'User Name' },
    { field: 'modelName', header: 'Model Name' }
];

export const simProviders = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'id', header: 'Id' },
    { field: 'providerName', header: 'Provider Name' },
];

export const ESimActivationLinkedDeviceColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'RequestedBy', header: 'Requested By', minWidth: '12rem' },
    { field: 'ServiceProvider', header: 'Service Provider', minWidth: '12rem' },
    { field: 'Type', header: 'Type', minWidth: '10rem' },
    { field: 'Plan', header: 'Plan', minWidth: '10rem' },
    { field: 'Devicesno', header: 'Device No' },
    { field: 'Imei', header: 'IMEI' },
    { field: 'Iccid', header: 'ICCID No' },
]

export const eSimColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'iccid', header: 'ICCID' },
];


export const stateColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'stateName', header: 'State Name', minWidth: '10rem' },
    { field: 'stateCode', header: 'State Code', minWidth: '10rem' },
];


export const rtoColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'state', header: 'State Name', minWidth: '14rem', nested: true, subfield: 'stateName' },
    { field: 'rtoCode', header: 'RTO Code', minWidth: '5rem' },
    { field: 'rtoName', header: 'RTO Name', minWidth: '5rem' }
];

export const routeColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'name', header: 'Name', minWidth: '10rem' },
];

export const vehicleCategoryColumns = [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field:'name',header: 'Name', minWidth: '10rem' },
    { field:'totalCount',header: 'Total', minWidth: '10rem' },
];


export const alertInfotableColumns = [
    { field: 'eventType', header: 'Event Type', minWidth: '10rem' },
    { field: 'vehicleNo', header: 'Vehicle No.', minWidth: '10rem' },
    { field: 'oem', header: 'OEM', minWidth: '8rem' },
    { field: 'permitHolderName', header: 'Permit Holder Name', minWidth: '12rem' },
    { field: 'permitHolderMobile', header: 'Permit Holder Mobile', minWidth: '12rem' },
    { field: 'deviceSno', header: 'Device SNo.', minWidth: '10rem' },
    { field: 'deviceImei', header: 'Device IMEI', minWidth: '12rem' },
    { field: 'lastUpdateOn', header: 'Alert Time', minWidth: '10rem', type:'date' },
    { field: 'latLng', header: 'Lat/Lng', minWidth: '12rem' }
];

export const vehicleTypeInstallationInfotableColumns = [
    { field: 'vehicleNo', header: 'Vehicle No.', minWidth: '10rem' },
    { field: 'oem', header: 'OEM', minWidth: '8rem' },
    { field: 'permitHolderName', header: 'Permit Holder Name', minWidth: '12rem' },
    { field: 'permitHolderMobile', header: 'Permit Holder Mobile', minWidth: '12rem' },
    { field: 'deviceSno', header: 'Device SNo.', minWidth: '10rem' },
    { field: 'deviceImei', header: 'Device IMEI', minWidth: '12rem' },
];

export const lastUpdateInfoColumns = [
    { field: 'vehicleNo', header: 'Vehicle No.', minWidth: '10rem' },
    { field: 'oem', header: 'OEM', minWidth: '8rem' },
    { field: 'permitHolderName', header: 'Permit Holder Name', minWidth: '12rem' },
    { field: 'permitHolderMobile', header: 'Permit Holder Mobile', minWidth: '12rem' },
    { field: 'deviceSno', header: 'Device SNo.', minWidth: '10rem' },
    { field: 'deviceImei', header: 'Device IMEI', minWidth: '12rem' },
    { field: 'lastUpdateOn', header: 'Last Update Time', minWidth: '10rem', type:'date' },
    { field: 'speed', header: 'Speed (Km/hr)', minWidth: '10rem' },
    { field: 'latLng', header: 'Lat/Lng', minWidth: '12rem' }
];

export const overspeedInfotableColumns = [
    { field: 'vehicleNo', header: 'Vehicle No.', minWidth: '10rem' },
    { field: 'oem', header: 'OEM', minWidth: '8rem' },
    { field: 'permitHolderName', header: 'Permit Holder Name', minWidth: '12rem' },
    { field: 'permitHolderMobile', header: 'Permit Holder Mobile', minWidth: '12rem' },
    { field: 'deviceSno', header: 'Device SNo.', minWidth: '10rem' },
    { field: 'deviceImei', header: 'Device IMEI', minWidth: '12rem' },
    { field: 'lastUpdateOn', header: 'Over Speed Time', minWidth: '10rem', type:'date' },
    { field: 'speed', header: 'Over Speed (Km/hr)', minWidth: '10rem' },
    { field: 'latLng', header: 'Lat/Lng', minWidth: '12rem' }
];

export const sosInfotableColumns = [
    { field: 'vehicleNo', header: 'Vehicle No.', minWidth: '10rem' },
    { field: 'oem', header: 'OEM', minWidth: '8rem' },
    { field: 'permitHolderName', header: 'Permit Holder Name', minWidth: '12rem' },
    { field: 'permitHolderMobile', header: 'Permit Holder Mobile', minWidth: '12rem' },
    { field: 'deviceSno', header: 'Device SNo.', minWidth: '10rem' },
    { field: 'deviceImei', header: 'Device IMEI', minWidth: '12rem' },
    { field: 'lastUpdateOn', header: 'Alert Time', minWidth: '10rem', type:'date' },
    { field: 'latLng', header: 'Lat/Lng', minWidth: '12rem' }
];

export const inventoryInfoTableColumns = [
    { field: 'oemOrgname', header: 'OEM Name', minWidth: '8rem' },
    { field: 'InStock', header: 'Inventory Count', minWidth: '8rem' },
    { field: 'Fitted', header: 'Fitted Count', minWidth: '8rem' },
];

export const renewalInfoTableColumns = [
    { field: 'oemOrgname', header: 'OEM Name', minWidth: '8rem' },
    { field: 'Due', header: 'Due Count', minWidth: '8rem' },
    { field: 'Laps', header: 'Lapse Count', minWidth: '8rem' },
]

export const oemInfoTableColumns = [
    { field: 'orgname', header: 'Organization Name', minWidth: '12rem' },
    { field: 'contactpersonname', header: 'Contact Person', minWidth: '12rem' },
    { field: 'mobileno', header: 'Mobile Number', minWidth: '10rem' },
    { field: 'email', header: 'Email', minWidth: '14rem' },
    { field: 'usertype', header: 'User Type', minWidth: '8rem' },
    { field: 'certificate', header: 'Certificate', minWidth: '10rem' },
    { field: 'tac', header: 'TAC', minWidth: '8rem' },
    { field: 'cop', header: 'COP Valid Upto', minWidth: '10rem', type:'date', nested: true, subfield: 'validUpTo' }
];

export const rfcInfoTableColumns = [
    { field: 'oem', header: 'OEM Name', minWidth: '12rem', type: 'string', nested: true, subfield: 'orgname' },
    { field: 'rfc', header: 'RFC Name', minWidth: '12rem', type: 'string', nested: true, subfield: 'orgname' },
    { field: 'oem', header: 'Oem Contact Person Name', minWidth: '14rem', type: 'string', nested: true, subfield: 'contactpersonname' },
    { field: 'rfc', header: 'Rfc Contact Person Name', minWidth: '14rem', type: 'string', nested: true, subfield: 'contactpersonname' },
    { field: 'oem', header: 'Oem Contact Person Mobile', minWidth: '12rem', type: 'string', nested: true, subfield: 'mobileno' },
    { field: 'rfc', header: 'Rfc Contact Person Mobile', minWidth: '12rem', type: 'string', nested: true, subfield: 'mobileno' },
    { field: 'oem', header: 'Address', minWidth: '18rem', type: 'string', nested: true, subfield: 'address' }
];


export const activationReportColumns =  [
    { field: 'index', header: 'S.NO', minWidth: '7rem' },
    { field: 'user', subfield: 'orgname', header: 'Requested By', minWidth: '12rem', nested: true },
    { field: 'serviceProvider', subfield: 'providername', header: 'Service Provider', minWidth: '12rem', nested: true },
    { field: 'type', subfield: 'name', header: 'Type', minWidth: '10rem', nested: true },
    { field: 'plan', subfield: 'name', header: 'Plan', minWidth: '10rem', nested: true },
    { field: 'request', subfield: 'srId', header: 'Sr Id', minWidth: '10rem', nested: true },
    { field: 'request', subfield: 'requestedon', header: 'Requested On', minWidth: '15rem', type:'date', nested: true },
    { field: 'request', subfield: 'status', header: 'Status', minWidth: '10rem', nested: true },
    { field: 'request', subfield: 'deviceCount', header: 'Devices', minWidth: '15rem', nested: true, button: { show: true, label: { api: { show:true, field:'request', subfield:'deviceCount'} }, key:'showLinkedDevices' }  },
];


export const expiredReportColumns = [
  { field: 'orgName', header: 'Organization Name' },
  { field: 'contactPersonName', header: 'Contact Person Name' },
  { field: 'mobileNo', header: 'Mobile Number' },
  { field: 'userType', header: 'User Type' },
  { field: 'deviceSno', header: 'Device S.No.' },
  { field: 'deviceSerialNo', header: 'Device Serial Number' },
  { field: 'imei', header: 'IMEI' },
  { field: 'iccid', header: 'ICCID' },
  { field: 'providerName', header: 'Provider Name' },
  { field: 'primarySimNo', header: 'Primary SIM Number' },
  { field: 'secondarySimNo', header: 'Secondary SIM Number' },
  { field: 'primarySimOperator', header: 'Primary SIM Operator' },
  { field: 'secondarySimOperator', header: 'Secondary SIM Operator' },
  { field: 'activationOn', header: 'Activation Date', type:'date' },
  { field: 'primaryValidTill', header: 'Primary SIM Valid Till', type:'date' },
  { field: 'secondaryValidTill', header: 'Secondary SIM Valid Till', type:'date' }
];

  