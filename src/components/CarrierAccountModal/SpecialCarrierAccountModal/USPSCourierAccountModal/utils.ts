import dayjs from 'dayjs';

import {Store} from '@/queries/stores';

export const getEarliestStore = (stores: Store[] = []) => {
    const sortStores = [...stores];
    sortStores.sort((a, b) => (dayjs(a.metrics.created_at) < dayjs(b.metrics.created_at) ? -1 : 1));
    return sortStores[0];
};

export function storeAddressToBillingAddress(store: Store) {
    if (!store) return {};
    return {
        city: store.address.city,
        postal_code: store.address.postal_code,
        state: store.address.state,
        street1: store.address.address_line_1,
        street2: store.address.address_line_2,
        country: store.address.country,
    };
}
