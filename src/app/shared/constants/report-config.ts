export const reportsConfigRoleWise: any = {
    Admin: [
        {
            id: "vehicle_status",
            reportName: "Vehicle Status",
            filters: {
                rto: true,
                oem: true
            }
        },
        {
            id: "complaints",
            reportName: "Complaints",
            filters: {
                rto: true,
                oem: true,
                date: { enabled: true }
            }
        },
        {
            id: "sos",
            reportName: "SOS",
            filters: {
                rto: true,
                oem: true,
                date: { enabled: true },
                time: true
            }
        },
        {
            id: "overspeed",
            reportName: "Overspeed",
            filters: {
                rto: true,
                oem: true,
                date: { enabled: true }
            }
        },
        {
            id: "alert",
            reportName: "Alert",
            filters: {
                rto: true,
                oem: true,
                date: { enabled: true }
            }
        },
        {
            id: "vehicle_category",
            reportName: "Vehicle Category",
            filters: {
                rto: true,
                oem: true
            }
        },
        {
            id: "upcoming_renewal",
            reportName: "Upcoming Renewal",
            filters: {
                rto: true,
                oem: true,
                date: {
                    enabled: true,
                    type: "currentAndFuture"
                }
            }
        },
        {
            id: "expired",
            reportName: "Expired",
            filters: {
                rto: true,
                oem: true,
                date: {
                    enabled: true,
                    type: "currentAndPast"
                }
            }
        },
        {
            id: "inventory",
            reportName: "Inventory",
            filters: {
                oem: true
            }
        },
        {
            id: "rfc",
            reportName: "RFC",
            filters: {
                rto: true,
                oem: true,
                date: { enabled: true }
            }
        }
    ]
};
