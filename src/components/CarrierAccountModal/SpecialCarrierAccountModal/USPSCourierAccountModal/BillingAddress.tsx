import {Stack, TextStyle} from '@shopify/polaris';
import React, {useEffect, useMemo} from 'react';
import {useFormContext} from 'react-hook-form';

import {AddressSource} from './types';

import Divider from '@/components/Divider';
import RadioField from '@/components/FormFields/RadioField';
import ControlledSelect from '@/components/FormFields/Select/Select';
import ControlledTextField from '@/components/FormFields/TextField/TextField';
import {USPS_DISCOUNTED} from '@/constants';
import {useI18next} from '@/i18n';
import {StoresState} from '@/queries/stores';
import {CountryOptions} from '@/utils/countries';

const BillingAddress = ({stores, slug}: {stores?: StoresState; slug: string}) => {
    const {t} = useI18next();
    const {watch} = useFormContext();

    const addressSourceOption = [
        {
            value: AddressSource.SHOPIFY,
            label: t('address.shopify', {defaultValue: 'Same as Shopify store address'}),
            disabled: stores?.stores.length === 0,
        },
        {
            value: AddressSource.MANUAL,
            label: t('address.manual', {defaultValue: 'Use a new billing address'}),
        },
    ];

    const isShopifyAddress =
        watch('credit_card.billing_address.source', AddressSource.MANUAL) === AddressSource.SHOPIFY;

    const countryOptions = useMemo(() => {
        return CountryOptions.filter(item => ['USA', 'CAN'].includes(item.value));
    }, []);

    if (slug !== USPS_DISCOUNTED) {
        return null;
    }

    return (
        <Stack vertical>
            <Stack.Item />
            <Divider />
            <Stack vertical>
                <TextStyle variation="strong">
                    <span
                        style={{
                            textTransform: 'uppercase',
                            fontSize: 12,
                        }}
                    >
                        {t('address.title', {defaultValue: 'Billing address'})}
                    </span>
                </TextStyle>
                <RadioField
                    title=""
                    titleHidden
                    name="credit_card.billing_address.source"
                    choices={addressSourceOption}
                />
                {!isShopifyAddress && (
                    <Stack vertical>
                        <ControlledTextField
                            name="credit_card.billing_address.street1"
                            label={`${t('table.column.address_line', {
                                defaultValue: 'Address line',
                            })} 1`}
                        />
                        <ControlledTextField
                            name="credit_card.billing_address.street2"
                            label={t('address.form.apartment', {
                                defaultValue: 'Apartment, suite, etc. (optional)',
                            })}
                        />
                        <ControlledTextField
                            name="credit_card.billing_address.city"
                            label={t('table.column.city', {defaultValue: 'City'})}
                        />
                        <Stack wrap={false}>
                            <div style={{width: 200}}>
                                <ControlledSelect
                                    name="credit_card.billing_address.country"
                                    label={t('table.column.country_region', {
                                        defaultValue: 'Country/Region',
                                        interpolation: {escapeValue: false},
                                    })}
                                    options={countryOptions}
                                    placeholder={t('common_modal.form.field.select', {
                                        defaultValue: 'Select',
                                    })}
                                />
                            </div>
                            <Stack.Item fill>
                                <ControlledTextField
                                    name="credit_card.billing_address.state"
                                    label={t('table.column.state', {defaultValue: 'State'})}
                                />
                            </Stack.Item>
                            <Stack.Item fill>
                                <ControlledTextField
                                    name="credit_card.billing_address.postal_code"
                                    label={t('address.form.postal_code', {
                                        defaultValue: 'Postal code',
                                    })}
                                />
                            </Stack.Item>
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default BillingAddress;
