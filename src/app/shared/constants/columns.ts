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
    { field:'downloadCertificate',header:'Download Certificate'},
    { field: 'lastPosition', header: 'Online Status',nested:true, subfield:'status' },
    // { field: 'simDetails', header: 'Sim Provider',nested:true, subfield:'provider', nextsubfield:'providerName' },
    // { field: 'simDetails', header: 'Primary Sim Operator', nested:true, subfield:'primaryOpt' },
    // { field: 'simDetails', header: 'Primary Mobile No',nested:true, subfield:'primarySimNo' },
    // { field: 'simDetails', header: 'Primary Sim Validity',nested:true, subfield:'primaryValidTill', type:'date' },
    // { field: 'simDetails', header: 'Secondary Sim Operator',nested:true, subfield:'secondaryOpt' },
    // { field: 'simDetails', header: 'Secondary Mobile No',nested:true, subfield:'secondarySimNo' },
    // { field: 'simDetails', header: 'Secondary Sim Validity',nested:true, subfield:'secondaryValidTill', type:'date' },
    // { field: 'simDetails', header: 'Activation Date',nested:true, subfield:'activationOn', type:'date' },
    { field: 'inStock', header: 'Stock Status', minWidth: '12rem' },
    { field: 'activationStatusText', header: 'Activation Status', frozen:true, minWidth: '12rem' },
];

export const InventoryColumns = [
    { field: 'sno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No' },
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
  