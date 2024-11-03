import { FormFields } from "../interfaces/forms";

export const dynamicUserCreateFormFields : FormFields[] = [
    {
        name: 'loginId',
        label: 'Login Id',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('loginId'),
        validation:true
    },
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        hide: (hideFields: string[]) => hideFields.includes('password'),
        validation: (data: any) => { return data.password === data.confirm_password },
        dependent: ['confirm_password']
    },
    {
        name: 'confirm_password',
        label: 'Confirm Password',
        type: 'confirm_password',
        hide: (hideFields: string[]) => hideFields.includes('confirm_password'),
        validation: (data: any) => { return data.password === data.confirm_password },
        dependent: ['password']
    },
    {
        name: 'orgName',
        label: 'Org Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('orgName'),
    },
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('name'),
    },
    {
        name: 'emailId',
        label: 'Email',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('emailId'),
        validation:true
    },
    {
        name: 'mobileNo',
        label: 'Mobile No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('mobileNo'),
        validation:true
    },
    {
        name: 'active',
        label: 'Status',
        type: 'dropdown',
        options: [
            { label: 'Active', value: 'Active', severity: 'success' },
            { label: 'In Active', value: 'Inactive', severity: 'danger' },
        ],
        hide: (hideFields: string[]) => hideFields.includes('active'),
    },
    {
        name: 'alternatemobileno',
        label: 'Alternate Mob No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('alternatemobileno'),
    },
    {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        hide: (hideFields: string[]) => hideFields.includes('address'),
    },
];


export const stateCreateFormFields : FormFields[] = [
    {
        name: 'stateName',
        label: 'State Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('statename'),
    },
    {
        name: 'stateCode',
        label: 'State Code',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('statecode'),
    }
];


export const deviceModelFormFields : FormFields[] = [
    {
        name: 'OemId',
        label: 'Select OEM',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('OemId'),
    },
    {
        name: 'ModelName',
        label: 'Model Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('ModelName'),
    }
];


export const deviceCreateFormFields : FormFields[] = [
    {
        name: 'model',
        label: 'Select Model',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('model'),
    },
    {
        name: 'sno',
        label: 'Serial No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('sno'),
        validation:true
    },
    {
        name: 'imei',
        label: 'IMEI No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('imei'),
        validation:true
    },
    {
        name: 'iccid',
        label: 'ICCID No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('iccid'),
        validation:true
    }
];

export const deviceTransferInventoryFormFields : FormFields[] = [
    {
        name:'user',
        label:'Select Distributor',
        type:'dropdown',
        options:[],
        dropdownKeys:{},
        placeholder:'Select a Distributor',
        hide: (hideFields: string[]) => hideFields.includes('user'),
    },
    {
        name: 'no_of_device',
        label: 'Number of Devices to Transfer',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('no_of_device'),
    },
]


export const rtoCreateFormFields : FormFields[] = [
    {
        name: 'state',
        label: 'State Name',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('state'),
    },
    {
        name: 'rtoCode',
        label: 'RTO Code',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('rtoCode'),
    },
    {
        name: 'rtoName',
        label: 'RTO Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('rtoName'),
    }
];


export const simProviderFormFields : FormFields[] = [
    {
        name: 'providerName',
        label: 'Provider Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('providerName'),
    }
]

export const deviceActivationFormFields : FormFields[] = [
    {
        name:'sim',
        label:'Select Provider',
        type:'dropdown',
        options:[],
        dropdownKeys:{},
        placeholder:'Select a Provider',
        hide: (hideFields: string[]) => hideFields.includes('sim'),
    }
]


export const vehicleCategoryFormFields : FormFields[] = [
    {
        name: 'name',
        label: 'Category Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('name'),
    }
]


export const linkRtoFormFields : FormFields[] = [
    {
        name: 'stateid',
        label: 'Select State',
        placeholder: 'Select a state',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('stateid'),
    },
    {
        name: 'rtoName',
        label: 'Link/Unlink RTO',
        type: 'pickList',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('rtoName'),
    }
]


