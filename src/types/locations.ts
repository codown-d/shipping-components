export interface ILocationAddress {
    address_line_1: string;
    address_line_2: null | string;
    address_type: null | AddressType;
    city: string;
    company: null | string;
    country_code: string;
    name: string;
    phone: Phone;
    postal_code: string;
    state: null | string;
    verified?: null | boolean;
    contact_email?: string | null;
}

export enum AddressType {
    business = 'business',
    residential = 'residential',
}

interface Phone {
    country_code: string;
    number: string;
}
