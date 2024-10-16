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
    { field: 'sno', header: 'Device No' },
    { field: 'imei', header: 'IMEI' },
    { field: 'iccid', header: 'ICCID No' },
    { field: 'sim_provider', header: 'Sim Provider' },
    { field: 'primary_sim_operator', header: 'Primary Sim Operator' },
    { field: 'primary_mob_no', header: 'Primary Mobile No' },
    { field: 'secondary_sim_operator', header: 'Secondary Sim Operator' },
    { field: 'secondary_mob_no', header: 'Secondary Mobile No' },
    { field: 'activation_date', header: 'Activation Date' },
    { field: 'activation_till', header: 'Activation Till' }
];

export const deviceModelColumns = [
    { field: 'index', header: 'S.NO' },
    { field: 'oemName', header: 'User Name' },
    { field: 'modelName', header: 'Model Name' }
];

export const simProviders = [
    { field: 'id', header: 'Id' },
    { field: 'providerName', header: 'Provider Name' },
]


export const stateColumns = [
    { field: 'stateName', header: 'State Name', minWidth: '10rem' },
    { field: 'stateCode', header: 'State Code', minWidth: '10rem' },
];


export const rtoColumns = [
    { field: 'state', header: 'State Name', minWidth: '14rem', nested: true, nestedName: 'stateName' },
    { field: 'rtoCode', header: 'RTO Code', minWidth: '5rem' },
    { field: 'rtoName', header: 'RTO Name', minWidth: '5rem' }
];