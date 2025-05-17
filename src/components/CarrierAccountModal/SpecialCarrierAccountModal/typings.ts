export interface DhlCredentials {
    account_number: string;
    password: string;
    site_id: string;
}

export interface DhlSetting {
    show_account_on_waybill: boolean | null;
    fetch_odd_link: boolean | null;
}

export interface UserPhone {
    country_code: string;
    number: string;
}

export interface DhlAddress {
    contact_name: string;
    company_name: string | null;
    phone: UserPhone;
    address_line_1: string;
    address_line_2: string | null;
    address_line_3: string | null;
    city: string;
    state: string | null;
    postal_code: string | null;
    country: string;
    type: 'residential' | 'business' | null;
}

export interface CourierAccount {
    description: string;
    slug: string;
    credentials: DhlCredentials;
    settings: DhlSetting;
    address: DhlAddress;
}

export enum SuccessMessage {
    ADD = 'Carrier account set up successfully.',
    EDIT = 'Carrier account edit successfully.',
}

export enum METHOD {
    ADD = 'add',
    EDIT = 'edit',
}
