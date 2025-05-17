import {ChoiceList, ChoiceListProps, Checkbox, Banner, TextStyle} from '@shopify/polaris';
import get from 'lodash/get';
import React, {FC, useState} from 'react';
import {useFormContext, Controller} from 'react-hook-form';

import styles from './ChoiceList.module.scss';

import {useI18next} from '@/i18n';

export interface Choice {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
    helpText?: React.ReactNode;
    describedByError?: boolean;
    renderChildren?(isSelected: boolean): React.ReactNode | false;
}

export interface SelectedOption {
    key: string;
    selectedItems: Choice[];
    currentComponentName: string;
}

type onSelectedFunc = (options: SelectedOption) => void;

export type Props = Omit<
    ChoiceListProps & {
        name: string;
        haveSelectAll?: boolean;
        haveErrorBanner?: boolean;
        filterEmpty?: boolean;
        onSelected?: onSelectedFunc;
    },
    'onChange' | 'selected'
>;

const ControlledChoiceList: FC<Props> = ({
    name,
    choices,
    haveSelectAll,
    haveErrorBanner = false,
    filterEmpty = false,
    onSelected,
    ...rest
}) => {
    const {t} = useI18next();
    const methods = useFormContext();
    const [checked, setChecked] = useState(false);
    const bannerError = haveErrorBanner && get(methods?.errors, name, {})?.message;
    const error = haveErrorBanner ? undefined : get(methods?.errors, name, {})?.message;
    return (
        <>
            {bannerError && (
                <div className={styles.banner}>
                    <Banner status="critical">
                        <TextStyle>{bannerError}</TextStyle>
                    </Banner>
                </div>
            )}
            {Boolean(choices.length) && haveSelectAll && (
                <Checkbox
                    label={t('label.select_all', {defaultValue: 'Select all'})}
                    checked={checked}
                    onChange={newChecked => {
                        setChecked(newChecked);

                        if (newChecked) {
                            methods?.setValue(
                                name,
                                choices.map(item => item.value)
                            );
                            return false;
                        }
                        methods?.setValue(name, []);
                        return true;
                    }}
                />
            )}

            <Controller
                name={name}
                render={({onChange, value}) => {
                    return (
                        <ChoiceList
                            {...rest}
                            onChange={(v, n) => {
                                if (filterEmpty) {
                                    onChange(v.filter(item => item !== ''));
                                } else {
                                    onChange(v);
                                }

                                if (choices?.length) {
                                    const selectedItems = choices.filter(c => v.includes(c.value));

                                    onSelected?.({
                                        key: name,
                                        selectedItems,
                                        currentComponentName: n,
                                    });
                                }
                            }}
                            choices={choices}
                            selected={value || []}
                            error={error}
                        />
                    );
                }}
                control={methods?.control}
            />
        </>
    );
};

export default ControlledChoiceList;
