import {TextField, TextFieldProps} from '@shopify/polaris';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

interface Props extends Omit<TextFieldProps, 'onChange' | 'autoComplete'> {
    name: string;
    defaultValue?: string | null;
    autoComplete?: string;
    emptyIsNull?: boolean;
}

const WrappedTextField: FC<Props> = ({
    label,
    name,
    type,
    defaultValue,
    emptyIsNull,
    multiline,
    autoComplete = 'off',
    ...rest
}) => {
    const methods = useFormContext();

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            render={({onChange, value}) => {
                return (
                    <TextField
                        multiline={multiline}
                        label={label}
                        autoComplete={autoComplete}
                        error={get(methods?.errors, name, {})?.message}
                        value={isNil(value) ? undefined : String(value)}
                        type={type}
                        {...rest}
                        onChange={(val: string) => {
                            onChange(val === '' && emptyIsNull ? null : val);
                        }}
                    />
                );
            }}
            control={methods.control}
        />
    );
};

export default WrappedTextField;
