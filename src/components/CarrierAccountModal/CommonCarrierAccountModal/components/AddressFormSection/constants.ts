import {t} from '@/i18n';
import {IField} from '@/queries/carrierAccounts';
import {CountryOptions} from '@/utils/countries';

const TypeOptions = [
    {
        label: t('label.residential', 'Residential'),
        value: 'residential',
    },
    {
        label: t('label.business', 'Business'),
        value: 'business',
    },
];

export const addressRequiredField: Record<string, boolean> = {
    contact_name: true,
    company_name: false,
    phone: false,
    email: false,
    street1: true,
    street2: false,
    street3: false,
    city: true,
    country: false,
    state: false,
    postal_code: false,
    type: false,
    tax_id: false,
};

export const UPSAddressRequiredField: Record<string, boolean> = {
    contact_name: true,
    company_name: true,
    phone: true,
    email: true,
    street1: true,
    street2: false,
    street3: false,
    city: true,
    country: true,
    state: true,
    postal_code: true,
    type: false,
    tax_id: false,
};

export const royilMailRequiredField: Record<string, boolean> = {
    contact_name: true,
    company_name: false,
    phone: true,
    email: true,
    street1: true,
    street2: false,
    street3: false,
    city: true,
    country: true,
    state: false,
    postal_code: true,
    type: false,
    tax_id: false,
};

export const getAddressFields = (
    requiredFields = addressRequiredField
): Array<IField | IField[]> => [
    {
        type: 'string',
        label: t('label.name', 'Name'),
        required: requiredFields.contact_name,
        name: 'address.contact_name',
    },
    {
        type: 'string',
        label: t('table.column.company_name', 'Company name'),
        required: requiredFields.company_name,
        name: 'address.company_name',
        props: {
            emptyIsNull: true,
        },
    },
    {
        type: 'phone',
        label: t('table.column.phone_number', 'Phone number'),
        required: requiredFields.phone,
        name: 'address.phone.number',
        props: {
            callingCodeName: 'address.phone.country_code',
        },
    },
    {
        type: 'string',
        label: t('table.column.email', 'Email'),
        required: requiredFields.email,
        name: 'address.email',
        props: {
            emptyIsNull: true,
        },
    },
    {
        type: 'string',
        label: `${t('table.column.address_line', 'Address line')} 1`,
        required: requiredFields.street1,
        name: 'address.street1',
    },
    {
        type: 'string',
        label: `${t('table.column.address_line', 'Address line')} 2`,
        required: requiredFields.street2,
        name: 'address.street2',
    },
    {
        type: 'string',
        label: `${t('table.column.address_line', 'Address line')} 3`,
        required: requiredFields.street3,
        name: 'address.street3',
    },
    {
        type: 'string',
        label: t('table.column.city', 'City'),
        required: requiredFields.city,
        name: 'address.city',
    },
    {
        type: 'select',
        label: t('table.column.country_region', 'Country/Region', {
            interpolation: {escapeValue: false},
        }),
        options: CountryOptions,
        required: requiredFields.country,
        name: 'address.country',
    },
    [
        {
            type: 'string',
            label: t('table.column.state', 'State'),
            required: requiredFields.state,
            name: 'address.state',
            props: {
                emptyIsNull: true,
            },
        },
        {
            type: 'string',
            label: t('address.form.postal_code', 'Postal code'),
            required: requiredFields.postal_code,
            name: 'address.postal_code',
            props: {
                emptyIsNull: true,
            },
        },
        {
            type: 'string',
            label: t('table.column.type', 'Type'),
            options: TypeOptions,
            required: requiredFields.type,
            name: 'address.type',
        },
    ],
    {
        type: 'string',
        label: t('table.column.tax_id', 'Tax id'),
        required: requiredFields.tax_id,
        name: 'address.tax_id',
    },
];
