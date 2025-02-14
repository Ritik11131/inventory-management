export interface DynamicUser {
    sno?: number | undefined;
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