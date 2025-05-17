import {INumberPoolsData} from './types';

import useMutation from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import {request} from '@/utils/network';

interface IValuesMethodData {
    data: string[];
    description: string;
    pool: string;
    shipper_account_id: string;
    slug: string;
    type: 'values';
}

interface IRangeMethodData {
    description: string;
    max: string;
    min: string;
    pool: string;
    shipper_account_id: string;
    slug: string;
    type: 'range';
}

export const useTrackingNumberQuery = (accountId: string) => {
    return useQuery<INumberPoolsData>(
        () => request(`/v4/me/number-pools/?shipper_account_id=${accountId}`),
        {enabled: Boolean(accountId)}
    );
};

export const useAddValuesMethodsTrackingNumber = () => {
    return useMutation<IValuesMethodData, IValuesMethodData>(payload => {
        const accountId = payload.shipper_account_id;
        return request(`/v4/me/number-pools/?shipper_account_id=${accountId}`, {
            method: 'POST',
            body: payload,
        });
    });
};

export const useAddRangeMethodsTrackingNumber = () => {
    return useMutation<IRangeMethodData, IRangeMethodData>(payload => {
        return request(`/v4/me/number-pools/?shipper_account_id=${payload.shipper_account_id}`, {
            method: 'POST',
            body: payload,
        });
    });
};

export const useDeleteTrackingNumber = () => {
    return useMutation((accountId: string) => {
        return request(`/v4/me/number-pools/${accountId}`, {
            method: 'DELETE',
        });
    });
};
