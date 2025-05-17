import {useState} from 'react';

import {useTrackingNumberContext} from '../../../hooks/useTrackingNumberContext';

import {useI18next} from '@/i18n';
import {ResponseMeta} from '@/queries/response';
import {useAddValuesMethodsTrackingNumber} from '@/queries/trackingNumber';

interface ICallback {
    onSuccess?: VoidFunction;
    onError?: (error: ResponseMeta) => void;
}

export interface IValuesMethodFiledValues {
    data: string;
    description: string;
}

export type IValuesMethodParams = ICallback & IValuesMethodFiledValues;

export const useValuesMethodSubmit = () => {
    const {t} = useI18next();
    const {mutate, isLoading} = useAddValuesMethodsTrackingNumber();
    const {slug, accountId, refetchTrackingNumber} = useTrackingNumberContext();
    const [toastMsg, setToast] = useState<string>('');

    const handleSubmit = ({data, description, onSuccess, onError}: IValuesMethodParams) => {
        mutate(
            {
                data: data.split('\n').filter(Boolean),
                description,
                pool: [slug, accountId].join(':'),
                shipper_account_id: accountId,
                slug,
                type: 'values',
            },
            {
                onSuccess: () => {
                    setToast(
                        t('message.save.success', {
                            defaultValue: 'Tracking number saved successfully',
                        })
                    );
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
