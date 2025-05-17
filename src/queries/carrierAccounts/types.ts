import {
    DhlAddress as Address,
    DhlSetting,
} from '@/components/CarrierAccountModal/SpecialCarrierAccountModal/typings';

// shipping-service 相关
export interface CourierAccountShippingServices {
    shipping_services: ShippingServiceSetting[];
}

export interface ShippingServiceSetting extends ShippingServiceMeta {
    enabled: boolean;
}

interface ShippingServiceMeta {
    service_type: string;
    name: string;
    from_country?: string;
}

// carrier account 相关
export interface CourierAccountsData {
    courier_accounts: CourierAccount[];
}

export enum CourierAccountType {
    default = 'default',
    user = 'user',
}

export interface ISettings {
    preferred_currency?: string | null;
    show_account_on_waybill?: boolean | null;
    fetch_odd_link?: boolean | null;
}

export type ICommonSettingType = Record<string, boolean | null>;

export interface CourierAccount {
    id: string;
    account_balance: number | null;
    status: string;
    shipping_services: ShippingServiceSetting[];
    slug: string;
    description: string;
    timezone: string;
    type: CourierAccountType;
    created_at: string;
    updated_at: string;
    credentials?: CourierCredentials & ICommonCredentialsType;
    account_country?: string;
    shipping_address?: CourierShippingAddress;
    address?: Address;
    settings?: ISettings & ICommonSettingType;
    invoice?: IInvoiceFiledValues;
    enabled: boolean;
    custom_fields: {
        label_qrcode_enabled?: boolean;
        shipment_label_enabled?: boolean;
    };
    originSlugName: string;
    version: number;
    upgrade_version: number | null;
}

export type ICommonCredentialsType = Record<string, boolean>;

export interface CourierCredentials {
    account_number?: string;
    key?: string;
    password?: string;
    meter_number?: string;
    site_id?: string;
}

export interface CourierShippingAddress {
    first_name: string;
    last_name: string;
    company_name: string | null;
    phone: UserPhone;
    email: string;
    street1: string;
    street2: string | null;
    city: string;
    state: string | null;
    postal_code: string | null;
    country: string;
}

export interface UserPhone {
    country_code: string;
    number: string;
}

// 表单相关
interface IFieldData {
    name: string;
    type: string;
    label: string;
    enum: string[];
    required: boolean;
    max_length: number | null;
    min_length: number | null;
    category?: CredentialCategory;
    placeholder?: string;
    helpText?: string;
    help_text?: string;
    hidden?: boolean;
}

export type CredentialCategory =
    | 'Credentials - hidden'
    | 'Credentials - not hidden'
    | 'Settings'
    | null;

export enum FormatType {
    TIME = 'time',
}

type TypeIsArray<T extends string> = T extends 'object' ? IField[] : undefined;

// 基础类型 + 自定义类型
export type IFieldType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'currency'
    | 'address'
    | 'phone'
    | 'select'
    | 'date';

export interface FormattedFiled extends IField {
    property?: Record<string, IField> | null;
}

// Include front-end custom fields to generate specific element
export interface IField extends Omit<IFieldData, 'type' | 'enum' | 'max_length' | 'min_length'> {
    title?: string;
    type: IFieldType;
    options?: {label: string; value: string}[];
    props?: Record<string, any>;
    enum?: string[];
    max_length?: number | null;
    min_length?: number | null;
    subfields?: string[]; // 该 filed 下包含的 subfileds
    subfield?: boolean; // 是否为 subfiled
    format?: FormatType | null;
    edit?: boolean;
    fields?: TypeIsArray<FormattedFiled['type']>;
}

export interface ICarrierAccountPayload {
    description?: string;
    slug?: string;
    timezone?: string;
    credentials?: CourierCredentials;
    address?: Partial<Address>;
    invoice?: IInvoiceFiledValues;
    // dhl 场景
    settings?: DhlSetting;
    version?: number;
}

export interface IInvoiceFiledValues {
    invoice_amount: number;
    invoice_number: string;
    invoice_currency: string;
    invoice_date: string;
    control_id?: string | null;
    enabled?: boolean; //custom field to judge if send invoice, DO NOT pass to API
}

// carrier 相关请求参数
export interface ICarrierAccountSpecificPayload {
    id?: string;
    enabled?: boolean;
    custom_fields?: {
        label_qrcode_enabled?: boolean;
        shipment_label_enabled?: boolean;
    };
}

export type BatchCarrierAccountPayload = {
    id: string;
    enabled: boolean;
}[];

export interface USPSCarrierAccountPayload {
    credit_card: {
        number?: string;
        expiration_month?: string;
        holder_name?: string;
        expiration_year?: string;
        security_code?: string;
        billing_address?: {
            city: string;
            country: string;
            postal_code: string;
            source: string;
            state: string;
            street1: string;
            street2: string;
        };
    };
    description: string;
    slug: string;
}

export interface DeleteCarrierAccountPayload {
    accountId: string;
}
