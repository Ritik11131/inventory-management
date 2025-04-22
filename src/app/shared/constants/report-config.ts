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
        // {
        //     id: "complaints",
        //     reportName: "Complaints",
        //     filters: {
        //         rto: true,
        //         oem: true,
        //         date: { enabled: true }
        //     }
        // },
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
                { field: 'status', subfield:'status', header: 'Status' },
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
                { field: 'status', subfield:'status', header: 'Status' },
            ],
            globalFilterFields:['device.vahanSno', 'device.imei', 'device.vehicleName', 'oem.name', 'permitHolder.permitHolderName', 'rto.rtoName', 'status'],
        },
        // {
        //     id: "alert",
        //     reportName: "Alert",
        //     filters: {
        //         rto: true,
        //         oem: true,
        //         date: { enabled: true }
        //     }
        // },
        // {
        //     id: "vehicle_category",
        //     reportName: "Vehicle Category",
        //     filters: {
        //         rto: true,
        //         oem: true
        //     }
        // },
        // {
        //     id: "upcoming_renewal",
        //     reportName: "Upcoming Renewal",
        //     filters: {
        //         rto: true,
        //         oem: true,
        //         date: {
        //             enabled: true,
        //             type: "currentAndFuture"
        //         }
        //     }
        // },
        // {
        //     id: "expired",
        //     reportName: "Expired",
        //     filters: {
        //         rto: true,
        //         oem: true,
        //         date: {
        //             enabled: true,
        //             type: "currentAndPast"
        //         }
        //     }
        // },
        // {
        //     id: "inventory",
        //     reportName: "Inventory",
        //     filters: {
        //         oem: true
        //     }
        // },
        // {
        //     id: "rfc",
        //     reportName: "RFC",
        //     filters: {
        //         rto: true,
        //         oem: true,
        //         date: { enabled: true }
        //     }
        // }
    ]
};
