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
    const fitmentDetails = `
      Fitment Details:
      Certificate No: ${data.fitment.certNo}
      Issue Date: ${data.fitment.issueDate}
      Permit Holder Name: ${data.fitment.permitHolderName}
      Permit Holder Mobile: ${data.fitment.permitHolderMobile}
    `; // Add more keys as needed
    const docDefinition: any = {
      content: [
        {
          columns: [
            {
              // This column will contain the stacked text
              width: '*', // Take up available space
              stack: [
                {
                  text: 'STATE TRANSPORT DEPARTMENT\n',
                  style: 'headerTitle', // Increased font size
                  decoration: 'underline', // Underline the state title
                  alignment: 'center', // Center the title
                },
                {
                  text: '(VLTD FITMENT CERTIFICATE)', // New text below the state title
                  style: 'subHeaderTitle',
                  decoration: 'underline', // Underline the subheader
                  alignment: 'center', // Center the subheader
                },
              ],
            },
            {
              // This column will contain the QR code
              width: 'auto', // Adjust width to fit the QR code
              alignment: 'right', // Align QR code to the right
              qr: `${fitmentDetails.trim()}`, // QR code data with formatted fitment details
              fit: 100, // Size of the QR code
            },
          ],
          margin: [0, 0, 0, 10], // Adjust margins as needed
        },

        // Address and Subject
        {
          text: [
            { text: '\nTo,\n', style: 'content' },
            { text: 'The Registering Authority\n', style: 'content' },
            { text: `${data.rto.rtoName} - ${data.rto.rtoCode}\n`, style: 'boldContent' },
            { text: `${data.rto.stateName}\n\n`, style: 'content' },
            'Subject: Endorsement of VLTD Sr. No: ',
            { text: data.device.uid, bold: true },
            ' in Vehicle No: ',
            { text: data.vehicle.regNo, bold: true },
            '.\n\n',
          ],
        },

        {
          text: [
            { text: 'Respected Sir/Mam,\n ', style: 'boldContent' },
            'This is certified that Vehicle Location & Tracking Device (VLTD) fitted in-',
          ],
          style: 'content',
          alignment: 'left',
          // margin: [0, 10, 0, 10],
        },

        // Vehicle Details Table
        {
          columns: [
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'],
                body: [
                  [
                    {
                      text: 'Vehicle Details',
                      style: 'sectionHeader',
                      colSpan: 2,
                      fillColor: '#f2f2f2',
                      alignment: 'center'
                    },
                    {}
                  ],
                  [{ text: 'Registration No.', style: 'tableText' }, { text: data.vehicle.regNo, style: 'tableValue' }],
                  [{ text: 'Mfg. Year', style: 'tableText' }, { text: data.vehicle.mfgYear, style: 'tableValue' }],
                  [{ text: 'Engine No.', style: 'tableText' }, { text: data.vehicle.engine, style: 'tableValue' }],
                  [{ text: 'Chassis No.', style: 'tableText' }, { text: data.vehicle.chassis, style: 'tableValue' }],
                  [{ text: 'Make', style: 'tableText' }, { text: data.vehicle.make, style: 'tableValue' }],
                  [{ text: 'Model', style: 'tableText' }, { text: data.vehicle.model, style: 'tableValue' }],
                  [{ text: 'Category', style: 'tableText' }, { text: data.vehicle.category, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [0, 0, 10, 0],
            },
            // Fitment Details Table
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'],
                body: [
                  [
                    {
                      text: 'Fitment Details',
                      style: 'sectionHeader',
                      colSpan: 2,
                      fillColor: '#f2f2f2',
                      alignment: 'center'
                    },
                    {}
                  ],
                  [{ text: 'Certificate No.', style: 'tableText' }, { text: data.fitment.certNo, style: 'tableValue' }],
                  [{ text: 'Issue Date', style: 'tableText' }, { text: new Date(data.fitment.issueDate).toLocaleDateString(), style: 'tableValue' }],
                  [{ text: 'Valid Upto', style: 'tableText' }, { text: new Date(data.fitment.validUpto).toLocaleDateString(), style: 'tableValue' }],
                  [{ text: 'Owner Name', style: 'tableText' }, { text: data.fitment.permitHolderName, style: 'tableValue' }],
                  [{ text: 'Mobile No.', style: 'tableText' }, { text: data.fitment.permitHolderMobile, style: 'tableValue' }],
                  [{ text: 'Address', style: 'tableText' }, { text: data.rfc.address, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [10, 0, 0, 0],
            },
          ],
          margin: [0, 5, 0, 5],
        },

        // Device and ESIM Details
        {
          columns: [
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'],
                body: [
                  [
                    {
                      text: 'Device Details',
                      style: 'sectionHeader',
                      colSpan: 2,
                      fillColor: '#f2f2f2',
                      alignment: 'center'
                    },
                    {}
                  ],
                  [{ text: 'Mfg Name', style: 'tableText' }, { text: data.device.mfgName, style: 'tableValue' }],
                  [{ text: 'UID No.', style: 'tableText' }, { text: data.device.uid, style: 'tableValue' }],
                  [{ text: 'IMEI No.', style: 'tableText' }, { text: data.device.imeiNo, style: 'tableValue' }],
                  [{ text: 'Model', style: 'tableText' }, { text: data.device.modelNo, style: 'tableValue' }],
                  [{ text: 'Test Agency', style: 'tableText' }, { text: data.device.testAgency, style: 'tableValue' }],
                  [{ text: 'COP No.', style: 'tableText' }, { text: data.device.copNo, style: 'tableValue' }],
                  [{ text: 'COP Validity', style: 'tableText' }, { text: new Date(data.device.copValidity).toLocaleDateString(), style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [0, 0, 10, 0],
            },
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'],
                body: [
                  [
                    {
                      text: 'Esim Provider Details',
                      style: 'sectionHeader',
                      colSpan: 2,
                      fillColor: '#f2f2f2',
                      alignment: 'center'
                    },
                    {}
                  ],
                  [{ text: 'Provider', style: 'tableText' }, { text: data.esim.provider, style: 'tableValue' }],
                  [{ text: 'ICCID No.', style: 'tableText' }, { text: data.esim.iccid, style: 'tableValue' }],
                  [{ text: 'Primary Sim No.', style: 'tableText' }, { text: data.esim.pSimNo, style: 'tableValue' }],
                  [{ text: 'Operator', style: 'tableText' }, { text: data.esim.pOperator, style: 'tableValue' }],
                  [{ text: 'Fallback SimNo.', style: 'tableText' }, { text: data.esim.sSimNo, style: 'tableValue' }],
                  [{ text: 'Operator', style: 'tableText' }, { text: data.esim.sOperator, style: 'tableValue' }],
                  [{ text: 'eSim Validity', style: 'tableText' }, { text: new Date(data.esim.validity).toLocaleDateString(), style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [10, 0, 0, 0],
            },
          ],
          margin: [0, 5, 0, 5],
        },

        // RFC Details
        {
          columns: [
            {
              width: '100%',
              table: {
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                  [
                    {
                      text: 'RFC Details',
                      style: 'sectionHeader',
                      colSpan: 4,
                      fillColor: '#f2f2f2',
                      alignment: 'center'
                    },
                    {}, {}, {},
                  ],
                  [
                    { text: 'Name M/s ', style: 'tableText' }, { text: data.rfc.name, style: 'tableValue' },
                    { text: 'Organization', style: 'tableText' }, { text: data.rfc.orgName, style: 'tableValue' },
                  ],
                  [
                    { text: 'Mobile No.', style: 'tableText' }, { text: data.rfc.mobileNo, style: 'tableValue' },
                    { text: 'Email', style: 'tableText' }, { text: data.rfc.email, style: 'tableValue' },
                  ],
                  [
                    { text: 'Address', style: 'tableText' },
                    { text: data.rfc.address, style: 'tableValue', colSpan: 3 },
                    {}, {},
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#000000',
                vLineColor: () => '#000000',
              },
              margin: [0, 0, 0, 0],
            },
          ],
          margin: [0, 5, 0, 5],
        },

        // Footer
        {
          text: `\nthrough Retro Fitment Center (RFC) is approved by VLTD manufacture _________________ for RTO _________________ State Government Transport Department _________________ for fitment of Vehicle Location Tracking Device. It is working and sealed properly.`,
          style: 'tableText', // Apply custom smallText style
        },

        {
          text: '\n\nThanks and Regards\n\n(Auth. Seal & Sign.)\n',
          style: 'tableText',
        },

        {
          text: `Retro Center Name: ${data.rfc.orgName}`,
          style: 'tableText',
        },
      ],
      styles: {
        headerLogo: { fontSize: 10, bold: true, alignment: 'left' },
        headerTitle: {
          fontSize: 18, // Increased font size for the state title
          bold: true,
          margin: [0, 5, 0, 0], // Reduced top margin for less space
        },
        subHeaderTitle: {
          fontSize: 12, // Adjusted font size for the subheader
          margin: [0, 5, 0, 10], // Added margin for spacing below
        },
        sectionHeader: { fontSize: 12, bold: true },
        tableText: { fontSize: 10 },
        content: { fontSize: 12 },
        boldContent: { fontSize: 12, bold: true },
        tableValue: { fontSize: 10, bold: true }
      },
    };

    pdfMake.createPdf(docDefinition).download('VLTD_Fitment_Certificate.pdf');
  }
}
