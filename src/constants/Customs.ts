import {SelectOption} from '@shopify/polaris';

import {t} from '@/i18n';

export const emptyOption = {
    label: t('common_modal.form.field.select', 'Select'),
    value: '', // means to use as null, but Select only support string. we use adaptor transform
};

export const PurposeOptions: SelectOption[] = [
    {value: 'merchandise', label: 'Merchandise'},
    {value: 'gift', label: 'Gift'},
    {value: 'sample', label: 'Sample'},
    {value: 'return', label: 'Return'},
    {value: 'repair', label: 'Repair'},
    {value: 'personal', label: 'Personal'},
];

export const TermOfTradeOptions: SelectOption[] = [
    {label: 'DAT', value: 'dat'},
    {label: 'DDU', value: 'ddu'},
    {label: 'DDP', value: 'ddp'},
    {label: 'DAP', value: 'dap'},
];
