import useMutation from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import {request} from '@/utils/network';

interface RechargeParams {
    slug?: string;
    accountId?: string;
}

export interface RechargeData {
    threshold: number;
    amount: number;
}

export const useGetRecharge = ({slug, accountId}: RechargeParams) => {
    return useQuery<RechargeData>(
        () => request(`/v4/me/couriers/${slug}/courier-accounts/${accountId}/recharge`),
        {
            enabled: Boolean(slug) && Boolean(accountId),
        }
    );
};

export const useUpdateRecharge = ({slug, accountId}: RechargeParams) => {
    return useMutation<RechargeData, RechargeData>((params: RechargeData) =>
        request(`/v4/me/couriers/${slug}/courier-accounts/${accountId}/recharge`, {
            method: 'PATCH',
            body: params,
        })
    );
};
