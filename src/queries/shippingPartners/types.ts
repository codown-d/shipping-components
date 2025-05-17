export interface ShippingPartnerCarrier {
    slug: string;
    name: string;
    qr_code?: {
        enabled: boolean;
        countries: string[];
    };
    pickup?: {
        enabled: boolean;
    };
    drop_off?: {
        supported: boolean;
        links?: {
            country: string;
            link: string;
        }[];
    };
    services: {
        service_type: string;
        service_name: string;
        enabled_sources: string[];
        countries: string[];
        supported_domestic: boolean;
        supported_international: boolean;
        offline_date?: string;
    }[];
}

export interface ShippingPartner {
    slug: string;
    name: string;
    account_create_method: string;
    configs?: Record<string, string>;
    carriers: ShippingPartnerCarrier[];
    tags: string[];
}

export interface ShippingPartnersResponse {
    meta: {
        code: number;
        type: string;
        message: string;
    };
    data: ShippingPartner[];
}
