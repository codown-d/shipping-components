import dayjs from 'dayjs';
import * as yup from 'yup';

import {BillingAddress as BillingAddressType, AddressSource} from './types';

import {USPS_DISCOUNTED} from '@/constants';
import {t} from '@/i18n';
import {Field} from '@/types/form';
import {yupSchemaObjectGenerator} from '@/utils/schema';

export const credentialFields: Field[] = [
    {
        type: 'string',
        min_length: 1,
        max_length: 255,
        label: t('label.credit_card', 'Credit card number'),
        enum: [],
        items: null,
        required: true,
        name: 'credit_card_number',
        placeholder: '',
        helpText: t(
            'label.credit_card.help_text',
            'Please enter a valid credit card with 12-19 digits.'
        ),
        test: {
            name: 'credit_card_number',
            message: t(
                'label.credit_card.help_text',
                'Please enter a valid credit card with 12-19 digits.'
            ),
            test: val => {
                if (val) {
                    return (val as string).length >= 12 && (val as string).length <= 19;
                }
                return false;
            },
            exclusive: true,
        },
    },
    {
        type: 'string',
        min_length: 1,
        max_length: 255,
        label: t('label.card_holder', 'Card holder name'),
        enum: [],
        items: null,
        required: true,
        name: 'card_holder_name',
        placeholder: '',
        helpText: '',
        test: undefined,
    },
    {
        type: 'string',
        min_length: 1,
        max_length: 255,
        label: t('label.card_expiration_m', 'Card expiration month'),
        enum: [],
        items: null,
        required: true,
        name: 'card_expiration_month',
        placeholder: 'MM',
        helpText: '',
        test: {
            name: 'card_expiration_month',
            message: t('label.card_expiration_m.message', 'Please enter a valid month (01-12).'),
            test: val => Number(val) >= 1 && Number(val) <= 12 && (val as string).length === 2,
            exclusive: true,
        },
    },
    {
        type: 'string',
        min_length: 1,
        max_length: 255,
        label: t('label.card_expiration_y', 'Card expiration year'),
        enum: [],
        items: null,
        required: true,
        name: 'card_expiration_year',
        placeholder: 'YYYY',
        helpText: '',
        test: {
            name: 'card_expiration_year',
            message: t('label.card_expiration_y.message', 'Please enter a valid year.'),
            test: val =>
                Number(val) >= Number(dayjs().format('YYYY')) &&
                (val as string).length === String(dayjs().get('year')).length,
            exclusive: true,
        },
    },
    {
        type: 'string',
        min_length: 1,
        max_length: 255,
        label: t('label.card_security_code', 'Card security code'),
        enum: [],
        items: null,
        required: true,
        name: 'card_security_code',
        placeholder: 'CVV',
        helpText: '',
        test: undefined,
    },
];

export const getSchema = (courier: string) => {
    const schemaRule: {
        credit_card?: yup.ObjectSchema<
            | {
                  billing_address?: Partial<BillingAddressType>;
              }
            | undefined
        >;

        description: yup.StringSchema;
    } = {
        description: yup
            .string()
            .max(200)
            .required(t('required.desc', t('required.desc', 'Description is required.'))),
        ...yupSchemaObjectGenerator(credentialFields),
    };

    if (courier === USPS_DISCOUNTED) {
        schemaRule.credit_card = yup.object({
            billing_address: yup.object({
                city: yup.string().when('source', {
                    is: AddressSource.MANUAL,
                    then: yup
                        .string()
                        .required(t('required.city', t('required.city', 'City is required.'))),
                }),
                postal_code: yup.string().when('source', {
                    is: AddressSource.MANUAL,
                    then: yup
                        .string()
                        .required(
                            t(
                                'required.postal_code',
                                t('required.postal_code', 'Postal code is required.')
                            )
                        ),
                }),

                state: yup.string().when('source', {
                    is: AddressSource.MANUAL,
                    then: yup
                        .string()
                        .required(t('required.state', t('required.state', 'State is required.'))),
                }),
                street1: yup.string().when('source', {
                    is: AddressSource.MANUAL,
                    then: yup
                        .string()
                        .required(
                            t('required.street', t('required.street', 'Street is required.'))
                        ),
                }),
            }),
        });
    }

    return yup.object(schemaRule).defined();
};
