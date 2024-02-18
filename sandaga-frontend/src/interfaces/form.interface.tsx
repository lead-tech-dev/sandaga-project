import {ReactNode} from "react";

export interface RulesInterface {
    err_mandatory: string;
    err_regexp: string;
    mandatory: boolean;
    max_length?: number;
    regexp: string;
    readonly?: boolean;
}

export interface InputLocationField   {
    name: string;
    placeholder: string;
    type: string;
    id: string;
    hidden?: boolean;
    rules:  RulesInterface
    values?: {label: string; value: string}[]
}

export interface Fields  {
    name: string;
    placeholder: string;
    type: string;
    id: string;
    hidden?: boolean;
    rules:  RulesInterface
    values?: {label: string; value: string}[]
}
export interface FormFieldsInterface {
    name: string;
    title: string;
    link: {
        tile: string;
        question: string;
        href: string;
        icon?: ReactNode
    },
    btn: string;
    fields: Fields[];

}
export interface FormDataInterface {
   [key: string]: string;
}
export interface FormInterface {
    handleSubmitData: (e: any) => void,
    handleSearch?: (event: string) => void;
    suggestions?: any
    setSuggestions?: Function;
    address?: any;
    handleSelectAddress?: (selectedAddress: any) => void
    fields: FormFieldsInterface,
    loading: boolean,
    errors?: any,
    success?: boolean
    code?: string | null;

}

export interface SuccessInterface {
    email?: string;
    message1?: string;
    message2?: string;
    status: string;
    redirect?: string;
}
