import { Injectable } from '@angular/core';
import { activationReportColumns, ESimActivationLinkedDeviceColumns } from '../../shared/constants/columns';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private reports = [
        { id: "vehicle_status", name: "Vehicle Status", filters: { subUser: true, user: true } },
        { id: "complaints", name: "Complaints", filters: { subUser: true, user: true, date: { enabled: true } } },
        { id: "sos", name: "SOS", filters: { subUser: true, user: true, date: { enabled: true }, time: true } },
        { id: "overspeed", name: "Overspeed", filters: { subUser: true, user: true, date: { enabled: true } } },
        { id: "alert", name: "Alert", filters: { subUser: true, user: true, date: { enabled: true } } },
        { id: "vehicle_category", name: "Vehicle Category", filters: { subUser: true, user: true } },
        { id: "upcoming_renewal", name: "Upcoming Renewal", filters: { subUser: true, user: true, date: { enabled: true, type: "currentAndFuture" } } },
        { id: "expired", name: "Expired", filters: { subUser: true, user: true, date: { enabled: true, type: "currentAndPast" } } },
        { id: "inventory", name: "Inventory", filters: { user: true } },
        { id: "rfc", name: "RFC", filters: { subUser: true, user: true, date: { enabled: true } } },
        {
            id: "activation_report",
            reportName: "Activation Report",
            filters: {
                user: true,
                subUser: true,
                date: { enabled: true }
            },
            tableColumns: activationReportColumns,
            linkedDevicesColumns: ESimActivationLinkedDeviceColumns ,
            globalFilterFields:['user.orgname'],
            api:'mis/activation/ActivationReport',
        }
    ];

    getReports() {
        return this.reports;
    }

    getReportById(id: string) {
        return this.reports.find(report => report.id === id);
    }
}
