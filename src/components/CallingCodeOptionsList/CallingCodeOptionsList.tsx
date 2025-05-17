import {Select} from '@shopify/polaris';
import classNames from 'classnames';
import React, {useCallback, useState, useEffect} from 'react';

import styles from './CallingCodeOptionsList.module.scss';

import {t, useI18next} from '@/i18n';
import {getCallingCodeOptions} from '@/utils/getCallingCodeOptions';
import {getCountryNameByCallingCode} from '@/utils/getCountryNameByCallingCode';

export const defaultSelected = {
    name: 'Select',
    callingCode: '',
};

interface Props {
    onChange?: (data: any) => void;
    defaultValue?: {
        name: string;
        callingCode: string;
    } | null;
    error?: string;
    className?: string;
    disabled?: boolean;
}

const callingCodes = [
    {
        label: t('common_modal.form.field.select', 'Select'),
        value: JSON.stringify({name: 'Select', callingCode: ''}),
    },
    ...getCallingCodeOptions(),
];

const CallingCodeOptionsList = ({
    onChange,
    defaultValue,
    error,
    className,
    disabled = false,
}: Props) => {
    const {t} = useI18next();
    const getSelectedValue = useCallback(() => {
        if (defaultValue) {
            return [
                JSON.stringify({
                    ...defaultValue,
                    name:
                        defaultValue.name || getCountryNameByCallingCode(defaultValue.callingCode),
                }),
            ];
        }
        return [JSON.stringify(defaultSelected)];
    }, [defaultValue]);

    const [selected, setSelected] = useState(() => getSelectedValue());

    const handleOptionListChanged = useCallback(data => {
        setSelected([data]);
        onChange?.(JSON.parse(data)?.callingCode);
    }, []);

    useEffect(() => {
        if (defaultValue?.callingCode !== JSON.parse(selected[0])?.callingCode) {
            setSelected(getSelectedValue());
        }
    }, [defaultValue]);

    return (
        <div className={classNames(styles.wrapper, className)}>
            <Select
                options={callingCodes}
                onChange={handleOptionListChanged}
                label={t('calling_code_options_list.lable', {defaultValue: 'CallingCode'})}
                labelHidden
                value={selected[0]}
                error={error}
                disabled={disabled}
            />
        </div>
    );
};

export default CallingCodeOptionsList;
