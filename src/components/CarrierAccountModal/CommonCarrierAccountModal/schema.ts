import dayjs from 'dayjs';
import startCase from 'lodash/startCase';
import * as yup from 'yup';

import {getAddressSchema} from './components/AddressFormSection/schema';
import {IDynamicFormInfo, UIField} from './hooks/useCarrierAccountFieldList';
import {getaddressRequiredFields} from './utils';

import {t} from '@/i18n';
import {IField, FormattedFiled, FormatType} from '@/queries/carrierAccounts';
import {
    getGreaterOrEqualMessage,
    getMaxStringMessage,
    getRequiredMessage,
} from '@/utils/errorMessages';

const getFieldItemSchema = (field: FormattedFiled, fatherName?: string) => {
    const {type, required, label: displayName, max_length, format} = field;

    if (fatherName) {
        return yup.string().when(fatherName, (value: boolean) => {
            if (required && value) return yup.string().required(getRequiredMessage(displayName));
            return yup.string();
        });
    }

    if (format === FormatType.TIME) {
        return required
            ? yup.string().when(fatherName ?? '', (value: boolean) => {
                  return value
                      ? yup.string().required(getRequiredMessage(displayName))
                      : yup.string();
              })
            : yup.string();
    }

    if (type === 'boolean') {
        return required ? yup.boolean().required(getRequiredMessage(displayName)) : yup.boolean();
    }

    if (required && max_length) {
        return yup
            .string()
            .required(getRequiredMessage(displayName))
            .max(max_length, getMaxStringMessage(max_length));
    }

    if (required) {
        return yup.string().required(getRequiredMessage(displayName));
    }

    if (max_length) {
        return yup.string().max(max_length, getMaxStringMessage(max_length));
    }

    return yup.string();
};

const getFieldsSchema = (
    fields: FormattedFiled[],
    fatherName?: string
): Record<
    string,
    yup.StringSchema<string | undefined, object> | yup.BooleanSchema<boolean | undefined, object>
> => {
    return fields.reduce<any>((pre, curr) => {
        if (Object.values(curr?.property ?? {}).length) {
            return {
                ...pre,
                ...getFieldsSchema([{...curr, property: null}]),
                ...getFieldsSchema(Object.values(curr?.property ?? {}), curr.name.split('.')[1]),
            };
        }
        return {
            ...pre,
            [curr.name.split('.')[1]]: getFieldItemSchema(curr, fatherName),
        };
    }, {});
};

export const invoiceFields: Array<FormattedFiled> = [
    {
        type: 'string',
        label: t('label.invoice_number', 'Invoice Number'),
        required: true,
        name: 'invoice.invoice_number',
    },
    {
        type: 'currency',
        label: t('label.invoice_amount', 'Invoice Amount'),
        required: true,
        name: 'invoice.invoice_amount',
        props: {
            currencyName: 'invoice.invoice_currency',
        },
    },
    {
        type: 'date',
        label: t('label.invoice_date', 'Invoice Date'),
        required: true,
        name: 'invoice.invoice_date',
        props: {
            disableDatesAfter: new Date(),
            disableDatesBefore: new Date(dayjs().subtract(90, 'day').format()),
        },
    },
    {
        type: 'string',
        label: t('label.control_id', 'Control ID'),
        required: false,
        name: 'invoice.control_id',
        placeholder: t('placeholder.control_id', 'Required if present on the invoice'),
    },
];

const invoiceSchema = yup.object({
    invoice_amount: yup.number().when('enabled', {
        is: true,
        then: yup
            .number()
            .typeError(
                t('error.invoice_amount.not_a_number', 'Invoice Amount must specify a number')
            )
            .required(getRequiredMessage(t('label.invoice_amount', 'Invoice Amount')))
            .min(0.01, getGreaterOrEqualMessage(t('label.invoice_amount', 'Invoice Amount'), 0))
            .test(
                'precision',
                t(
                    'error.invoice_amount.wrong_decimal',
                    'The value should not have more than 2 decimal places.'
                ),
                value => /^(\d*)(\.\d{1,2})?$/.test(String(value))
            ),
    }),
    invoice_number: yup.string().when('enabled', {
        is: true,
        then: yup
            .string()
            .required(getRequiredMessage(t('label.invoice_number', 'Invoice Number'))),
    }),
    invoice_date: yup.string().when('enabled', {
        is: true,
        then: yup.string().required(getRequiredMessage(t('label.invoice_date', 'Invoice Date'))),
    }),
});

interface ISchemaParams {
    slug: string;
    dynamicFormInfo: IDynamicFormInfo[];
    withInvoice: boolean;
}

export const getCommonSchema = ({slug, dynamicFormInfo, withInvoice = false}: ISchemaParams) => {
    const credentialsFields = dynamicFormInfo
        .filter(i => [UIField.CREDENTIALS, UIField.SETTINGS].includes(i.uiType))
        .reduce<IField[]>((pre, curr) => [...pre, ...(curr.fields as IField[])], [])
        .filter(i => i.category !== null);

    const credentialsFieldsSchema = getFieldsSchema(credentialsFields);
    const withAddress = dynamicFormInfo.some(sectionInfo => sectionInfo.type === 'address');
    const addressSchema = getAddressSchema(getaddressRequiredFields(slug));

    const schemaObject = {
        description: yup
            .string()
            .max(100, getMaxStringMessage(100))
            .required(getRequiredMessage(t('table.column.description', 'Description'))),
        credentials: yup.object({
            ...credentialsFieldsSchema,
        }),
        ...(withAddress && {address: addressSchema}),
        ...(withInvoice && {invoice: invoiceSchema}),
    };

    return yup
        .object({
            ...schemaObject,
        })
        .defined();
};
