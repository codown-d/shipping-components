import * as yup from 'yup';

import {addressRequiredField} from './constants';

import {t} from '@/i18n';
import {getRequiredMessage, getMaxStringMessage, getTypeMessage} from '@/utils/errorMessages';
import {getPhoneSchema} from '@/utils/schema';

const isValueValid = (val: string | null | undefined) => !val || val?.indexOf('&') === -1;

export const getAddressSchema = (requiredField = addressRequiredField) =>
    yup.object({
        contact_name: yup
            .string()
            .max(35, getMaxStringMessage(35))
            .test('name', getTypeMessage(t('label.name', 'Name')), isValueValid)
            .trim()
            .test('is-required', getRequiredMessage(t('label.name', 'Name')), value =>
                requiredField.contact_name ? Boolean(value) : true
            ),
        company_name: yup
            .string()
            .max(35, getMaxStringMessage(35))
            .test(
                'company',
                getTypeMessage(t('table.column.company_name', 'Company name')),
                isValueValid
            )
            .trim()
            .nullable()
            .test(
                'is-required',
                getRequiredMessage(t('table.column.company_name', 'Company name')),
                value => (requiredField.company_name ? Boolean(value) : true)
            ),
        email: yup
            .string()
            .email('Invalid email address')
            .max(60, getMaxStringMessage(60))
            .test('email', getTypeMessage(t('table.column.email', 'Email')), isValueValid)
            .nullable()
            .test('is-required', getRequiredMessage(t('table.column.email', 'Email')), value =>
                requiredField.email ? Boolean(value) : true
            ),
        street1: yup
            .string()
            .trim()
            .max(35, getMaxStringMessage(35))
            .test(
                'street1',
                getTypeMessage(`${t('table.column.address_line', 'Address line')} 1`),
                isValueValid
            )
            .test(
                'is-required',
                getRequiredMessage(`${t('table.column.address_line', 'Address line')} 1`),
                value => (requiredField.street1 ? Boolean(value) : true)
            ),
        street2: yup
            .string()
            .trim()
            .max(35, getMaxStringMessage(35))
            .test(
                'street2',
                getTypeMessage(`${t('table.column.address_line', 'Address line')} 2`),
                isValueValid
            )
            .nullable()
            .test(
                'is-required',
                getRequiredMessage(`${t('table.column.address_line', 'Address line')} 2`),
                value => (requiredField.street2 ? Boolean(value) : true)
            ),
        street3: yup
            .string()
            .trim()
            .max(35, getMaxStringMessage(35))
            .test(
                'street3',
                getTypeMessage(`${t('table.column.address_line', 'Address line')} 3`),
                isValueValid
            )
            .nullable()
            .test(
                'is-required',
                getRequiredMessage(`${t('table.column.address_line', 'Address line')} 3`),
                value => (requiredField.street3 ? Boolean(value) : true)
            ),
        city: yup
            .string()
            .trim()
            .max(35, getMaxStringMessage(35))
            .test('city', getTypeMessage(t('table.column.city', 'City')), isValueValid)
            .test('is-required', getRequiredMessage(t('table.column.city', 'City')), value =>
                requiredField.city ? Boolean(value) : true
            ),
        country: yup
            .string()
            .required(
                getRequiredMessage(
                    t('table.column.country_region', 'Country/Region', {
                        interpolation: {escapeValue: false},
                    })
                )
            )
            .test(
                'is-required',
                getRequiredMessage(
                    t('table.column.country_region', 'Country/Region', {
                        interpolation: {escapeValue: false},
                    })
                ),
                value => (requiredField.country ? Boolean(value) : true)
            ),
        state: yup
            .string()
            .trim()
            .test('state', getTypeMessage(t('table.column.state', 'State')), isValueValid)
            .nullable()
            .test('is-required', getRequiredMessage(t('table.column.state', 'State')), value =>
                requiredField.state ? Boolean(value) : true
            ),
        postal_code: yup
            .string()
            .trim()
            .max(15, getMaxStringMessage(15))
            .test(
                'postal_code',
                getTypeMessage(t('table.column.postal_code', 'Postal Code')),
                isValueValid
            )
            .nullable()
            .test(
                'is-required',
                getRequiredMessage(t('table.column.postal_code', 'Postal Code')),
                value => (requiredField.postal_code ? Boolean(value) : true)
            ),
        phone: getPhoneSchema(requiredField.phone),
        type: yup
            .string()
            .nullable()
            .test('is-required', getRequiredMessage(t('table.column.type', 'Type')), value =>
                requiredField.type ? Boolean(value) : true
            ),
        tax_id: yup
            .string()
            .trim()
            .max(35, getMaxStringMessage(35))
            .test('tax_id', getTypeMessage(t('table.column.tax_id', 'Tax id')), isValueValid)
            .nullable()
            .test(
                'is-required',
                getRequiredMessage(t('table.column.tax_id.upcase', 'Tax ID')),
                value => (requiredField.tax_id ? Boolean(value) : true)
            ),
    });
