import {
    DatePicker as PolarisDatePicker,
    Popover,
    Icon,
    TextField,
    TextFieldProps,
    Card,
    Range as DateRange,
    DatePickerProps as PolarisDatePickerProps,
} from '@shopify/polaris';
import {CalendarMinor} from '@shopify/polaris-icons';
import dayjs from 'dayjs';
import get from 'lodash/get';
import React, {useState, useCallback} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import styles from './DatePicker.module.scss';

interface OwnProps {
    onChange: (date: Date) => void;
    value: Date | null;
    format?: string;
    label: string;
    error?: string;
    labelHidden?: boolean;
    connectedLeft?: TextFieldProps['connectedLeft'];
}

export type DatePickerProps = Omit<PolarisDatePickerProps, 'year' | 'month' | 'onChange'> &
    OwnProps;

export const DatePicker = ({connectedLeft, format = 'YYYY-MM-DD', ...props}: DatePickerProps) => {
    const [active, setActive] = useState(false);
    const [date] = useState(() => new Date());
    const [{year, month}, setShownDate] = useState(() => ({
        year: dayjs(date).year(),
        month: dayjs(date).month(),
    }));

    const onPick = (range: DateRange): void => {
        props.onChange(range.start);
        setActive(false);
    };

    const onMonthChange = useCallback(
        (m: number, y: number) => setShownDate({year: y, month: m}),
        []
    );

    const activator = (
        <div className={styles.input}>
            <TextField
                prefix={<Icon source={CalendarMinor} color="base" />}
                label={props.label}
                value={props.value ? dayjs(props.value).format(format) : ''}
                readOnly
                onChange={() => {
                    // readonly, only change by click DatePicker
                }}
                onFocus={() => {
                    setActive(true);
                }}
                error={props.error}
                labelHidden={props.labelHidden}
                connectedLeft={connectedLeft}
                autoComplete="off"
            />
        </div>
    );

    return (
        <Popover active={active} activator={activator} onClose={() => setActive(false)}>
            <Card sectioned>
                <PolarisDatePicker
                    {...props}
                    onChange={onPick}
                    onMonthChange={onMonthChange}
                    year={year}
                    month={month}
                    selected={props.value || undefined}
                />
            </Card>
        </Popover>
    );
};

export type Props = Omit<
    DatePickerProps & {
        name: string;
        defaultValue?: Date;
    },
    'value' | 'onChange'
>;

export const ControlledDatePicker: React.FC<Props> = ({name, label, defaultValue, ...rest}) => {
    const methods = useFormContext();

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            render={({onChange, value}) => {
                return (
                    <DatePicker
                        value={value}
                        label={label}
                        {...rest}
                        error={get(methods?.errors, name)?.message}
                        onChange={onChange}
                    />
                );
            }}
            control={methods.control}
        />
    );
};

export default ControlledDatePicker;
