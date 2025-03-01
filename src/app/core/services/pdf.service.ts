import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) { }

  generateFitmentCertificate(data: any): void {
    const fitmentDetails = `
      Fitment Details:
      Certificate No: ${data.fitment.certNo}
      Issue Date: ${data.fitment.issueDate}
      Permit Holder Name: ${data.fitment.permitHolderName}
      Permit Holder Mobile: ${data.fitment.permitHolderMobile}
    `; // Add more keys as needed

    const currentDate = new Date().toLocaleString(); // Get the current date and time

    // Fetch the image and convert it to base64
    this.http.get('assets/images/grl_logo.png', { responseType: 'blob' }).subscribe(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;

        const docDefinition: any = {
          header: {
            columns: [
              {
                text: currentDate, // Time of download on the left
                alignment: 'left',
                fontSize: 8, // Very small font size
                margin: [10, 10, 0, 0] // Margin for spacing
              },
              {
                text: 'GRL Truck Master: Fitment Report', // Centered text
                alignment: 'center',
                fontSize: 8, // Very small font size
                margin: [0, 10, 0, 0] // Margin for spacing
              },
            ],
            margin: [0, 0, 0, 0], // No margin for header
          },
          content: [
            // Add Image at the top center
            {
              image: base64data,
              width: 150, // Adjust width as needed
              alignment: 'center', // Center the image
            },
            {
              text: '##27, I.D.C, Ind. Area, OP Jindal Marg, Hisar-12005 (Hry)', // Replace with actual address
              style: 'smallText',
              alignment: 'center',
              margin: [0, 5, 0, 0], // Margin for spacing
            },
            {
              text: [
                { text: '☏: +9187509-87700, ', style: 'smallText' }, // Phone number with icon
                { text: '💬: +9182952-00038', style: 'smallText' } // WhatsApp number with icon
              ],
              alignment: 'center',
              margin: [0, 5, 0, 0], // Margin for spacing
            },
            {
              text: [
                { text: 'Email: ', style: 'smallText' },
                { text: 'customercare@grlengineers.net', link: 'mailto:customercare@grlengineers.net', style: 'smallText' },
                { text: ', ', style: 'smallText' },
                { text: 'grlengineers.net', link: 'http://grlengineers.net', style: 'smallText' }
              ],
              alignment: 'center',
              margin: [0, 5, 0, 10], // Margin for spacing
            },
            {
              text: 'FITMENT CERTIFICATE', // Medium text
              style: 'mediumText', // Define this style in your styles section
              alignment: 'center',
              margin: [0, 10, 0, 0], // Margin for spacing
            },
            {
              text: 'AIS 140 (IRNSS)', // Small text
              style: 'smallText', // Use the existing smallText style
              alignment: 'center',
              margin: [0, 5, 0, 10], // Margin for spacing
            },
            {
              columns: [
                {
                  // This column will contain the "To" section
                  width: '33%', // Adjust width as needed
                  stack: [
                    { text: 'To,\n', style: 'content' },
                    { text: 'The Registering Authority\n', style: 'content' },
                    { text: `${data.rto.rtoName} - ${data.rto.rtoCode}\n`, style: 'boldContent' },
                    { text: `${data.rto.stateName}\n\n`, style: 'content' },
                  ],
                },
                {
                  // This column will contain the small text
                  width: '33%', // Adjust width as needed
                  stack: [
                    { text: 'This is Certified that VEHICLE TRACKING SYSTEM fitted as per details given below and its function checked and scaled in all manners.', style: 'smallText', margin: [0, 10, 0, 10] },
                  ],
                  alignment: 'center', // Center the text
                },
                {
                  // This column will contain the QR code
                  width: '34%', // Adjust width as needed
                  alignment: 'right', // Align QR code to the right
                  qr: `${fitmentDetails.trim()}`, // QR code data with formatted fitment details
                  fit: 100, // Size of the QR code
                },
              ],
              margin: [0, 0, 0, 10], // Adjust margins as needed
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
                      [{ text: 'Reg No', style: 'tableText' }, { text: data.vehicle.regNo, style: 'tableValue' }],
                      [{ text: 'Reg Date', style: 'tableText' }, { text: data.vehicle.mfgYear, style: 'tableValue' }],
                      [{ text: 'Engine No', style: 'tableText' }, { text: data.vehicle.engine, style: 'tableValue' }],
                      [{ text: 'Chassis No', style: 'tableText' }, { text: data.vehicle.chassis, style: 'tableValue' }],
                      [{ text: 'Vehicle Make', style: 'tableText' }, { text: data.vehicle.make, style: 'tableValue' }],
                      [{ text: 'Vehicle Model', style: 'tableText' }, { text: data.vehicle.model, style: 'tableValue' }],
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
                          text: 'Product Details',
                          style: 'sectionHeader',
                          colSpan: 2,
                          fillColor: '#f2f2f2',
                          alignment: 'center'
                        },
                        {}
                      ],
                      [{ text: 'VTS SR.No', style: 'tableText' }, { text: data.device.uid, style: 'tableValue' }],
                      [{ text: 'VTS Model', style: 'tableText' }, { text: data.device.modelNo, style: 'tableValue' }],
                      [{ text: 'Test Report No', style: 'tableText' }, { text: data.device.testAgency, style: 'tableValue' }],
                      [{ text: 'Mfg Name', style: 'tableText' }, { text: data.device.mfgName, style: 'tableValue' }],
                      [{ text: 'IMEI No.', style: 'tableText' }, { text: data.device.imeiNo, style: 'tableValue' }],
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
                          text: 'Service/ Esim Details',
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

            {
              text: 'PRODUCT SATISFACTION REPORT',
              style: 'sectionHeader', // Define this style in your styles section
              alignment: 'center',
              margin: [0, 20, 0, 10], // Margin for spacing
            },
            {
              table: {
                widths: ['100%'],
                body: [
                  [
                    {
                      text: 'This is to acknowledge confirm that we have got our vehicle bearing registration no Hr69E8027 VTS Device manufactured by GRL ENGINEERS bearing Sr.No VTS0048696. We have checked the performance of the vehicle after fitment of the said VTS device the unit is sealed and functioning as per norms laid out in AIS 140. We are satisfied with the performance of the unit in all respects. We undertake not to raise any dispute or any legal claims against GRL ENGINEERS in the event that the above mentioned seals are found broken/tampered.',
                      style: 'boxText', // Define this style in your styles section
                      margin: [10, 10, 10, 10], // Margin for spacing
                      alignment: 'justify', // Justify the text
                    }
                  ]
                ]
              },
              layout: {
                fillColor: '#f2f2f2', // Red background color for the box
                hLineWidth: () => 0, // No horizontal lines
                vLineWidth: () => 0, // No vertical lines
              },
              margin: [0, 10, 10, 10], // Margin for spacing
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
            tableValue: { fontSize: 10, bold: true },
            smallText: { fontSize: 9, margin: [0, 5, 0, 5] }, // Style for the small text
            mediumText: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] }, // Style for medium text
            boxText: { fontSize: 10, margin: [10, 10, 10, 10] } // Style for the box text
          },
        };

        pdfMake.createPdf(docDefinition).download('VLTD_Fitment_Certificate.pdf');
      };
      reader.readAsDataURL(blob); // Convert blob to base64
    });
  }
}