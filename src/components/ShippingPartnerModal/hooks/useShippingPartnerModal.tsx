import {useState, useCallback, useEffect, useMemo} from 'react';

import {useCountryCode} from '@/hooks/useCountryCode';
import useDebounceFn from '@/hooks/utils/useDebounceFn';
import {useGetShippingPartners} from '@/queries/shippingPartners';
import {useGetCourierAccounts} from '@/container/CarrierManagerProvider';
import {useCarrierListModal} from '@/container/CarrierManagerProvider/hooks/hooks';

export interface ShippingPartnerOption {
    slug: string;
    title: string;
    subtitle: string;
    tags?: string[];
    carriers?: string[];
    primaryAction?: {
        content: string;
        onAction: () => void;
    };
}

export const useShippingPartnerModal = (
    open: boolean,
    onClose: () => void,
    onSelect?: (slug: string) => void
) => {
    const [selected, setSelected] = useState(0);
    // Shipping partner 标签页的搜索状态
    const [partnerSearchValue, setPartnerSearchValue] = useState('');
    const [debouncedPartnerSearchValue, setDebouncedPartnerSearchValue] = useState('');

    // My carrier account 标签页的搜索状态
    const [carrierSearchValue, setCarrierSearchValue] = useState('');

    const [selectedRegion, setSelectedRegion] = useState('all');
    const [isError, setIsError] = useState(false);

    // 获取用户国家代码
    const userCountryCode = useCountryCode();

    // 获取用户的承运商账户
    const {
        data: userCourierAccounts = [],
        isLoading: isLoadingAccounts,
        refetch: refetchAccounts
    } = useGetCourierAccounts({
        enabled: true,
        includesUSPS: false
    });

    // 用于添加新的承运商账户
    const {open: openCarrierListModal} = useCarrierListModal({
        onClick: () => {
            // 关闭当前模态框
            onClose();
        },
        onCarrierItemSave: () => {
            // 保存后刷新数据
            refetchAccounts();
        }
    });

    // 根据用户国家代码设置默认区域
    useEffect(() => {
        if (userCountryCode) {
            // 根据国家代码映射到大洲
            let continent = 'all';

            // 北美和南美国家
            if (
                ['USA', 'CAN', 'MEX', 'BRA', 'ARG', 'COL', 'PER', 'CHL'].includes(userCountryCode)
            ) {
                continent = 'america';
            }
            // 欧洲国家
            else if (
                ['GBR', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'CHE', 'SWE'].includes(userCountryCode)
            ) {
                continent = 'europe';
            }
            // 亚洲国家
            else if (
                ['CHN', 'JPN', 'KOR', 'IND', 'SGP', 'HKG', 'TWN', 'THA'].includes(userCountryCode)
            ) {
                continent = 'asia';
            }
            // 大洋洲国家
            else if (['AUS', 'NZL', 'FJI'].includes(userCountryCode)) {
                continent = 'oceania';
            }
            // 非洲国家
            else if (['ZAF', 'EGY', 'MAR', 'NGA', 'KEN'].includes(userCountryCode)) {
                continent = 'africa';
            }

            setSelectedRegion(continent);
        }
    }, [userCountryCode]);

    // 使用防抖处理Shipping partner标签页的搜索输入
    const {run: debouncedSetPartnerSearch} = useDebounceFn(
        (value: string) => {
            setDebouncedPartnerSearchValue(value);
        },
        {
            wait: 800, // 800ms的防抖延迟
            trailing: true, // 确保在用户停止输入后触发
        }
    );

    // 获取物流合作伙伴数据
    const {
        data: shippingPartners,
        isLoading,
        refetch,
    } = useGetShippingPartners({
        country: selectedRegion !== 'all' ? selectedRegion : undefined,
        name: debouncedPartnerSearchValue || undefined,
    });

    // 当弹窗打开或搜索条件变化时，重新获取数据
    useEffect(() => {
        if (open) {
            refetch();
        }
    }, [open, selectedRegion, debouncedPartnerSearchValue, refetch]);

    const handleTabChange = useCallback((selectedTabIndex: number) => {
        setSelected(selectedTabIndex);
    }, []);

    // Shipping partner标签页的搜索处理
    const handlePartnerSearchChange = useCallback((value: string) => {
        setPartnerSearchValue(value);
        debouncedSetPartnerSearch(value);
    }, [debouncedSetPartnerSearch]);

    // My carrier account标签页的搜索处理
    const handleCarrierSearchChange = useCallback((value: string) => {
        setCarrierSearchValue(value);
    }, []);

    const handleRegionChange = useCallback((value: string) => {
        setSelectedRegion(value);
    }, []);

    // 构建区域选项
    const regionOptions = [
        {label: 'All regions', value: 'all'},
        {label: 'America', value: 'america'},
        {label: 'Europe', value: 'europe'},
        {label: 'Asia', value: 'asia'},
        {label: 'Oceania', value: 'oceania'},
        {label: 'Africa', value: 'africa'},
    ];

    const tabs = [
        {
            id: 'shipping-partner',
            content: 'Shipping partner',
            accessibilityLabel: 'Shipping partner',
            panelID: 'shipping-partner-content',
        },
        {
            id: 'my-carrier-account',
            content: 'My carrier account',
            accessibilityLabel: 'My carrier account',
            panelID: 'my-carrier-account-content',
        },
    ];

    // 过滤用户的承运商账户
    const filteredAccounts = useMemo(() => {
        if (!userCourierAccounts || userCourierAccounts.length === 0) {
            return [];
        }

        if (!carrierSearchValue) {
            return userCourierAccounts;
        }

        const lowerCaseQuery = carrierSearchValue.toLowerCase();
        return userCourierAccounts.filter(account =>
            account.description.toLowerCase().includes(lowerCaseQuery) ||
            account.originSlugName.toLowerCase().includes(lowerCaseQuery) ||
            account.slug.toLowerCase().includes(lowerCaseQuery)
        );
    }, [userCourierAccounts, carrierSearchValue]);

    // 将API返回的数据转换为ShippingPartnerList组件需要的格式
    const partnerOptions = useMemo(() => {
        if (!shippingPartners || shippingPartners.length === 0) {
            return [];
        }

        return shippingPartners.map(partner => {
            // 获取该合作伙伴支持的所有物流商slug，用于显示图标
            const carrierSlugs = partner.carriers.map(carrier => carrier.slug);

            // 构建描述文本
            let subtitle = '';

            if (partner.slug === 'easyship') {
                subtitle =
                    'Discover a world of savings! Partner with over 30 carriers and seize exclusive discounts, slashing your costs by up to 91%.';
            } else {
                subtitle = `Enjoy up to 89% off shipping rates.`;
            }

            // 检查是否是热门合作伙伴
            const isPopular = partner.tags.includes('popular');

            return {
                slug: partner.slug,
                title: partner.name,
                subtitle,
                // 添加标签属性
                tags: isPopular ? ['popular'] : [],
                // 添加carriers信息
                carriers: carrierSlugs,
                primaryAction: {
                    content: 'Add now',
                    onAction: () => onSelect?.(partner.slug),
                },
            };
        });
    }, [shippingPartners, onSelect]);

    return {
        selected,
        partnerSearchValue,
        carrierSearchValue,
        selectedRegion,
        isError,
        setIsError,
        userCourierAccounts,
        isLoadingAccounts,
        openCarrierListModal,
        isLoading,
        partnerOptions,
        filteredAccounts,
        regionOptions,
        tabs,
        handleTabChange,
        handlePartnerSearchChange,
        handleCarrierSearchChange,
        handleRegionChange,
        setCarrierSearchValue,
    };
};
