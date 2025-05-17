import countries from 'i18n-iso-countries';
import {DeepPartial} from 'react-hook-form';
import * as yup from 'yup';

import {FedExCourierAccount, METHOD} from './typings';
import {getIsFedexSmartPost} from './utils';

import cooperativeCountries from '@/constants/FedExCountryIsoCode.json';
import {t} from '@/i18n';
import {CourierAccount} from '@/queries/carrierAccounts';
import {JsonSchemaField} from '@/types/form';
import {ILocationAddress} from '@/types/locations';
import {getRequiredMessage, getMaxStringMessage, getTypeMessage} from '@/utils/errorMessages';
import {getPhoneSchema} from '@/utils/schema';

export const isCooperativeCountries = (value: string | undefined) => {
    if (value) {
        const iso2Code = countries.alpha3ToAlpha2(value);
        return cooperativeCountries.includes(iso2Code.toLocaleLowerCase());
    }
    return true;
};

const isValueValid = (val: string | null | undefined) => !val || val?.indexOf('&') === -1;

const maxLength = {
    password: 25,
    desc: 100,
    accountNumber: 9,
    key: 16,
    meterNumber: 9,
    addressInfo: 35,
    postalCode: 15,
    email: 60,
};

export const fedexSchema = (
    slug: string, //'fedex' | 'fedex-smartpost'
    mode: METHOD,
    accountCountry?: string
) => {
    const passwordRequired =
        mode === METHOD.ADD
            ? yup
                  .string()
                  .max(maxLength.password, getMaxStringMessage(maxLength.password))
                  .required(getRequiredMessage(t('table.column.password', 'Password')))
            : yup
                  .string()
                  .max(maxLength.password, getMaxStringMessage(maxLength.password))
                  .nullable();
    return yup
        .object({
            slug: yup.string(),
            description: yup
                .string()
                .max(maxLength.desc, getMaxStringMessage(maxLength.desc))
                .test(
                    'description',
                    getTypeMessage(t('table.column.description', 'Description')),
                    isValueValid
                )
                .required(getRequiredMessage(t('table.column.description', 'Description'))),
            account_country: yup
                .string()
                .required(getRequiredMessage(t('table.column.account_region', 'Account region'))),
            credentials: yup
                .object({
                    account_number: yup
                        .string()
                        .max(maxLength.accountNumber, getMaxStringMessage(maxLength.accountNumber))
                        .required(
                            getRequiredMessage(t('table.column.account_number', 'Account number'))
                        ),
                    ...(slug === 'fedex-smartpost' && {
                        hub_id: yup
                            .string()
                            .required(getRequiredMessage(t('table.column.hub_id', 'Hub ID'))),
                    }),
                })
                .when('account_country', {
                    is: isCooperativeCountries,
                    then: yup.object({
                        key: yup
                            .string()
                            .max(maxLength.key, getMaxStringMessage(maxLength.key))
                            .nullable(),
                        password: yup
                            .string()
                            .max(maxLength.password, getMaxStringMessage(maxLength.password))
                            .nullable(),
                        meter_number: yup
                            .string()
                            .max(maxLength.meterNumber, getMaxStringMessage(0))
                            .nullable(),
                    }),
                    otherwise: yup.object({
                        key: yup
                            .string()
                            .max(maxLength.key, getMaxStringMessage(maxLength.key))
                            .required(getRequiredMessage(t('table.column.key', 'Key'))),
                        password: passwordRequired,
                        meter_number: yup
                            .string()
                            .max(maxLength.meterNumber, getMaxStringMessage(0))
                            .required(
                                getRequiredMessage(t('table.column.meter_number', 'Meter number'))
                            ),
                    }),
                }),
            shipping_address: yup.object({
                first_name: yup
                    .string()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test(
                        'first_name',
                        getTypeMessage(t('table.column.first_name', 'First name')),
                        isValueValid
                    )
                    .trim()
                    .required(getRequiredMessage(t('table.column.first_name', 'First name'))),
                last_name: yup
                    .string()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test(
                        'last_name',
                        getTypeMessage(t('table.column.last_name', 'Last name')),
                        isValueValid
                    )
                    .trim()
                    .required(getRequiredMessage(t('table.column.last_name', 'Last name'))),
                company_name: yup
                    .string()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test(
                        'company',
                        getTypeMessage(t('table.column.company_name', 'Company name')),
                        isValueValid
                    )
                    .trim()
                    .nullable(),
                street1: yup
                    .string()
                    .trim()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test(
                        'street1',
                        getTypeMessage(`${t('table.column.address_line', 'Address line')} 1`),
                        isValueValid
                    )
                    .required(
                        getRequiredMessage(`${t('table.column.address_line', 'Address line')} 1`)
                    ),
                street2: yup
                    .string()
                    .trim()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test(
                        'street2',
                        getTypeMessage(`${t('table.column.address_line', 'Address line')} 2`),
                        isValueValid
                    )
                    .nullable(),
                city: yup
                    .string()
                    .trim()
                    .max(maxLength.addressInfo, getMaxStringMessage(maxLength.addressInfo))
                    .test('city', getTypeMessage(t('table.column.city', 'City')), isValueValid)
                    .required(getRequiredMessage(t('table.column.city', 'City'))),
                country: yup
                    .string()
                    .oneOf(
                        [accountCountry, undefined],
                        t(
                            'valid.select_account_country',
                            'Please select the same as your account country.'
                        )
                    )
                    .required(
                        getRequiredMessage(
                            t('table.column.country_region', 'Country/Region', {
                                interpolation: {escapeValue: false},
                            })
                        )
                    ),
                state: yup
                    .string()
                    .trim()
                    .test('state', getTypeMessage(t('table.column.state', 'State')), isValueValid)
                    .nullable(),
                postal_code: yup
                    .string()
                    .trim()
                    .max(maxLength.postalCode, getMaxStringMessage(maxLength.postalCode))
                    .test(
                        'postal_code',
                        getTypeMessage(t('table.column.postal_code', 'Postal Code')),
                        isValueValid
                    )
                    .nullable(),
                phone: getPhoneSchema(),
                email: yup
                    .string()
                    .email(t('valid.invaild_email', 'Invalid email address'))
                    .max(maxLength.email, getMaxStringMessage(maxLength.email))
                    .test('email', getTypeMessage(t('table.column.email', 'Email')), isValueValid)
                    .required(getRequiredMessage(t('table.column.email', 'Email'))),
            }),
            settings: yup.object({
                preferred_currency: yup.string().nullable(),
            }),
        })
        .defined();
};

