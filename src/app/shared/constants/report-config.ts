export const reportsConfigRoleWise: any = {
    Admin: [
        {
            id: "vehicle_status",
            reportName: "Vehicle Status",
            filters: {
                state:true,
                rto: true,
                oem: true,
                date: { enabled: false }
            },
            api:'report/VehicleStatus',
            tableColumns:[
                { field: 'device', subfield:'vahanSno', header: 'Vehicle Sno', nested: true, },
                { field: 'device', subfield:'imei', header: 'IMEI', nested: true, },
                { field: 'device', subfield:'vehicleName', header: 'Vehicle Name', nested: true, },
                { field: 'oem', subfield:'name', header: 'OEM Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderName', header: 'Permit Holder Name', nested: true, },
                { field: 'rto', subfield:'rtoName', header: 'RTO Name', nested: true, },
                { field: 'status', subfield:'status', header: 'Status' },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
        {
            id: "sos",
            reportName: "SOS",
            filters: {
                state:true,
                rto: true,
                oem: true,
                date: { enabled: true },               
            },
            api:'report/Alert/Sos',
            tableColumns:[
                { field: 'device', subfield:'vahanSno', header: 'Vehicle Sno', nested: true, },
                { field: 'device', subfield:'imei', header: 'IMEI', nested: true, },
                { field: 'device', subfield:'vehicleName', header: 'Vehicle Name', nested: true, },
                { field: 'oem', subfield:'name', header: 'OEM Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderName', header: 'Permit Holder Name', nested: true, },
                { field: 'rto', subfield:'rtoName', header: 'RTO Name', nested: true, },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
        {
            id: "overspeed",
            reportName: "Overspeed",
            filters: {
                state:true,
                rto: true,
                oem: true,
                date: { enabled: true }
            },
            api:'report/Alert/Overspeed',
            tableColumns:[
                { field: 'device', subfield:'vahanSno', header: 'Vehicle Sno', nested: true, },
                { field: 'device', subfield:'imei', header: 'IMEI', nested: true, },
                { field: 'device', subfield:'vehicleName', header: 'Vehicle Name', nested: true, },
                { field: 'oem', subfield:'name', header: 'OEM Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderName', header: 'Permit Holder Name', nested: true, },
                { field: 'rto', subfield:'rtoName', header: 'RTO Name', nested: true, },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
        {
            id: "expired_vehicle",
            reportName: "Expire Vehicle",
            filters: {
                state:true,
                rto: true,
                oem: true,
                date: { enabled: false }
            },
            tableActions:['send_message'],
            api:'report/Expired/Expired',
            tableColumns:[
                { field: 'fitmentDate', header: 'Fitment Date', type: 'date' },
                { field: 'fitmentValidTill', header: 'Fitment Valid', type: 'date' },
                { field: 'device', subfield:'imei', header: 'IMEI', nested: true, },
                { field: 'device', subfield:'vehicleName', header: 'Vehicle Name', nested: true, },
                { field: 'device', subfield:'vahaSno', header: 'Vahan Sno.', nested: true, },
                { field: 'oem', subfield:'name', header: 'OEM Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderName', header: 'Permit Holder Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderMobile', header: 'Permit Holder Mobile No', nested: true, },
                { field: 'rto', subfield:'rtoName', header: 'RTO Name', nested: true, },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
        {
            id: "expired_soom",
            reportName: "Expire Soon",
            filters: {
                state:true,
                rto: true,
                oem: true,
                days: true,
                date: { enabled: false }
            },
            tableActions:['send_message'],
            api: 'report/Expired/ExpireSoon',
            tableColumns:[
                { field: 'fitmentDate', header: 'Fitment Date', type: 'date' },
                { field: 'fitmentValidTill', header: 'Fitment Valid', type: 'date' },
                { field: 'device', subfield:'imei', header: 'IMEI', nested: true, },
                { field: 'oem', subfield:'name', header: 'OEM Name', nested: true, },
                { field: 'permitHolder', subfield:'permitHolderName', header: 'Permit Holder Name', nested: true, },
                { field: 'rto', subfield:'rtoName', header: 'RTO Name', nested: true, },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
    ]
};