export const bulkUploadDeviceFormFields : FormFields[] = [
    {
        name: 'model',
        label: 'Select Model',
        placeholder: 'Select a model',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('model'),
    },
    {
        name: 'file',
        label: 'Choose File',
        type: 'file',
        hide: (hideFields: string[]) => hideFields.includes('file'),
    }
]



export const fitmentFormFields : any[] = [
    {
      header: 'Vehicle Details',
      fields: [
        {
          type: 'dropdown', name: 'isOld', label: 'Vehicle Type', placeholder: 'Select a Vehicle Type',
          options: [
            { label: 'Old', value: true},
            { label: 'New', value: false},
          ],
        },
        { type: 'text', name: 'vehicleNo', label: 'Vehicle No', validation: true, placeholder: 'Enter your Vehicle No' },
        { type: 'text', name: 'chassisNo', label: 'Chassis No', placeholder: 'Enter your Chassis No' },
        { type: 'text', name: 'engineNo', label: 'Engine No', placeholder: 'Enter your Engine No' },
        { type: 'text', name: 'vehicleMake', label: 'Vehicle Make', placeholder: 'Enter Vehicle Make' },
        { type: 'text', name: 'vehicleModel', label: 'Vehicle Model', placeholder: 'Enter Vehicle Model' },
        { type: 'text', name: 'manufacturingYear', label: 'Manufacturing Year', placeholder: 'Enter Manufacturing Year' },
        { type: 'dropdown', name: 'vehicleCategory', label: 'Vehicle Category',  placeholder: 'Select a Vehicle Category',
          options: [],
          dropdownKeys:{} 
        },


      ]
    },
    {
      header: 'RTO Details',
      fields: [
        {
          name: 'state',
          label: 'Select State',
          placeholder: 'Select a state',
          type: 'dropdown',
          options: [],
          dropdownKeys:{},
          hide: (hideFields: string[]) => hideFields.includes('stateid'),
      },
      {
        name: 'rto',
        label: 'Select RTO',
        placeholder: 'Select a Rto',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('rto'),
    },
      ]
    },
    {
      header: 'Device Details',
      fields: [
        { type: 'non-editable', name: 'sno', label: 'Device Sno.', placeholder: 'Enter Device Serial No.', value:'' },
        { type: 'non-editable', name: 'iccid', label: 'Iccid No', placeholder: 'Enter ICCID No.', value:'' },
        { type: 'non-editable', name: 'primaryOpt', label: 'Primary Sim Operator', placeholder: 'Enter Sim Operator 1', value:'' },
        { type: 'non-editable', name: 'primarySimNo', label: 'Primary Sim No.', placeholder: 'Enter Sim No. 1', value:'' },
        { type: 'non-editable', name: 'secondaryOpt', label: 'Secondary Sim Operator',  placeholder: 'Enter Sim Operator 2', value:'' },
        { type: 'non-editable', name: 'secondarySimNo', label: 'Secondary Sim No.',  placeholder: 'Enter Sim No. 2', value:'' },
        { type: 'non-editable', name: 'activationOn', label: 'Activation Date', placeholder: 'Select Activation Date', date: true ,value:'' },
        { type: 'non-editable', name: 'primaryValidTill', label: 'Primary Sim Validity', placeholder: '', date: true ,value:'' },
        { type: 'non-editable', name: 'secondaryValidTill', label: 'Secondary Sim Validity', placeholder: '', date: true ,value:'' }
      ]
    },
    {
      header: 'Permit Holder Details',
      fields: [
        { type: 'text', name: 'permitHolderName', label: 'Permit Holder Name', placeholder: 'Enter Permit Holder Name' },
        { type: 'text', name: 'permitHolderMobile', label: 'Contact No', placeholder: 'Enter Contact No' },
        { type: 'text', name: 'aadhaarNumber', label: 'Aadhar No', placeholder: 'Enter Aadhar No' }
      ]
    }
  ]