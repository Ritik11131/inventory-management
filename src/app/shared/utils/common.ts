export const generateRandomString = (): string => {
    let captchaCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 7; i++) {
        captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return captchaCode;
}



export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export const downloadFile = (data: any, fileName: string, fileType: string): void => {
    let formattedData: string;
  
    // Handle different data formats
    if (Array.isArray(data)) {
      formattedData = data.join('\n'); // Join array with new line if it's an array
    } else if (typeof data === 'object') {
      formattedData = JSON.stringify(data, null, 2); // Stringify objects with formatting
    } else {
      formattedData = String(data); // Ensure any data type is converted to string
    }
  
    // Create a Blob object with the formatted data and the specified file type
    const blob = new Blob([formattedData], { type: fileType });
  
    // Check for URL.createObjectURL browser support
    if (window.URL && window.URL.createObjectURL) {
      // Create an object URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create an invisible anchor element and set download attributes
      const a = document.createElement('a');
      a.style.display = 'none'; // Hide the anchor element
      a.href = url;
      a.download = fileName;
  
      // Append the anchor, trigger download, and clean up
      document.body.appendChild(a);
      a.click();
  
      // Cleanup after the download
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Browser does not support the required Blob functionality.');
    }
}


export const parseFitemtCertificateData = (jsonString:any) => {
  try {
      // Parse the JSON string into an object
      const data = JSON.parse(jsonString);

      // Extract and structure the data
      const parsedData = {
          rfc: {
              name: data.rfc.name,
              email: data.rfc.email,
              address: data.rfc.address,
              orgName: data.rfc.orgName,
              mobileNo: data.rfc.mobileNo,
          },
          rto: {
              rtoId: data.rto.rtoId,
              rtoCode: data.rto.rtoCode,
              rtoName: data.rto.rtoName,
              stateId: data.rto.stateId,
              stateCode: data.rto.stateCode,
              stateName: data.rto.stateName,
          },
          esim: {
              iccid: data.esim.iccid,
              pSimNo: data.esim.pSimNo,
              sSimNo: data.esim.sSimNo,
              provider: data.esim.provider,
              validity: data.esim.validity,
              pOperator: data.esim.pOperator,
              sOperator: data.esim.sOperator,
          },
          device: {
              uid: data.device.uid,
              copNo: data.device.copNo,
              imeiNo: data.device.imeiNo,
              mfgName: data.device.mfgName,
              modelNo: data.device.modelNo,
              testAgency: data.device.testAgency,
              copValidity: data.device.copValidity,
          },
          fitment: {
              certNo: data.fitment.certNo,
              issueDate: data.fitment.issueDate,
              validUpto: data.fitment.validUpto,
              permitHolderName: data.fitment.permitHolderName,
              permitHolderMobile: data.fitment.permitHolderMobile,
          },
          vehicle: {
              make: data.vehicle.make,
              model: data.vehicle.model,
              regNo: data.vehicle.regNo,
              engine: data.vehicle.engine,
              chassis: data.vehicle.chassis,
              mfgYear: data.vehicle.mfgYear,
              category: data.vehicle.category,
          },
      };

      return parsedData;
  } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
  }
}
  