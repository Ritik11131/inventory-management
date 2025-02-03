import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private reports = [
        { id: "vehicle_status", name: "Vehicle Status", filters: { rto: true, oem: true } },
        { id: "complaints", name: "Complaints", filters: { rto: true, oem: true, date: { enabled: true } } },
        { id: "sos", name: "SOS", filters: { rto: true, oem: true, date: { enabled: true }, time: true } },
        { id: "overspeed", name: "Overspeed", filters: { rto: true, oem: true, date: { enabled: true } } },
        { id: "alert", name: "Alert", filters: { rto: true, oem: true, date: { enabled: true } } },
        { id: "vehicle_category", name: "Vehicle Category", filters: { rto: true, oem: true } },
        { id: "upcoming_renewal", name: "Upcoming Renewal", filters: { rto: true, oem: true, date: { enabled: true, type: "currentAndFuture" } } },
        { id: "expired", name: "Expired", filters: { rto: true, oem: true, date: { enabled: true, type: "currentAndPast" } } },
        { id: "inventory", name: "Inventory", filters: { oem: true } },
        { id: "rfc", name: "RFC", filters: { rto: true, oem: true, date: { enabled: true } } }
    ];

    getReports() {
        return this.reports;
    }

    getReportById(id: string) {
        return this.reports.find(report => report.id === id);
    }
}
