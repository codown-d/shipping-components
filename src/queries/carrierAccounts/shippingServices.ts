import useMutation from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import {CourierAccountShippingServices} from '@/queries/carrierAccounts/types';
import {request} from '@/utils/network';

export const useGetCourierAccountsShippingServices = (accountId: string) => {
    return useQuery<CourierAccountShippingServices>(
        () => request(`/v4/me/courier-accounts/${accountId}/shipping-services`),
        {enabled: Boolean(accountId)}
    );
};

export const useEditCourierAccountsShippingServices = (accountId: string) => {
    return useMutation<CourierAccountShippingServices, CourierAccountShippingServices>(payload =>
        request(`/v4/me/courier-accounts/${accountId}/shipping-services`, {
            body: payload,
            method: 'PUT',
        })
    );
};
