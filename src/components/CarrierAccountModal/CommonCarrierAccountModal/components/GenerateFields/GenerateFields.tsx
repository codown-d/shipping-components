import {Stack} from '@shopify/polaris';
import React, {useCallback} from 'react';
import {useFormContext} from 'react-hook-form';

import {ModalMode} from '../../hooks/useModalInfoMap';

import Checkbox from '@/components/FormFields/Checkbox';
import ControllerTimePicker from '@/components/FormFields/ControllerTimePicker';
import {ControlledDatePicker} from '@/components/FormFields/DatePicker';
import PhoneNumberFieldWithCallingCode from '@/components/FormFields/PhoneNumberFieldWithCallingCode';
import Select from '@/components/FormFields/Select';
import TextField from '@/components/FormFields/TextField';
import TextFieldWithCurrency from '@/components/FormFields/TextFieldWithCurrency';
import {useI18next} from '@/i18n';
import {IField, FormattedFiled, FormatType} from '@/queries/carrierAccounts';

interface IModalFormFiledItemProps {
    // 当需要一行排列多个 field 时，传成嵌套的数组类型即后者
    fields: Array<FormattedFiled | FormattedFiled[]>;
    mode?: ModalMode;
    disabled?: boolean;
}

const ModalFormFiledItem = (props: IModalFormFiledItemProps) => {
    const {t} = useI18next();
    const {mode, fields, disabled} = props;
    const {watch} = useFormContext();
    const generateField = useCallback(
        (fields: IModalFormFiledItemProps['fields']): React.ReactNode => {
            return fields.map((field, index) => {
                if (Array.isArray(field)) {
                    return (
                        <Stack key={index} wrap={false} distribution="fillEvenly">
                            {generateField(field)}
                        </Stack>
                    );
                }

                if (Object.values(field.property ?? {}).length) {
                    return (
                        <Stack vertical spacing="tight" key={field.name}>
                            {generateField([{...field, property: null}])}
                            {/*  条件判断：如果 field 为布尔类型且为 true，才展示子 filed 的内容（暂时为前端写死，约定以后不会出现 Select 这类结构） */}
                            {field.type === 'boolean' && watch(field.name) && (
                                <Stack vertical>
                                    {Object.values(field.property ?? {}).map(field => {
                                        return (
                                            <div style={{marginLeft: '2.8rem'}} key={field.name}>
                                                {generateField([field])}
                                            </div>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Stack>
                    );
                }

                const {
                    name,
                    type,
                    label,
                    helpText,
                    help_text, // 现在后端返回的是 help_text, helpText 后端建议保留, 统一成本比较高
                    placeholder,
                    required,
                    hidden,
                    enum: fieldEnum,
                    options,
                    props,
                } = field;

                const displayLabel = `${label}${
                    required ? '' : ' (' + t('status.optional', {defaultValue: 'optional'}) + ')'
                }`;

                if (hidden) {
                    const displayPlaceholder = placeholder || (mode === 'EDIT' ? '********' : '');
                    return (
                        <TextField
                            name={name}
                            label={displayLabel}
                            key={name}
                            helpText={helpText ?? help_text}
                            placeholder={displayPlaceholder}
                            type="password"
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                if (field.format === FormatType.TIME) {
                    return (
                        <ControllerTimePicker
                            key={name}
                            name={name}
                            label={displayLabel}
                            {...props}
                        />
                    );
                }

                if (fieldEnum?.length) {
                    return (
                        <Select
                            name={name}
                            label={displayLabel}
                            key={name}
                            helpText={helpText}
                            // If didn't fallback to a string, select would auto choose the first option
                            // and validator would consider that you haven't made a selection
                            placeholder={
                                placeholder ||
                                t('common_modal.form.field.select', {
                                    defaultValue: 'Select',
                                })
                            }
                            options={fieldEnum.map(i => ({label: i, value: i}))}
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                if (options?.length) {
                    return (
                        <Select
                            name={name}
                            label={displayLabel}
                            key={name}
                            helpText={helpText}
                            placeholder={t('common_modal.form.field.select', {
                                defaultValue: 'Select',
                            })}
                            options={options}
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                if (type === 'boolean') {
                    return (
                        <Checkbox
                            name={name}
                            label={displayLabel}
                            key={name}
                            defaultValue={false}
                            helpText={helpText}
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                if (type === 'date') {
                    return (
                        <ControlledDatePicker
                            key={name}
                            name={name}
                            label={displayLabel}
                            format="MMM DD, YYYY"
                            {...props}
                        />
                    );
                }

                if (type === 'currency') {
                    return (
                        // @ts-ignore currencyName属性包含在props中
                        <TextFieldWithCurrency
                            key={name}
                            label={displayLabel}
                            amountName={name}
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                if (type === 'phone') {
                    return (
                        // @ts-ignore callingCodeName属性包含在props中
                        <PhoneNumberFieldWithCallingCode
                            key={name}
                            phoneNumberName={name}
                            label={displayLabel}
                            disabled={disabled}
                            {...props}
                        />
                    );
                }

                return (
                    <TextField
                        name={name}
                        label={displayLabel}
                        key={name}
                        helpText={helpText ?? help_text}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
            });
        },
        [disabled, mode, watch, t]
    );

    return <Stack vertical>{generateField(fields)}</Stack>;
};

export default ModalFormFiledItem;
