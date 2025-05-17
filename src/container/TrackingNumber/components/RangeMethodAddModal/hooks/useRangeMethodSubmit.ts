import {useState} from 'react';

import {useTrackingNumberContext} from '../../../hooks/useTrackingNumberContext';

import {ResponseMeta} from '@/queries/response';
import {useAddRangeMethodsTrackingNumber} from '@/queries/trackingNumber';

interface ICallback {
    onSuccess?: VoidFunction;
    onError?: (error: ResponseMeta) => void;
}

export interface IRangeMethodFiledValues {
    description: string;
    min: string;
    max: string;
}

export type IRangeMethodParams = ICallback &
    IRangeMethodFiledValues & {
        label: string;
    };

export const useRangeMethodSubmit = () => {
    const {mutate, isLoading} = useAddRangeMethodsTrackingNumber();
    const {slug, accountId, refetchTrackingNumber, preAssignedNumberConfigs} =
        useTrackingNumberContext();
    const [toastMsg, setToast] = useState<string>('');

    const handleSubmit = ({
        min,
        max,
        description,
        label,
        onSuccess,
        onError,
    }: IRangeMethodParams) => {
        const labelIndex = Number(label);
        const poolTemplate = preAssignedNumberConfigs?.[labelIndex]?.pool_template?.id || '';
        const replace = preAssignedNumberConfigs?.[labelIndex]?.pool_template?.replace?.[0] || '';
        let pool = '';

        if (replace) {
            // NOTICE: 历史遗留问题，replace 目前只会为 "shipper_account_id"，故只需要替换成 accountId
            pool = poolTemplate.replace(replace, accountId);
        }

        mutate(
            {
                description,
                min,
                max,
                pool,
                shipper_account_id: accountId,
                slug,
                type: 'range',
            },
            {
                onSuccess: () => {
                    setToast('Tracking number saved successfully');
                    refetchTrackingNumber();
                    onSuccess?.();
                },
                onError,
            }
        );
    };

    return {
        submit: handleSubmit,
        isLoading,
        toastMsg,
    };
};
