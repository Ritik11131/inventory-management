import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {}

  private flattenObject(obj: any, prefix = ''): any {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const propName = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, this.flattenObject(obj[key], propName));
      } else {
        acc[propName] = obj[key];
      }
      
      return acc;
    }, {});
  }

  exportToCSV(data: any[], fileName: string): void {
    const flattenedData = data.map(item => this.flattenObject(item));
    const replacer = (key: any, value: any) => value === null ? '' : value;
    const header = Object.keys(flattenedData[0]);
    const csv = [
      header.join(','),
      ...flattenedData.map(row => 
        header.map(fieldName => 
          JSON.stringify(row[fieldName], replacer)).join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }

  exportToExcel(data: any[], fileName: string): void {
    const flattenedData = data.map(item => this.flattenObject(item));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'data': worksheet }, 
      SheetNames: ['data'] 
    };
    const excelBuffer: any = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `${fileName}.xlsx`);
  }
}