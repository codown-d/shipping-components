import {ICourier, ProvidedCourier} from '@/queries/couriers';

export const courierComparator = (
    courier1: ICourier | ProvidedCourier,
    courier2: ICourier | ProvidedCourier,
    marketCouriersSlug: string[]
) => {
    // 展示的优先级：支持用户地区的物流商、合作的物流商、按照字母顺序展示
    const cooperationSlug = [
        'usps-discounted',
        'ups',
        'fedex',
        'dhl',
        'canada-post',
        'tnt',
        'bluedart',
        'sendle',
        'aramex',
        'omniparcel',
    ];

    const market1 = marketCouriersSlug.includes(courier1.slug);
    const market2 = marketCouriersSlug.includes(courier2.slug);

    if (market1 && market2) {
        return courier1.slug.localeCompare(courier2.slug);
    } else if (market1) {
        return -1;
    } else if (market2) {
        return 1;
    }

    const index1 = cooperationSlug.includes(courier1.slug)
        ? cooperationSlug.indexOf(courier1.slug)
        : cooperationSlug.length;

    const index2 = cooperationSlug.includes(courier2.slug)
        ? cooperationSlug.indexOf(courier2.slug)
        : cooperationSlug.length;

    return index1 - index2;
};
