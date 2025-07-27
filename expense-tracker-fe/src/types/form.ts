export interface FormField{
    name:string;
    label:string;
    type:'text' | 'number' | 'date' | 'select' | 'textarea' | 'date';
    placeholder?:string;
    options?: { value: string | number; label: string }[];
    required?: boolean;
    value?:any;
}


export interface FormConfig {
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    submitLabel?: string;
}