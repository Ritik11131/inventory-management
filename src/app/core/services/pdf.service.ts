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
    const docDefinition: any = {
      content: [
        // Header with State Logo and QR Code
        {
          columns: [
            { text: 'State Logo\n\n', style: 'headerLogo' },
            {
              text: 'QR Code',
              alignment: 'right',
              qr: `${data.vehicleRegNo} | ${data.serialNo} | ${data.ownerName}`,
              fit: 100,
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Title
        { text: '(VLTD FITMENT CERTIFICATE)', style: 'title', alignment: 'center' },

        // Address and Subject
        {
          text: [
            { text: '\nTo,\n', style: 'content' },
            { text: 'The Registering Authority\n', style: 'content' },
            { text: `${data.rtoName} - ${data.rtoCode}\n`, style: 'boldContent' },
            { text: `${data.stateName}\n\n`, style: 'content' },
            `Subject: Endorsement of VLTD Sr. No: ${data.serialNo} in Vehicle No: ${data.vehicleRegNo}.\n\n`,
          ],
        },

       {
  text: [
    { text: 'Respected Sir/Mam,\n ', style: 'boldContent' },
    'This is certified that Vehicle Location & Tracking Device (VLTD) fitted in-',
  ],
  style: 'content',
  alignment: 'left', // Align to the left
  margin: [0, 10, 0, 10], // Optional margin for spacing before the tables
},
        {
          columns: [
            // Vehicle Details Table
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'], // Adjust column widths
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
                  [{ text: 'Registration No.', style: 'tableText' }, { text: data.vehicleRegNo, style: 'tableValue' }],
                  [{ text: 'Mfg. Year', style: 'tableText' }, { text: data.mfgYear, style: 'tableValue' }],
                  [{ text: 'Engine No.', style: 'tableText' }, { text: data.engineNo, style: 'tableValue' }],
                  [{ text: 'Chassis No.', style: 'tableText' }, { text: data.chassisNo, style: 'tableValue' }],
                  [{ text: 'Make', style: 'tableText' }, { text: data.make, style: 'tableValue' }],
                  [{ text: 'Model', style: 'tableText' }, { text: data.model, style: 'tableText' }],
                  [{ text: 'Category', style: 'tableText' }, { text: data.category, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5, // Thin horizontal lines
                vLineWidth: () => 0.5, // Thin vertical lines
                hLineColor: () => '#000000', // Black horizontal lines
                vLineColor: () => '#000000', // Black vertical lines
              },
              margin: [0, 0, 10, 0], // Add space to the right
            },
            // Fitment Details Table
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'], // Adjust column widths
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
                  [{ text: 'Certificate No.', style: 'tableText' }, { text: data.certificateNo, style: 'tableValue' }],
                  [{ text: 'Issue Date', style: 'tableText' }, { text: data.issueDate, style: 'tableValue' }],
                  [{ text: 'Valid Upto', style: 'tableText' }, { text: data.validUpto, style: 'tableValue' }],
                  [{ text: 'Owner Name', style: 'tableText' }, { text: data.ownerName, style: 'tableValue' }],
                  [{ text: 'Mobile No.', style: 'tableText' }, { text: data.fitmentDate, style: 'tableValue' }],
                  [{ text: 'Address', style: 'tableText' }, { text: data.fitmentDate, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5, // Thin horizontal lines
                vLineWidth: () => 0.5, // Thin vertical lines
                hLineColor: () => '#000000', // Black horizontal lines
                vLineColor: () => '#000000', // Black vertical lines
              },
              margin: [10, 0, 0, 0], // Add space to the left
            },
          ],
          margin: [0, 5, 0, 5], // Add spacing above and below the combined tables
        },

        {
          columns: [
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'], // Adjust column widths
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
                  [{ text: 'Mfg Name', style: 'tableText' }, { text: data.vehicleRegNo, style: 'tableValue' }],
                  [{ text: 'UID No.', style: 'tableText' }, { text: data.mfgYear, style: 'tableValue' }],
                  [{ text: 'IMEI No.', style: 'tableText' }, { text: data.engineNo, style: 'tableValue' }],
                  [{ text: 'Model', style: 'tableText' }, { text: data.chassisNo, style: 'tableValue' }],
                  [{ text: 'Test Agency', style: 'tableText' }, { text: data.make, style: 'tableValue' }],
                  [{ text: 'COP No.', style: 'tableText' }, { text: data.model, style: 'tableValue' }],
                  [{ text: 'COP Validity', style: 'tableText' }, { text: data.category, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5, // Thin horizontal lines
                vLineWidth: () => 0.5, // Thin vertical lines
                hLineColor: () => '#000000', // Black horizontal lines
                vLineColor: () => '#000000', // Black vertical lines
              },
              margin: [0, 0, 10, 0], // Add space to the right
            },
            {
              width: '50%',
              table: {
                widths: ['33%', '67%'], // Adjust column widths
                body: [
                  [
                    {
                      text: 'Esim Provider Details',
                      style: 'sectionHeader',
                      colSpan: 2,
                      fillColor: '#f2f2f2', // Optional background color for header
                      alignment: 'center'
                    },
                    {}
                  ],
                  [{ text: 'Provider', style: 'tableText' }, { text: data.certificateNo, style: 'tableValue' }],
                  [{ text: 'ICCID No.', style: 'tableText' }, { text: data.issueDate, style: 'tableValue' }],
                  [{ text: 'Primary Sim No.', style: 'tableText' }, { text: data.validUpto, style: 'tableValue' }],
                  [{ text: 'Operator', style: 'tableText' }, { text: data.ownerName, style: 'tableValue' }],
                  [{ text: 'Fallback SimNo.', style: 'tableText' }, { text: data.fitmentDate, style: 'tableValue' }],
                  [{ text: 'Opeartor', style: 'tableText', }, { text: data.fitmentDate, style: 'tableValue' }],
                  [{ text: 'eSim Validity', style: 'tableText', }, { text: data.fitmentDate, style: 'tableValue' }],
                ],
              },
              layout: {
                hLineWidth: () => 0.5, // Thin horizontal lines
                vLineWidth: () => 0.5, // Thin vertical lines
                hLineColor: () => '#000000', // Black horizontal lines
                vLineColor: () => '#000000', // Black vertical lines
              },
              margin: [10, 0, 0, 0], // Add space to the left
            },

          ],
          margin: [0, 5, 0, 5], // Add spacing above and below the combined tables
        },


        {
          columns: [
            {
              width: '100%',
              table: {
                widths: ['25%', '25%', '25%', '25%'], // Adjusting column widths
                body: [
                  [
                    {
                      text: 'RFC Details',
                      style: 'sectionHeader',
                      colSpan: 4,
                      fillColor: '#f2f2f2', // Optional background color for header
                      alignment: 'center'

                    },
                    {},
                    {},
                    {},
                  ],
                  // Row 1: Two pairs of Label and Value in one row
                  [
                    { text: 'Name M/s ', style: 'tableText' }, { text: data.vehicleRegNo, style: 'tableValue' },
                    { text: 'Owner Name', style: 'tableText' }, { text: data.mfgYear, style: 'tableValue' },
                  ],
                  // Row 2: Two pairs of Label and Value in one row
                  [
                    { text: 'Mobile No.', style: 'tableText' }, { text: data.engineNo, style: 'tableValue' },
                    { text: 'Email', style: 'tableText' }, { text: data.chassisNo, style: 'tableValue' },
                  ],
                  // Row 3: Address, span across all columns
      [
        { text: 'Address', style: 'tableText', colSpan: 4 }, // Address spans across all columns
        {}, {}, {}  // Empty cells to fill the remaining columns
      ],
                ],
              },
              layout: {
                hLineWidth: () => 0.5, // Thin horizontal lines
                vLineWidth: () => 0.5, // Thin vertical lines
                hLineColor: () => '#000000', // Black horizontal lines
                vLineColor: () => '#000000', // Black vertical lines
              },
              margin: [0, 0, 10, 0], // Add space to the right
            },


          ],
          margin: [0, 5, 0, 5], // Add spacing above and below the combined tables
        },


        // Footer with Additional Details
        {
          text: `\nthrough Retro Fitment Center (RFC) is approved by VLTD manufacture _________________ for RTO _________________ State Government Transport Department _________________ for fitment of Vehicle Location Tracking Device. It is working and sealed properly.`,
          style: 'tableText', // Apply custom smallText style
        },
        
        { 
          text: '\n\nThanks and Regards\n\n(Auth. Seal & Sign.)\n', 
          style: 'tableText', // Apply custom smallText style
        },
        
        { 
          text: `Retro Center Name: ${data.retroCenterName}`, 
          style: 'tableText', // Apply custom smallText style
        },
      ],
      styles: {
        headerLogo: { fontSize: 10, bold: true, alignment: 'left' },
        title: { fontSize: 16, bold: true },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] },
        tableText: { fontSize: 10 }, // Decreased font size
        content: { fontSize: 12 },
        boldContent: { fontSize: 12, bold: true },
        tableValue: {fontSize:10, bold:true}
      },
    };

    pdfMake.createPdf(docDefinition).download('VLTD_Fitment_Certificate.pdf');
  }
}
