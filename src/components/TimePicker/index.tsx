import {
    Button,
    Icon,
    OptionList,
    Popover,
    Scrollable,
    Stack,
    Subheading,
    TextField,
    TextStyle,
    Error,
} from '@shopify/polaris';
import {ClockMinor} from '@shopify/polaris-icons';
import React, {useEffect, useState, useMemo, useRef, useCallback} from 'react';

import styles from './index.module.scss';
import {convert24To12hour, convert12To24hour} from './utils';

import {useI18next} from '@/i18n';

interface ITimePickerProps {
    error?: Error;
    label: React.ReactNode;
    defaultValue?: string; // 时间 ---> 13:55
    placeholder?: string;
    onChange: (value: string) => void;
}

// hour:[12,01,...11]
const hourOptions = Array(12)
    .fill(1)
    .map((_, index) => {
        if (index === 0) {
            return {value: '12', label: '12'};
        }

        if (index < 10) {
            return {value: 0 + String(index), label: 0 + String(index)};
        }
        return {value: String(index), label: String(index)};
    });

// minute:[00,01,02,...,59]
const minuteOptions = Array(60)
    .fill(1)
    .map((_, index) => {
        const value = index < 10 ? `0${index}` : String(index);
        return {value, label: value};
    });

function TimePicker({label, defaultValue = '', placeholder, onChange, error}: ITimePickerProps) {
    const {t} = useI18next();
    const [timePickerActive, setTimePickerActive] = useState(false);
    const [meridiemPrefixSelected, setMeridiemPrefixSelected] = useState<string[]>([]); // 正午的前缀，是 am or pm
    const [hourSelected, setHourSelected] = useState<string[]>([]);
    const [minuteSelected, setMinuteSelected] = useState<string[]>([]);

    // 如果 meridiem，hour，minute 没有选中，那么 confirm button disabled 掉
    const isValueValid = meridiemPrefixSelected[0] && hourSelected[0] && minuteSelected[0];

    // 格式化时间 13:55 ---> 1:55 pm
    const formattedTimeWithUnit = useMemo(() => {
        if (!isValueValid) return '';

        return `${hourSelected}:${minuteSelected} ${meridiemPrefixSelected}`;
    }, [meridiemPrefixSelected, hourSelected, minuteSelected, isValueValid]);

    const timeBy24HourClock = useMemo(() => {
        if (!isValueValid) return '';

        return convert12To24hour(
            `${hourSelected[0]}:${minuteSelected[0]} ${meridiemPrefixSelected[0]}`
        );
    }, [hourSelected, minuteSelected, meridiemPrefixSelected, isValueValid]);

    const handleClearButtonClick = () => {
        onChange('');
    };

    const handleConfirm = () => {
        setTimePickerActive(false);

        onChange(timeBy24HourClock);
    };

    const handleResetEmptyDefaultValues = () => {
        setMeridiemPrefixSelected([]);
        setHourSelected([]);
        setMinuteSelected([]);
    };

    const handleResetPicker = useCallback(() => {
        if (!defaultValue) {
            handleResetEmptyDefaultValues();
            return;
        }

        const {hour, minute, suffix} = convert24To12hour(defaultValue);
        setMeridiemPrefixSelected([suffix]);
        setHourSelected([hour]);
        setMinuteSelected([minute]);
    }, [defaultValue]);

    useEffect(() => {
        handleResetPicker();
    }, [handleResetPicker]);

    return (
        <Popover
            autofocusTarget="none"
            active={timePickerActive}
            activator={
                <TextField
                    autoComplete="off"
                    label={label}
                    value={formattedTimeWithUnit}
                    inputMode="url"
                    onChange={() => {}}
                    error={error}
                    prefix={<Icon source={ClockMinor} color="base" />}
                    placeholder={placeholder}
                    onFocus={() => {
                        setTimePickerActive(true);
                    }}
                    focused={timePickerActive}
                    clearButton
                    onClearButtonClick={handleClearButtonClick}
                />
            }
            preferredAlignment="center"
            onClose={() => {
                setTimePickerActive(false);
                handleResetPicker();
            }}
        >
            <Stack vertical spacing="none">
                <div style={{height: 34, display: 'flex'}}>
                    {[
                        t('date.hour', {defaultValue: 'hour'}),
                        t('date.minute', {defaultValue: 'minute'}),
                        `${t('date.am')} / ${t('date.pm')}`,
                    ].map(item => (
                        <div style={{width: '33%', height: 36}} key={item}>
                            <TextStyle variation="subdued">
                                <Subheading>
                                    <div style={{padding: '16px 0 0 16px'}}>{item}</div>
                                </Subheading>
                            </TextStyle>
                        </div>
                    ))}
                </div>
                <div className={styles.time_picker_style}>
                    <Scrollable vertical style={{height: '260px', width: '100px'}} focusable>
                        <OptionList
                            onChange={setHourSelected}
                            options={hourOptions}
                            selected={hourSelected}
                        />
                    </Scrollable>
                    <Scrollable vertical style={{height: '260px', width: '100px'}} focusable>
                        <OptionList
                            onChange={setMinuteSelected}
                            options={minuteOptions}
                            selected={minuteSelected}
                        />
                    </Scrollable>
                    <Stack vertical distribution="equalSpacing">
                        <Scrollable vertical style={{height: '160px', width: '100px'}} focusable>
                            <OptionList
                                onChange={setMeridiemPrefixSelected}
                                options={[
                                    {value: 'am', label: t('date.am', {defaultValue: 'am'})},
                                    {value: 'pm', label: t('date.pm', {defaultValue: 'pm'})},
                                ]}
                                selected={meridiemPrefixSelected}
                            />
                        </Scrollable>
                        <div style={{padding: '0 0 16px 16px', marginRight: '.8rem'}}>
                            <Button primary onClick={handleConfirm} disabled={!isValueValid}>
                                {t('action.content.confirm', {defaultValue: 'Confirm'})}
                            </Button>
                        </div>
                    </Stack>
                </div>
            </Stack>
        </Popover>
    );
}

export default TimePicker;
