export const reportsConfigRoleWise: any = {
    Admin: [
        {
            id: "vehicle_status",
            reportName: "Vehicle Status",
            filters: {
                subUser: true,
                user: true
            }
        },
        {
            id: "complaints",
            reportName: "Complaints",
            filters: {
                subUser: true,
                user: true,
                date: { enabled: true }
            }
        },
        {
            id: "sos",
            reportName: "SOS",
            filters: {
                subUser: true,
                user: true,
                date: { enabled: true },
                time: true
            }
        },
        {
            id: "overspeed",
            reportName: "Overspeed",
            filters: {
                subUser: true,
                user: true,
                date: { enabled: true }
            }
        },
        {
            id: "alert",
            reportName: "Alert",
            filters: {
                subUser: true,
                user: true,
                date: { enabled: true }
            }
        },
        {
            id: "vehicle_category",
            reportName: "Vehicle Category",
            filters: {
                subUser: true,
                user: true
            }
        },
        {
            id: "upcoming_renewal",
            reportName: "Upcoming Renewal",
            filters: {
                subUser: true,
                user: true,
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
                subUser: true,
                user: true,
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
                user: true
            }
        },
        {
            id: "rfc",
            reportName: "RFC",
            filters: {
                subUser: true,
                user: true,
                date: { enabled: true }
            }
        }
    ],
    OEM:[
        {
            id: "activation_report",
            reportName: "Activation Report",
            filters: {
                user: true,
                dealer: true,
                date: { enabled: true }
            }
        }
    ],
    Distributor: [
        {
            id: "activation_report",
            reportName: "Activation Report",
            filters: {
                user: true,
                dealer: true,
                date: { enabled: true }
            }
        }
    ],
    Dealer:[
        {
            id: "activation_report",
            reportName: "Activation Report",
            filters: {
                user: true,
                dealer: true,
                date: { enabled: true }
            }
        }
    ]
};
