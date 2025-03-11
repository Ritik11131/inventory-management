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
  
    // Fetch the first image and convert it to base64
    const image1$ : any = this.http.get('assets/images/grl_logo.png', { responseType: 'blob' }).toPromise();
    // Fetch the second image and convert it to base64
    const image2$ : any = this.http.get('assets/images/track_truck_logo.png', { responseType: 'blob' }).toPromise();
  
    Promise.all([image1$, image2$]).then(([blob1, blob2]) => {
      const reader1 = new FileReader();
      const reader2 = new FileReader();
  
      reader1.onloadend = () => {
        const base64data1 = reader1.result as string;
  
        reader2.onloadend = () => {
          const base64data2 = reader2.result as string;
  
          const docDefinition: any = {
            content: [
              {
                columns: [
                  {
                    // This column will contain the first image
                    width: '33%', // Adjust width as needed
                    stack: [
                      {
                        image: base64data1,
                        width: 100, // Adjust width as needed
                        alignment: 'center', // Center the image
                      },
                    ],
                  },
                  {
                    // This column will contain the second image
                    width: '33%', // Adjust width as needed
                    stack: [
                      {
                        image: base64data2,
                        width: 100, // Adjust width as needed
                        alignment: 'center', // Center the image
                        margin: [0, 0, 0, 10], // Add bottom margin of 10
                      },
                      {
                          text: '#27, I.D.C, Ind. Area, OP Jindal Marg, Hisar-12005 (Hry)', // Replace with actual address
                          style: 'smallText',
                          alignment: 'center',
                          margin: [0, 5, 0, 0], // Margin for spacing
                      },
                      {
                        text: [
                          { text: '+918750987700, ', style: 'smallText' }, // Phone number with icon
                          { text: '+918295200038', style: 'smallText' } // WhatsApp number with icon
                        ],
                        alignment: 'center',
                        margin: [0, 5, 0, 0], // Margin for spacing
                      },
                      {
                        text: [
                          { text: 'customercare@grlengineers.net', link: 'mailto:customercare@grlengineers.net', style: 'smallText' },
                          { text: 'https://www.grlengineers.net', link: 'https://grlengineers.net', style: 'smallText' }
                        ],
                        alignment: 'center',
                        margin: [0, 5, 0, 10], // Margin for spacing
                      },
                    ],
                  },
                  {
                    // This column will contain the QR code
                    width: '30%', // Adjust width as needed
                    alignment: 'right', // Align QR code to the right
                    qr: `${fitmentDetails.trim()}`, // QR code data with formatted fitment details
                    fit: 100, // Size of the QR code
                  },
                ],
                margin: [0, 0, 0, 10], // Adjust margins as needed
              },
              // {
              //   text: '#27, I.D.C, Ind. Area, OP Jindal Marg, Hisar-12005 (Hry)', // Replace with actual address
              //   style: 'smallText',
              //   alignment: 'center',
              //   margin: [0, 5, 0, 0], // Margin for spacing
              // },
              // {
              //   text: [
              //     { text: '+918750987700, ', style: 'smallText' }, // Phone number with icon
              //     { text: '+918295200038', style: 'smallText' } // WhatsApp number with icon
              //   ],
              //   alignment: 'center',
              //   margin: [0, 5, 0, 0], // Margin for spacing
              // },
              // {
              //   text: [
              //     { text: 'customercare@grlengineers.net', link: 'mailto:customercare@grlengineers.net', style: 'smallText' },
              //     { text: ', ', style: 'smallText' },
              //     { text: 'grlengineers.net', link: 'http://grlengineers.net', style: 'smallText' }
              //   ],
              //   alignment: 'center',
              //   margin: [0, 5, 0, 10], // Margin for spacing
              // },
              // {
              //   text: 'FITMENT CERTIFICATE', // Medium text
              //   style: 'mediumText', // Define this style in your styles section
              //   alignment: 'center',
              //   margin: [0, 10, 0, 0], // Margin for spacing
              // },
              // {
              //   text: 'AIS 140 (IRNSS)', // Small text
              //   style: 'smallText', // Use the existing smallText style
              //   alignment: 'center',
              //   margin: [0, 5, 0, 10], // Margin for spacing
              // },
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
                    ],
                    alignment: 'center', // Center the text
                  },
                  {
                    // This column will contain the small text
                    width: '33%', // Adjust width as needed
                    stack: [
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
                    ],
                    alignment: 'center', // Center the text
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
                    margin: [5, 0, 0, 0],
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
                        text: `It is acknowledged that the vehicle registration number ${data.vehicle.regNo} is fitted with a VTS device manufactured by GRL Engineers Pvt Ltd, identified by serial number ${data.device.uid}. The VTS device has been verified to operate as per AIS 140 norms. The manufacturing company GRL Engineers Pvt Ltd will not be responsible for any tampering with the device.`,
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
                      widths: ['16.6666666667%','16.6666666667%','16.6666666667%','16.6666666667%','16.6666666667%','16.6666666667%'], // Three equal columns
                      body: [
                        [
                          { text: 'Dealer Name:', style: 'tableText' }, 
                          { text: data.rfc.name, style: 'tableValue' },
                          { text: 'Dealer Mob No:', style: 'tableText' }, 
                          { text: data.rfc.mobileNo, style: 'tableValue' },
                          { text: 'Dealer Address:', style: 'tableText' }, 
                          { text: data.rfc.address, style: 'tableValue' },
                        ],
                        [
                          { text: 'Installed by:', style: 'tableText' }, 
                          { text: data.rfc.deviceInstalledBy, style: 'tableValue' }, // Value for Device Installed by
                          { text: 'Dealer Sign:', style: 'tableText' }, 
                          { text: '____________', style: 'tableValue', alignment: 'center' }, // Placeholder for Dealer Sign
                          { text: 'RTA/MVI/STA:', style: 'tableText' }, 
                          { text: '____________', style: 'tableValue', alignment: 'center' }, // Placeholder for RTO Sign
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
        reader2.readAsDataURL(blob2); // Convert second blob to base64
      };
      reader1.readAsDataURL(blob1); // Convert first blob to base64
    });
  }
}