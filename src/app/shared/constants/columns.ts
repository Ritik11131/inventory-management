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
    { field: 'iccid', header: 'ICCID No', chip: true, showOverlay: true },
    // { field: 'simDetails', header: 'Sim Provider',nested:true, subfield:'provider', nextsubfield:'providerName' },
    // { field: 'simDetails', header: 'Primary Sim Operator', nested:true, subfield:'primaryOpt' },
    // { field: 'simDetails', header: 'Primary Mobile No',nested:true, subfield:'primarySimNo' },
    // { field: 'simDetails', header: 'Primary Sim Validity',nested:true, subfield:'primaryValidTill', type:'date' },
    // { field: 'simDetails', header: 'Secondary Sim Operator',nested:true, subfield:'secondaryOpt' },
    // { field: 'simDetails', header: 'Secondary Mobile No',nested:true, subfield:'secondarySimNo' },
    // { field: 'simDetails', header: 'Secondary Sim Validity',nested:true, subfield:'secondaryValidTill', type:'date' },
    { field: 'simDetails', header: 'Activation Date',nested:true, subfield:'activationOn', type:'date' },
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