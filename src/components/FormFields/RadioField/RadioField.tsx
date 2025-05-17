import {ChoiceList, ChoiceListProps, Banner, TextStyle} from '@shopify/polaris';
import get from 'lodash/get';
import React, {FC} from 'react';
import {useFormContext, Controller} from 'react-hook-form';

import styles from './RadioField.module.scss';

export type Props = Omit<
    ChoiceListProps & {
        name: string;
        haveSelectAll?: boolean;
        haveErrorBanner?: boolean;
        straight?: boolean;
    },
    'onChange' | 'selected'
>;

const RadioField: FC<Props> = ({
    name,
    choices,
    haveSelectAll,
    straight,
    haveErrorBanner = false,
    ...rest
}) => {
    const methods = useFormContext();

    const bannerError = haveErrorBanner && get(methods?.errors, name, {})?.message;
    const error = haveErrorBanner ? undefined : get(methods?.errors, name, {})?.message;

    const className = straight ? styles.straightMode : '';

    return (
        <>
            {bannerError && (
                <div className={styles.banner}>
                    <Banner status="critical">
                        <TextStyle>{bannerError}</TextStyle>
                    </Banner>
                </div>
            )}
            <Controller
                name={name}
                render={({onChange, value}) => {
                    return (
                        <div className={className}>
                            <ChoiceList
                                {...rest}
                                onChange={v => {
                                    onChange(v[0]);
                                }}
                                choices={choices}
                                selected={[value]}
                                error={error}
                            />
                        </div>
                    );
                }}
                control={methods?.control}
            />
        </>
    );
};

export default RadioField;
