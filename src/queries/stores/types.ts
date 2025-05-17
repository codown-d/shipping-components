export type StoresState = {
    stores: Store[];
};

export interface Store {
    id: string;
    app: App;
    address: Address;
    metrics: Metrics;
}
interface App {
    key: string;
    name: string;
    platform: string;
}
interface Address {
    address_line_1: string;
    address_line_2: string;
    address_line_3: null;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    latitude: null;
    longitude: null;
}
interface Metrics {
    created_at: string;
    updated_at: string;
}
