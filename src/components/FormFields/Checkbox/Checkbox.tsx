import {Checkbox, CheckboxProps} from '@shopify/polaris';
import get from 'lodash/get';
import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

export type Props = Omit<CheckboxProps & {name: string; defaultValue?: boolean}, 'onChange'>;

const ControlledCheckbox: FC<Props> = ({name, label, defaultValue, ...rest}) => {
    const methods = useFormContext();

    return (
        <Controller
            name={name}
            render={({onChange, value}) => {
                return <Checkbox {...rest} label={label} checked={value} onChange={onChange} />;
            }}
            defaultValue={get(
                methods?.getValues(),
                name,
                typeof defaultValue === 'boolean' ? defaultValue : ''
            )}
            control={methods.control}
        />
    );
};

export default ControlledCheckbox;
