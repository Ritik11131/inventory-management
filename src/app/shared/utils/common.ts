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
  