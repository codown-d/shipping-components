import {ShippingPartner} from './types';

import useQuery from '@/hooks/useQuery';
import useStableCallback from '@/hooks/utils/useStableCallback';
import {request} from '@/utils/network';

interface ShippingPartnersQueryParams {
    country?: string;
    name?: string;
}

// MOCK_DATA_MARKER: 以下是模拟数据，仅用于开发阶段，生产环境将使用真实API数据
// 将来删除模拟数据时，请搜索 MOCK_DATA_MARKER 标识
const mockShippingPartners: ShippingPartner[] = [
    {
        slug: 'easyship',
        name: 'Easyship',
        account_create_method: 'request',
        configs: {
            stripe_public_key: '31231',
        },
        carriers: [
            {
                slug: 'fedex',
                name: 'FedEx',
                qr_code: {
                    enabled: true,
                    countries: ['USA', 'CAN'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [{country: 'USA', link: '123'}],
                },
                services: [
                    {
                        service_type: 'airspeed_firstmile',
                        service_name: 'Airspeed First Mile Delivery',
                        enabled_sources: ['shipping', 'returns', 'warranty'],
                        countries: ['USA'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: '2025-04-17',
                    },
                ],
            },
            {
                slug: 'dhl',
                name: 'DHL Express',
                qr_code: {
                    enabled: true,
                    countries: ['DEU', 'GBR', 'FRA'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'express',
                        service_name: 'DHL Express',
                        enabled_sources: ['shipping', 'returns'],
                        countries: ['DEU', 'GBR', 'FRA', 'ITA', 'ESP'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: ['popular'],
    },
    {
        slug: 'vesyl',
        name: 'VESYL',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'usps',
                name: 'USPS',
                qr_code: {
                    enabled: true,
                    countries: ['USA'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'priority',
                        service_name: 'Priority Mail',
                        enabled_sources: ['shipping', 'returns'],
                        countries: ['USA'],
                        supported_domestic: true,
                        supported_international: false,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: [],
    },
    {
        slug: 'gps',
        name: 'GPS',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'royal-mail',
                name: 'Royal Mail',
                qr_code: {
                    enabled: true,
                    countries: ['GBR'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'standard',
                        service_name: 'Royal Mail Standard',
                        enabled_sources: ['shipping', 'returns'],
                        countries: ['GBR'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: [],
    },
    {
        slug: 'shippo',
        name: 'Shippo',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'ups',
                name: 'UPS',
                qr_code: {
                    enabled: true,
                    countries: ['USA', 'CAN'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'ground',
                        service_name: 'UPS Ground',
                        enabled_sources: ['shipping'],
                        countries: ['USA', 'CAN'],
                        supported_domestic: true,
                        supported_international: false,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: ['popular'],
    },
    {
        slug: 'pitney-bowes',
        name: 'Pitney&Bowes',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'dpd',
                name: 'DPD',
                qr_code: {
                    enabled: true,
                    countries: ['FRA', 'DEU'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'standard',
                        service_name: 'DPD Standard',
                        enabled_sources: ['shipping'],
                        countries: ['FRA', 'DEU', 'ITA'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: [],
    },
    {
        slug: 'arvato',
        name: 'Arvato',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'sf-express',
                name: 'SF Express',
                qr_code: {
                    enabled: true,
                    countries: ['CHN', 'HKG'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'express',
                        service_name: 'SF Express',
                        enabled_sources: ['shipping'],
                        countries: ['CHN', 'HKG', 'TWN'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: [],
    },
    {
        slug: 'blackbelt',
        name: 'Blackbelt',
        account_create_method: 'request',
        carriers: [
            {
                slug: 'australia-post',
                name: 'Australia Post',
                qr_code: {
                    enabled: true,
                    countries: ['AUS'],
                },
                pickup: {
                    enabled: true,
                },
                drop_off: {
                    supported: true,
                    links: [],
                },
                services: [
                    {
                        service_type: 'standard',
                        service_name: 'Australia Post Standard',
                        enabled_sources: ['shipping'],
                        countries: ['AUS', 'NZL'],
                        supported_domestic: true,
                        supported_international: true,
                        offline_date: undefined,
                    },
                ],
            },
        ],
        tags: [],
    },
];

export const useGetShippingPartners = (params: ShippingPartnersQueryParams = {}) => {
    const queryString = new URLSearchParams();

    if (params.country) {
        queryString.append('country', params.country);
    }

    if (params.name) {
        queryString.append('name', params.name);
    }

    const queryParams = queryString.toString();
    // 构建API端点，在实际项目中会用于request函数
    // 这里仅用于记录API调用的路径，实际调用使用模拟数据
    const endpoint = `/v4/me/shipping-partners${queryParams ? `?${queryParams}` : ''}`;

    // 使用useStableCallback创建稳定的请求函数
    const stableRequest = useStableCallback<() => Promise<ShippingPartner[]>>(() => {
        // MOCK_DATA_MARKER: 以下代码仅用于开发阶段，生产环境将自动使用真实API
        // 在真实环境中，应该使用 return request(endpoint);

        // 检查是否为生产环境
        const isProduction = process.env.NODE_ENV === 'production';

        // 如果是生产环境，使用真实API
        if (isProduction) {
            return request(endpoint);
        }

        // MOCK_IMPLEMENTATION_START: 以下是模拟实现，将来会被删除
        // 记录当前调用的API路径，仅用于开发调试
        // eslint-disable-next-line no-console
        console.debug('MOCK API endpoint:', endpoint);

        return new Promise<ShippingPartner[]>(resolve => {
            setTimeout(() => {
                // 过滤模拟数据，模拟API的过滤功能
                let filteredData = [...mockShippingPartners];

                // MOCK_FILTER: 模拟后端的区域过滤功能
                if (params.country && params.country !== 'all') {
                    // 根据大洲过滤
                    const continentCountryMap = {
                        america: ['USA', 'CAN', 'MEX', 'BRA', 'ARG', 'COL', 'PER', 'CHL'],
                        europe: [
                            'GBR',
                            'DEU',
                            'FRA',
                            'ITA',
                            'ESP',
                            'NLD',
                            'CHE',
                            'SWE',
                            'POL',
                            'BEL',
                        ],
                        asia: [
                            'CHN',
                            'JPN',
                            'KOR',
                            'IND',
                            'SGP',
                            'HKG',
                            'TWN',
                            'THA',
                            'VNM',
                            'MYS',
                        ],
                        oceania: ['AUS', 'NZL', 'FJI'],
                        africa: ['ZAF', 'EGY', 'MAR', 'NGA', 'KEN', 'GHA', 'ETH'],
                    };

                    const countriesInContinent =
                        continentCountryMap[
                            params.country as keyof typeof continentCountryMap
                        ] || [];

                    filteredData = filteredData.filter(partner =>
                        partner.carriers.some(carrier =>
                            carrier.services.some(service =>
                                service.countries.some(country =>
                                    countriesInContinent.includes(country)
                                )
                            )
                        )
                    );
                }

                // MOCK_SEARCH: 模拟后端的名称搜索功能
                if (params.name) {
                    const searchTerm = params.name.toLowerCase();
                    filteredData = filteredData.filter(
                        partner =>
                            partner.name.toLowerCase().includes(searchTerm) ||
                            partner.carriers.some(carrier =>
                                carrier.name.toLowerCase().includes(searchTerm)
                            )
                    );
                }

                resolve(filteredData);
            }, 1000); // 模拟网络延迟
        });
        // MOCK_IMPLEMENTATION_END
    });

    // 使用useQuery发起请求，传入稳定的请求函数
    const res = useQuery<ShippingPartner[]>(stableRequest, {
        enabled: true,
    });

    return res;
};
