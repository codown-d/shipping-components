import {StoresState} from './types';

import useQuery from '@/hooks/useQuery';
import {request} from '@/utils/network';

export const useGetShopifyStores = () => {
    return useQuery<StoresState>(() => request('/v4/me/stores?app_platform=shopify'));
};
