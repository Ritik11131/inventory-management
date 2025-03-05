export interface FormFields {
    name: string;
    label?: string;
    type: string;
    placeholder?: string;
    hide?: (hideFields: string[]) => boolean;
    validation?: boolean | ((data: any) => boolean);
    dependent?:string[];
    options?: any[]; // Only for dropdown
    dropdownKeys?:any
}