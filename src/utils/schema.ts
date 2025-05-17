/* eslint-disable @typescript-eslint/naming-convention */
import * as yup from 'yup';

import {
    getMaxStringMessage,
    getMinNumberMessage,
    getRequiredMessage,
    getTypeMessage,
    getGreaterOrEqualMessage,
} from './errorMessages';

import {t} from '@/i18n';
import {Field} from '@/types/form';

export const yupSchemaGenerator = (field: Field) => {
    // no-shadow
    const {required, max_length, min_length, label, test} = field;

    const rules = [{required}, {max_length}, {min_length}, {test}];

    return rules.filter(Boolean).reduce((acc, cur) => {
        if (cur?.required) {
            return acc.required(
                t('required.template', `${label} is required.`, {
                    name: label,
                })
            );
        }

        if (cur?.min_length) {
            return acc.min(
                cur?.min_length,
                t('characters.least', `${label} must be at least ${min_length} characters`, {
                    name: label,
                    min: min_length,
                }) // TODO: the content should be confirm with PM later
            );
        }

        if (cur?.max_length) {
            return acc.max(
                cur?.max_length,
                t('characters.max', `Maximum length is ${max_length} characters.`, {
                    max: max_length,
                })
            );
        }

        if (cur?.test) {
            return acc.test(cur.test as any);
        }
        return acc;
    }, yup.string());
};

export const yupSchemaObjectGenerator = (fields: Field[]) => {
    return fields.reduce((acc, cur) => {
        return {...acc, [cur.name]: yupSchemaGenerator(cur)};
    }, {});
};

export const checkIsNumberAndPositive = (title: string) =>
    yup
        .number()
        .typeError(getRequiredMessage(title))
        .required(getRequiredMessage(title))
        .positive(getMinNumberMessage(title, 0));

export const getPhoneSchema = (required = false) =>
    yup.object().shape(
        {
            country_code: yup.string().when('number', {
                is: (val?: string): boolean => {
                    return Boolean(val);
                },
                then: yup
                    .string()
                    .required(
                        getRequiredMessage(t('labe.phone_number_country', 'Phone number country'))
                    ),
                otherwise: yup.string().nullable(),
            }),
            number: yup
                .string()
                .label(t('table.column.phone_number', 'Phone number'))
                .when('country_code', {
                    is: (val?: string) => Boolean(val),
                    then: yup
                        .string()
                        .matches(
                            /^[0-9 ]*$/g,
                            getTypeMessage(t('label.phone number', 'phone number'))
                        )
                        .trim()
                        .required(
                            getRequiredMessage(t('table.column.phone_number', 'Phone number'))
                        ),
                    otherwise: yup
                        .string()
                        .matches(
                            /^[0-9 ]*$/g,
                            getTypeMessage(t('label.phone number', 'phone number'))
                        )
                        .trim()
                        .nullable(),
                })
                .test('is-required', getRequiredMessage(t('table.column.phone', 'Phone')), value =>
                    required ? Boolean(value) : true
                ),
        },
        [['number', 'country_code']]
    );

export const getCreateLabelPhoneSchema = (required = false) =>
    yup.object().shape({
        number: yup
            .string()
            .label('Phone number')
            .trim()
            .nullable()
            .test('is-required', getRequiredMessage('Phone'), value =>
                required ? Boolean(value) : true
            ),
    });

export const shippingLocationSchema = yup
    .object({
        name: yup
            .string()
            .trim()
            .max(50, getMaxStringMessage(50))
            .required(getRequiredMessage('Location name')),
        external_location: yup.object().shape({
            id: yup.string().nullable(),
        }),
        default: yup.bool(),
        address: yup
            .object({
                name: yup
                    .string()
                    .trim()
                    .max(50, getMaxStringMessage(50))
                    .required(getRequiredMessage('Name')),
                company: yup.string().trim().nullable(),
                address_line_1: yup
                    .string()
                    .trim()
                    .max(255, getMaxStringMessage(255))
                    .required(getRequiredMessage('Address line 1')),
                address_line_2: yup.string().trim().max(255, getMaxStringMessage(255)).nullable(),
                city: yup
                    .string()
                    .trim()
                    .max(200, getMaxStringMessage(200))
                    .required(getRequiredMessage('City')),
                state: yup.string().trim().required(getRequiredMessage('State')).nullable(),
                country_code: yup.string().required(getRequiredMessage('Country/Region')),
                phone: getCreateLabelPhoneSchema(),
                postal_code: yup
                    .string()
                    .trim()
                    .max(20, getMaxStringMessage(20))
                    .required(getRequiredMessage('Postal code'))
                    .nullable(),
                contact_email: yup
                    .string()
                    .email('Invalid email address')
                    .label('Email')
                    .nullable(),
            })
            .defined(),
    })
    .defined();

export const commonFieldSchema = {
    amount: yup
        .number()
        .typeError(getTypeMessage('unit price'))
        .positive(getMinNumberMessage('Unit price', 0))
        .nullable(true)
        .transform((_, val) => {
            if (val === '' || !val) {
                return null;
            }
            return Number(val);
        }),
};

export const orderItemSchema = yup.object({
    title: yup.string().trim(),
    sku: yup.string().trim().nullable(),
    customs: yup.object({
        hs_code: yup.string().trim(),
        country_of_origin: yup.string().trim(),
    }),
    weight: yup.object({
        value: yup
            .number()
            .typeError(getTypeMessage('Weight'))
            .min(0, getGreaterOrEqualMessage('Weight'))
            .nullable(true)
            .transform((_, val) => {
                if (val === '' || !val) {
                    return null;
                }
                return Number(val);
            }),
        unit: yup.string(),
    }),
    unit_price: yup.object({
        amount: commonFieldSchema.amount,
        currency: yup.string(),
    }),
    quantity: yup
        .number()
        .typeError(getTypeMessage('Quantity'))
        .positive(getMinNumberMessage('Quantity', 0))
        .integer('Quantity must be an integer')
        .when(
            [
                'title',
                'sku',
                'customs.hs_code',
                'customs.country_of_origin',
                'weight.value',
                'unit_price.amount',
            ],
            {
                is: (...fields) => {
                    return Boolean(
                        fields.some(value => {
                            return Boolean(value);
                        })
                    );
                },
                then: yup.number().required(),
                otherwise: yup.number().nullable(),
            }
        )
        .transform((_, val) => {
            if (val === '' || !val) {
                return null;
            }
            return Number(val);
        }),
});
