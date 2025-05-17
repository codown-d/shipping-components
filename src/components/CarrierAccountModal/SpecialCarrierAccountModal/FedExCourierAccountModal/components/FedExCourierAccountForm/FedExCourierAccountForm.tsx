import {TextStyle, Subheading, FormLayout, Card, Stack, Checkbox, Button} from '@shopify/polaris';
import currencyCodes from 'currency-codes';
import React, {useMemo, useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import {Trans} from 'react-i18next';

import AccountIdCopySection from '../../../../CommonCarrierAccountModal/components/AccountIdCopySection';
import {getCredentialsFields, isCooperativeCountries} from '../../schema';
import {FedexAgreementUrl, METHOD} from '../../typings';
import {getFedExBannerInfo, getIsFedexSmartPost, fedexNameMap} from '../../utils';

import styles from './FedExCourierAccountForm.module.scss';

import CourierSection from '@/components/CourierSection';
import Divider from '@/components/Divider';
import EditCarrierAccountBanner from '@/components/EditCarrierAccountBanner';
import PhoneNumberFieldWithCallingCode from '@/components/FormFields/PhoneNumberFieldWithCallingCode';
import ControlledSelect from '@/components/FormFields/Select';
import ControlledTextField from '@/components/FormFields/TextField';
import GenerateFieldsFromJsonSchema from '@/components/GenerateFieldsFromJsonSchema';
import {useCountryCode} from '@/hooks/useCountryCode';
import {NAMESPACE, useI18next} from '@/i18n';
import {CountryOptions} from '@/utils/countries';

const FedExCourierAccountForm = ({
    checked,
    setChecked,
    setAccountCountry,
    mode,
    accountId,
    slug,
}: {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    setAccountCountry: (accountCountry: string) => void;
    mode: METHOD;
    accountId: string;
    slug: string; //'fedex' | 'fedex-smartpost';
}) => {
    const {t} = useI18next();
    const isFedexSmartPost = getIsFedexSmartPost(slug);

    const countryCode = useCountryCode();
    const {url: fedexUrl} = useMemo(() => getFedExBannerInfo(countryCode), [countryCode]);

    const currencyOptions = currencyCodes.codes();

    const {watch} = useFormContext();
    const accountCountry = watch('account_country');
    const credentialsFields = useMemo(
        () => getCredentialsFields(accountCountry, mode),
        [accountCountry, mode]
    );

    const isCompatibleCountry = isCooperativeCountries(accountCountry);

    const isEditMode = mode === METHOD.EDIT;

    // 是否为 compatible 地区，如果是 compatible 地区，不需要填写 key、password、meter number 信息，PM 后端会根据 account number 和 address 计算出相关信息
    // 因此，compatible 地区在 edit 模式不允许修改 account number 和 address 和 account region
    // 非 compatible 可以修改除 account region 和 address country 之外的数据
    // https://aftership.atlassian.net/browse/POM-11723
    const isDisabled = isEditMode && isCompatibleCountry;

    useEffect(() => {
        setAccountCountry(accountCountry);
    }, [accountCountry]);

    const isShowCredentials = isFedexSmartPost || !isEditMode || credentialsFields.length;

    return (
        <FormLayout>
            <Card sectioned>
                <Stack vertical>
                    <CourierSection
                        slug={slug}
                        courierName={fedexNameMap[slug]}
                        defaultText={false}
                    >
                        <TextStyle variation="subdued">
                            {t('fed_ex_modal.form.title', {
                                defaultValue:
                                    'Enter FedEx account number and link with AfterShip Shipping',
                            })}
                        </TextStyle>
                        <TextStyle variation="subdued">
                            <Trans i18nKey="fed_ex_modal.form.need_account" ns={NAMESPACE}>
                                Do not have an account?{' '}
                                <Button plain url={fedexUrl} external>
                                    Apply now
                                </Button>{' '}
                                from AfterShip Shipping and enjoy 50% off
                            </Trans>
                        </TextStyle>
                    </CourierSection>
                    {mode === METHOD.EDIT && <EditCarrierAccountBanner />}
                    <Divider />
                    {mode === METHOD.EDIT && <AccountIdCopySection accountId={accountId} />}
                    {mode === METHOD.EDIT && <Divider />}
                    <Stack.Item>
                        <ControlledTextField
                            name="description"
                            label={t('label.name', {defaultValue: 'Name'})}
                            placeholder=""
                            helpText={t('fed_ex_modal.form.name.help_text', {
                                defaultValue:
                                    'Customize a short name to help you identify this account.',
                            })}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <ControlledSelect
                            name="account_country"
                            label={t('table.column.account_region', {
                                defaultValue: 'Account region',
                            })}
                            placeholder={t('common_modal.form.field.select', {
                                defaultValue: 'Select',
                            })}
                            options={CountryOptions}
                            disabled={isFedexSmartPost || isEditMode}
                        />
                    </Stack.Item>
                    <Divider />

                    {isShowCredentials && (
                        <Stack.Item>
                            <Stack vertical>
                                <Subheading>
                                    {t('fed_ex_modal.heading.credentials', {
                                        defaultValue: 'CREDENTIALS',
                                    })}
                                </Subheading>
                                {/* mode === METHOD.EDIT https://aftership.atlassian.net/browse/POM-14996 */}
                                {!isEditMode && (
                                    <ControlledTextField
                                        name="credentials.account_number"
                                        label={t('table.column.account_number', {
                                            defaultValue: 'Account number',
                                        })}
                                        disabled={isDisabled}
                                    />
                                )}

                                {isFedexSmartPost && (
                                    <ControlledTextField
                                        name="credentials.hub_id"
                                        label={t('table.column.hub_id', {defaultValue: 'Hub ID'})}
                                    />
                                )}
                                {credentialsFields.length && (
                                    <div className={styles.credentials}>
                                        <GenerateFieldsFromJsonSchema
                                            fields={credentialsFields}
                                            isDisabled={isDisabled}
                                        />
                                    </div>
                                )}
                            </Stack>
                        </Stack.Item>
                    )}

                    {isShowCredentials && <Divider />}
                    <Stack.Item>
                        <Stack vertical>
                            <Subheading>
                                {t('fed_ex_modal.heading.address', {
                                    defaultValue: 'SHIPPING ADDRESS',
                                })}
                            </Subheading>
                            <Stack wrap={false}>
                                <div className={styles.name}>
                                    <ControlledTextField
                                        name="shipping_address.first_name"
                                        label={t('table.column.first_name', {
                                            defaultValue: 'First name',
                                        })}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div className={styles.name}>
                                    <ControlledTextField
                                        name="shipping_address.last_name"
                                        label={t('table.column.last_name', {
                                            defaultValue: 'Last name',
                                        })}
                                        disabled={isDisabled}
                                    />
                                </div>
                            </Stack>
                            <ControlledTextField
                                name="shipping_address.company_name"
                                label={t('table.column.company_name_optional', {
                                    defaultValue: 'Company name (optional)',
                                })}
                                emptyIsNull
                                disabled={isDisabled}
                            />
                            <ControlledTextField
                                name="shipping_address.street1"
                                label={`${t('table.column.address_line', {
                                    defaultValue: 'Address line',
                                })} 1`}
                                disabled={isDisabled}
                            />
                            <ControlledTextField
                                name="shipping_address.street2"
                                label={`${t('table.column.address_line', {
                                    defaultValue: 'Address line',
                                })} 2 (${t('status.optional', {defaultValue: 'optional'})})`}
                                emptyIsNull
                                disabled={isDisabled}
                            />
                            <ControlledTextField
                                name="shipping_address.city"
                                label={t('table.column.city', {defaultValue: 'City'})}
                                disabled={isDisabled}
                            />
                            <ControlledSelect
                                name="shipping_address.country"
                                label={t('table.column.country_region', {
                                    defaultValue: 'Country/Region',
                                    interpolation: {escapeValue: false},
                                })}
                                placeholder={t('common_modal.form.field.select', {
                                    defaultValue: 'Select',
                                })}
                                options={CountryOptions}
                                disabled={isFedexSmartPost || isEditMode}
                            />
                            <Stack wrap={false}>
                                <div style={{width: 280}}>
                                    <ControlledTextField
                                        name="shipping_address.state"
                                        label={t('table.column.state', {defaultValue: 'State'})}
                                        emptyIsNull
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div style={{width: 280}}>
                                    <ControlledTextField
                                        name="shipping_address.postal_code"
                                        label={t('table.column.postal_code', {
                                            defaultValue: 'Postal code',
                                        })}
                                        emptyIsNull
                                        disabled={isDisabled}
                                    />
                                </div>
                            </Stack>
                            <PhoneNumberFieldWithCallingCode
                                callingCodeName="shipping_address.phone.country_code"
                                phoneNumberName="shipping_address.phone.number"
                                label={t('table.column.phone_number', {
                                    defaultValue: 'Phone number',
                                })}
                                disabled={isDisabled}
                            />
                            <ControlledTextField
                                name="shipping_address.email"
                                label={t('table.column.email', {defaultValue: 'Email'})}
                                disabled={isDisabled}
                            />
                        </Stack>
                    </Stack.Item>
                    <Divider />
                    <Stack.Item>
                        <Stack vertical>
                            <Subheading>{t('setting.title', {defaultValue: 'Setting'})}</Subheading>
                            <ControlledSelect
                                name="settings.preferred_currency"
                                label={t('table.column.preferred_currency_optional', {
                                    defaultValue: 'Preferred currency (optional)',
                                })}
                                placeholder={t('common_modal.form.field.select', {
                                    defaultValue: 'Select',
                                })}
                                options={currencyOptions}
                                helpText={t('fed_ex_modal.currency.help', {
                                    defaultValue:
                                        'For API users, you can specify the ISO 3 currency code to get shipping rates in the preferred currency.',
                                })}
                            />
                        </Stack>
                    </Stack.Item>
                    {/* it's easier to write in this way than to write style */}
                    {mode === METHOD.ADD && <Divider />}
                    {mode === METHOD.ADD && (
                        <Stack>
                            <Stack.Item>
                                <div className={styles.agreement}>
                                    <Checkbox
                                        label=""
                                        labelHidden
                                        checked={checked}
                                        onChange={setChecked}
                                    />
                                    <CheckboxLabel />
                                </div>
                            </Stack.Item>
                        </Stack>
                    )}
                </Stack>
            </Card>
        </FormLayout>
    );
};

function CheckboxLabel() {
    return (
        <TextStyle>
            <Trans i18nKey="fed_ex_modal.check_box.label" ns={NAMESPACE}>
                Check here to indicate that you have read and agree to{' '}
                <span
                    role="button"
                    tabIndex={-1}
                    className={styles.fedexLink}
                    onClick={() => window.open(FedexAgreementUrl)}
                >
                    FedEx End-User License Agreement
                </span>
                . The FedEx service marks and owned by Federal Express Corporatoin and used by
                permission.
            </Trans>
        </TextStyle>
    );
}

export default FedExCourierAccountForm;
