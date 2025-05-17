import * as yup from 'yup';

import {t} from '@/i18n';
import {getMaxStringMessage, getRequiredMessage, getMatchMessage} from '@/utils/errorMessages';

export const getSchema = (trackingNumberRegex: string) =>
    yup
        .object({
            description: yup
                .string()
                .trim()
                .max(255, getMaxStringMessage(255))
                .required(getRequiredMessage(t('table.column.description', 'Description'))),
            data: yup
                .string()
                .required(
                    getRequiredMessage(t('table.column.tracking_numbers', 'Tracking numbers'))
                )
                .test(
                    'tracking number data',
                    getMatchMessage(
                        t('table.column.tracking_number', 'Tracking number'),
                        trackingNumberRegex
                    ),
                    (value: string | undefined | null) => {
                        if (!value) return true;
                        const trackingNumbers = value.split('\n');
                        return trackingNumbers.every(
                            i => !i || new RegExp(trackingNumberRegex).test(i)
                        );
                    }
                ),
        })
        .defined();
