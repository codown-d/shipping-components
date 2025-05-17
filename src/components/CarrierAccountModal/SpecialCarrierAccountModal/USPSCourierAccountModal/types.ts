export enum METHOD {
    remove = 'remove',
    add = 'add',
    edit = 'edit',
}

export enum AddressSource {
    SHOPIFY = 'shopify_store_address',
    MANUAL = 'manual',
}

export interface BillingAddress {
    city: string;
    state: string;
    street1: string;
    street2: string;
    postal_code: string;
}
