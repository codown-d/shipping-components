import {CourierAccount, IField} from '../carrierAccounts/types';
import {IPreAssignedNumberConfig} from '../trackingNumber/types';

import {CarrierAccountItem} from '@/components/CarrierAccountManagerModal/types';

export interface ICourierInfo {
    slug: string;
    accountId: string | undefined;
    upgradeVersion?: number | null;
}

export interface CourierAccountsSchema {
    version: number;
    oauth_enabled: boolean;
    add: boolean;
    edit: boolean;
    fields: IField[];
    upgrade_fields: IField[];
}

export interface CourierFull {
    slug: string;
    name: string;
    ship_from: string;
    ship_to: string;
    enabled: null;
    courier_service_types: CourierServiceTypes[];
    operations: Operations;
    characteristics: Characteristics;
    courier_box_types?: CourierBoxType[];
    internal_cancel_label: boolean;
    template_mapping: boolean;
    box_types: BoxTypes;
    service_options: ServiceOptions;
    service_types: ServiceTypes;
    pre_assigned_number_configs: IPreAssignedNumberConfig[];
    credential_fields: IField[];
    guide: string;
    paper_sizes: string[];
    highlights: null; // to be confirm the type
    account_address: boolean;
    courier_accounts: CourierAccountsSchema[];
}

// get from courier
export interface Operations {
    'post@labels': boolean;
    'post@cancel-labels': boolean;
    'post@admin/cancel-labels': boolean;
    'post@rates': boolean;
    'post@manifests': boolean;
}

export interface Courier {
    slug: string;
    name: string;
    operations: Operations;
    shipFrom: string;
    shipTo: string;
    trackingNumbers: boolean;
    order: number | null;
}

export interface Characteristics {
    'post@labels': PostLabels;
}

export interface PostLabels {
    returnShipment: boolean[];
}

export interface BoxTypes {
    [key: string]: string;
}

export interface ServiceOptions {
    signature: boolean;
    insurance: boolean;
    cod: boolean;
}

export interface ServiceTypes {
    [key: string]: string;
}

export interface BoxDimension {
    width: number;
    height: number;
    depth: number;
}

export interface CourierBoxType {
    box_name: string;
    box_type: string;
    box_size_cm: BoxDimension;
    box_size_in: BoxDimension;
}

export interface CourierServiceTypes {
    service_type: string;
    service_name?: string;
    'rates.service_name'?: string;
    'ship_from.country'?: string;
}

// get from courierV3
export interface IBoxDimension {
    width: number;
    height: number;
    depth: number;
}

export interface ICourierBoxType {
    box_name: string;
    box_type: string;
    box_size_cm: IBoxDimension;
    box_size_in: IBoxDimension;
}

export interface ICourierServiceTypes {
    service_type: string;
    service_name?: string;
    'rates.service_name'?: string;
    'ship_from.country'?: string;
}

export interface IOperations {
    'post@labels': boolean;
    'post@cancel-labels': boolean;
    'post@admin/cancel-labels': boolean;
    'post@rates': boolean;
    'post@manifests': boolean;
}

interface ICustoms {
    purpose: string[];
    terms_of_trade: string[];
}

export interface ICourier {
    name: string;
    slug: string;
    tracking_numbers: boolean;
    courier_box_types: ICourierBoxType[];
    box_types: ICourierBoxType[];
    courier_service_types: ICourierServiceTypes[];
    operations: IOperations;
    customs: ICustoms;
    rc_enabled: boolean;
    market: string;
    qr_code: {
        enabled: boolean;
        usage: string | 'oneOf' | 'both';
        countries?: string[];
    };
    courier_accounts: (CourierAccount & {upgrade_due_date: string | null})[];
}

export interface ICouriersData {
    all_couriers: ICourier[]; // 从之前 v3/carriers 迁移到该 v4/me/carriers
    couriers: ProvidedCourier[]; // 之前 v4/me/carriers 的数据
}

export interface ProvidedCourier {
    slug: string;
    name: string;
    type: string;
}

// canada-post 相关
export interface RegistrationUrlRequest {
    return_url: string;
}

export interface RegistrationUrlResponse {
    registration_url: string;
}

export enum RegistrationStatus {
    'SUCCESS',
    'CANCELLED',
    'BAD_REQUEST',
    'UNEXPECTED_ERROR',
    'UNAUTHORIZED',
    'SERVICE_UNAVAILABLE',
}

export interface CredentialsRequest {
    token_id: string;
    registration_status: RegistrationStatus;
}

export interface CredentialsResponse {
    api_key: string;
    contract_id: string;
    customer_number: string;
    method_of_payment: string;
}
