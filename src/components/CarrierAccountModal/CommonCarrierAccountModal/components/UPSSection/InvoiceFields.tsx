import {Stack, Subheading, TextStyle} from '@shopify/polaris';
import React from 'react';
import {useFormContext} from 'react-hook-form';

import {ModalMode} from '../../hooks/useModalInfoMap';
import {invoiceFields} from '../../schema';
import GenerateFields from '../GenerateFields/GenerateFields';

import Divider from '@/components/Divider';
import Checkbox from '@/components/FormFields/Checkbox';
import {useI18next} from '@/i18n';

interface IProps {
    mode: ModalMode;
    showDivider: boolean;
}

const InvoiceFields = ({mode, showDivider}: IProps) => {
    const {t} = useI18next();
    const {watch} = useFormContext();

    const checked = watch('invoice.enabled');

    const disabled = mode === 'EDIT';

    return (
        <Stack vertical>
            <Subheading>{t('invoice.title', {defaultValue: 'Invoice'})}</Subheading>
            <TextStyle>
                {t('invoice.info', {
                    defaultValue: `If you've received an invoice in the past 90 days (or the past 45 days for accounts not based in the US or Canada), then you will have to authorize your account with one of your past three invoices.`,
                })}
            </TextStyle>
            <Stack spacing="tight">
                <Checkbox
                    name="invoice.enabled"
                    label={t('invoice.checkbox.label', {defaultValue: 'Have a UPS invoice?'})}
                    disabled={disabled}
                />
            </Stack>
            {checked && <GenerateFields mode={mode} fields={invoiceFields} disabled={disabled} />}
            {showDivider && <Divider />}
        </Stack>
    );
};

export default InvoiceFields;