export const getCredentialsFields = (country: string, mode: METHOD): JsonSchemaField[] => {
    const passwordPlaceholder = mode === METHOD.EDIT ? '********' : '';
    return isCooperativeCountries(country)
        ? []
        : [
              {
                  helpText: '',
                  label: t('table.column.key', 'Key'),
                  name: 'credentials.key',
                  placeholder: '',
                  required: undefined,
                  self: 'key',
                  test: undefined,
                  type: 'string',
              },
              {
                  helpText: '',
                  label: t('table.column.password', 'Password'),
                  name: 'credentials.password',
                  placeholder: passwordPlaceholder,
                  required: undefined,
                  self: 'password',
                  test: undefined,
                  type: 'string',
              },
              {
                  helpText: '',
                  label: t('table.column.meter_number', 'Meter number'),
                  name: 'credentials.meter_number',
                  placeholder: '',
                  required: undefined,
                  self: 'meter_number',
                  test: undefined,
                  type: 'string',
              },
          ];
};

export const addDefaultValue = (
    slug: string,
    defaultAddress?: ILocationAddress
): DeepPartial<FedExCourierAccount> | undefined => {
    const isFedexSmartPost = getIsFedexSmartPost(slug);

    return isFedexSmartPost
        ? {
              account_country: 'USA',
              shipping_address: {
                  country: 'USA',
              },
          }
        : {
              slug,
              description: '',
              credentials: {
                  account_number: '',
                  key: '',
                  password: '',
                  meter_number: '',
              },
              account_country: '',
              shipping_address: {
                  first_name: defaultAddress?.name || '',
                  last_name: '',
                  company_name: defaultAddress?.company || null,
                  phone: {
                      country_code: defaultAddress?.phone.country_code || '',
                      number: defaultAddress?.phone.number || '',
                  },
                  email: defaultAddress?.contact_email || '',
                  street1: defaultAddress?.address_line_1 || '',
                  street2: defaultAddress?.address_line_2 || null,
                  city: defaultAddress?.city || '',
                  state: defaultAddress?.state || null,
                  postal_code: defaultAddress?.postal_code || null,
                  country: defaultAddress?.country_code || '',
              },
              settings: {
                  preferred_currency: null,
              },
          };
};

export const editDefaultValue = (courierInfo?: CourierAccount) => {
    return {
        slug: courierInfo?.slug,
        description: courierInfo?.description || '',
        credentials: courierInfo?.credentials,
        account_country: courierInfo?.account_country || '',
        shipping_address: courierInfo?.shipping_address,
        settings: courierInfo?.settings,
    };
};
