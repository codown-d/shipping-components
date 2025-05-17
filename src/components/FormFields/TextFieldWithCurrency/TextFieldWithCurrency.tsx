import {Select, TextField} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';
import cc from 'currency-codes';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import React from 'react';
import {Controller, useFormContext, useWatch} from 'react-hook-form';

import {emptyOption} from '@/constants/Customs';

interface Props {
    currencyName: string;
    amountName: string;
    label: string;
    disabled?: boolean;
    defaultValue?: {
        amount?: string;
        currency?: string;
    };
}

export default function TextFieldWithCurrency({
    currencyName,
    amountName,
    label,
    disabled,
    defaultValue = {},
}: Props) {
    const {errors, trigger} = useFormContext();
    const [i18n] = useI18n();

    const currencyOptions = cc.codes();

    const currency = useWatch({
        name: currencyName,
        defaultValue: defaultValue.currency,
    });

    const prefix = (currency ? i18n.getCurrencySymbol(currency).symbol || '' : '').trim();

    return (
        <Controller
            name={amountName}
            disabled={disabled}
            defaultValue={defaultValue.amount}
            render={({onChange: onTextChange, value}) => (
                <TextField
                    prefix={prefix !== currency ? prefix : ''}
                    error={get(errors, amountName, {})?.message || ''}
                    disabled={disabled}
                    label={label}
                    autoComplete="off"
                    value={isNil(value) ? undefined : String(value)}
                    onChange={value => {
                        onTextChange(value);
                        trigger(currencyName);
                    }}
                    connectedRight={
                        <Controller
                            name={currencyName}
                            defaultValue={defaultValue.currency}
                            render={({onChange, value}) => {
                                return (
                                    <Select
                                        error={get(errors, currencyName, {})?.message || ''}
                                        disabled={disabled}
                                        name={currencyName}
                                        value={value}
                                        label=""
                                        labelHidden
                                        onChange={selected => {
                                            onChange(selected);
                                            trigger(amountName);
                                        }}
                                        options={[emptyOption, ...currencyOptions]}
                                    />
                                );
                            }}
                        />
                    }
                />
            )}
        />
    );
}
