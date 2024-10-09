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
        name: 'statename',
        label: 'State Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('statename'),
    },
    {
        name: 'statecode',
        label: 'State Code',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('statecode'),
    }
];

export const rtoCreateFormFields : FormFields[] = [
    {
        name: 'stateid',
        label: 'State Name',
        type: 'dropdown',
        options: [],
        dropdownKeys:{},
        hide: (hideFields: string[]) => hideFields.includes('stateid'),
    },
    {
        name: 'rtocode',
        label: 'RTO Code',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('rtocode'),
    },
    {
        name: 'rtoname',
        label: 'RTO Name',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('rtoname'),
    }
];