import {useMemo} from 'react';

import {ICouriersData, CourierFull} from './types';

import useQuery from '@/hooks/useQuery';
import {request} from '@/utils/network';

export const useGetAllCouriers = ({enabledQuery = true} = {}) => {
    const res = useQuery<ICouriersData>(() => request('/v4/me/couriers'), {enabled: enabledQuery});

    const originalData = res.data;

    return useMemo(
        () => ({
            ...res,
            data: {
                all: originalData?.all_couriers ?? [],
                v4: originalData?.couriers ?? [], // 写死的四个 couriers
            },
        }),
        [res, originalData]
    );
};

export const useGetCourierBySlug = (slug: string) => {
    return useQuery<CourierFull>(() => request(`/v4/me/couriers/${slug}`), {
        enabled: Boolean(slug),
    });
};
