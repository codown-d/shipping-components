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
            min: yup
                .string()
                .required(getRequiredMessage(t('table.column.from_numbers', 'From numbers')))
                .matches(
                    new RegExp(`^${trackingNumberRegex}$`),
                    getMatchMessage(
                        t('table.column.from_number', 'From number'),
                        trackingNumberRegex
                    )
                ),
            max: yup
                .string()
                .required(getRequiredMessage(t('table.column.to_numbers', 'To numbers')))
                .matches(
                    new RegExp(`^${trackingNumberRegex}$`),
                    getMatchMessage(t('table.column.to_number', 'To number'), trackingNumberRegex)
                ),
        })
        .defined();
