import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);



@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generateFitmentCertificate(data: any): void {
    const docDefinition : any = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: 'VLTD FITMENT CERTIFICATE', style: 'title' },
                { text: '(Generated online in VAHAN)', style: 'subtitle' },
              ],
            },
            {
              qr: `${data.vehicleRegNo} | ${data.serialNo} | ${data.ownerName}`, // QR Code with dynamic content
              fit: 100, // QR Code size
              alignment: 'right',
            },
          ],
          margin: [0, 0, 0, 10], // Margin below the title block
        },
        { text: '\nTo,\n', style: 'content' },
        { text: 'The Registering Authority', style: 'content' },
        { text: ['Transport Department\n', { text: data.rto, bold: true }], style: 'content' },
        { text: ['\nVLTD Fitment date: ', { text: data.fitmentDate, bold: true }, '\n\n'], style: 'content' },
        {
          text: [
            'Subject: Endorsement of VLTD Serial No: ',
            { text: data.serialNo, bold: true },
            ' in the vehicle registration No: ',
            { text: data.vehicleRegNo, bold: true },
          ],
          style: 'content',
        },
        { text: '\n\nDear Sir,\n', style: 'content' },
        {
          text: [
            'It is to inform you that Mr/Ms. ',
            { text: data.ownerName, bold: true },
            ', R/o: ',
            { text: data.address, bold: true },
            ' is fitted with VLTD make: ',
            { text: data.vltdMake, bold: true },
            ', Model: ',
            { text: data.model, bold: true },
            ' at our retro-fitment center in his/her vehicle registration No: ',
            { text: data.vehicleRegNo, bold: true },
            ',\n\nChassis No: ',
            { text: data.chassisNo, bold: true },
            ',\nEngine No: ',
            { text: data.engineNo, bold: true },
            ',\nColor: ',
            { text: data.color, bold: true },
            ',\nVehicle Model: ',
            { text: data.vehicleModel, bold: true },
            '.\n\nOur retro-fitment center is approved by the state Government Transport Department for fitment of Vehicle Location Tracking Device.\n\nAccording to ICAT TAC/COP No: ',
            { text: data.tacCop, bold: true },
            ' Dated ',
            { text: data.tacDate, bold: true },
            '\n\nThe details of VLTD are shown below:',
          ],
          style: 'content',
        },
        {
          ul: [
            { text: `VLTD Serial No: ${data.serialNo}`, bold: true },
            { text: `VLTD IMEI No: ${data.imeiNo}`, bold: true },
            { text: `VLTD ICC ID: ${data.iccId}`, bold: true },
            { text: `Service Provider: ${data.serviceProvider}`, bold: true },
          ],
        },
        { text: '\n\nThanking You\n\n(Authorized Signatory)\n', style: 'content' },
        { text: ['Fitment Center Name: ', { text: data.fitmentCenterName, bold: true }], style: 'content' },
      ],
      styles: {
        title: { fontSize: 18, bold: true, alignment: 'left' },
        subtitle: { fontSize: 14, italics: true, alignment: 'left', margin: [0, 0, 0, 0] },
        content: { fontSize: 12, margin: [0, 5, 0, 5] },
      },
    };
    

    pdfMake.createPdf(docDefinition).download('VLTD_Fitment_Certificate.pdf');
  }


}
