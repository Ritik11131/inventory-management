export const dynamicUserCreateFormFields = [
    {
        name: 'loginId',
        label: 'Login Id / Username',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('loginId'),
    },
    {
        name: 'password',
        label: 'Password',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('password'),
    },
    {
        name: 'confirm_password',
        label: 'Confirm Password',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('confirm_password'),
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
    },
    {
        name: 'mobileNo',
        label: 'Mobile No',
        type: 'text',
        hide: (hideFields: string[]) => hideFields.includes('mobileNo'),
    },
    {
        name: 'active',
        label: 'Status',
        type: 'dropdown',
        options: [
            { label: 'Active', value: 'Active', severity: 'success' },
            { label: 'Inactive', value: 'Inactive', severity: 'danger' },
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