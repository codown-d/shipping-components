import {Checkbox, CheckboxProps} from '@shopify/polaris';
import get from 'lodash/get';
import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import TimePicker from '@/components/TimePicker';

export type Props = Omit<CheckboxProps & {name: string; defaultValue?: boolean}, 'onChange'>;

const ControllerTimePicker: FC<Props> = ({name, label, defaultValue, ...rest}) => {
    const methods = useFormContext();

    return (
        <Controller
            name={name}
            render={({onChange, value}) => {
                return (
                    <TimePicker
                        {...rest}
                        label={label}
                        defaultValue={value}
                        onChange={onChange}
                        error={get(methods?.errors, name, {})?.message}
                    />
                );
            }}
            defaultValue={get(methods?.getValues(), name, '')}
            control={methods.control}
        />
    );
};

export default ControllerTimePicker;
