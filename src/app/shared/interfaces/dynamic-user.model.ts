export interface DynamicUser {
    sno?: number;
    loginId: string;
    password: string;
    name: string;
    mobileNo: string;
    alternatemobileno:string;
    address:string;
    emailId: string;
    orgName: string;
    userType: string;
    active?: boolean;
}


export interface DynamicUserField {
    name: string;
    label: string;
    type: string;
    hide: (hideFields: string[]) => boolean;
    validation?: boolean | ((data: any) => boolean);
    options?: { label: string; value: string; severity: string }[]; // Only for dropdown
  }