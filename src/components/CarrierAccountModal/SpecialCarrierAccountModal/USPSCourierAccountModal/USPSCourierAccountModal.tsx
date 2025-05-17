import {yupResolver} from '@hookform/resolvers/yup';
import {
    Card,
    FormLayout,
    Modal,
    Stack,
    Subheading,
    TextContainer,
    TextStyle,
} from '@shopify/polaris';
import isNumber from 'lodash/isNumber';
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {FormProvider} from 'react-hook-form';

import AccountIdCopySection from '../../CommonCarrierAccountModal/components/AccountIdCopySection';
import {useScrollToError} from '../hooks';

import AccountBalanceSection from './AccountBalanceSection';
import BillingAddress from './BillingAddress';
import CourierSection from './CourierSection';
import {useGetCourierModalDefaultValue, useSubmit} from './hooks';
import {credentialFields, getSchema} from './schema';
import {METHOD} from './types';

import Divider from '@/components/Divider';
import EditCarrierAccountBanner from '@/components/EditCarrierAccountBanner';
import ErrorBanner from '@/components/ErrorBanner';
import ControlledTextField from '@/components/FormFields/TextField';
import GenerateFields from '@/components/GenerateFields';
import LoadingModal from '@/components/LoadingModal';
import {USPS_DISCOUNTED} from '@/constants';
import {useHookForm} from '@/hooks/useHookForm';
import {useTestMode} from '@/hooks/useTestMode';
import {useI18next} from '@/i18n';
import {useGetCourierAccountById} from '@/queries/carrierAccounts';
import {useGetCourierBySlug} from '@/queries/couriers';
import {useGetShopifyStores} from '@/queries/stores';
import courierNameHandler from '@/utils/courierNameHandler';

interface IProps {
    accountId?: string;
    open: boolean;
    onClose: VoidFunction;
    onSave?: (id: string) => void;
    onCreatedAccountSuccess?: (id: string) => void;
    openUspsRechargeModal: VoidFunction;
    setToast: Dispatch<SetStateAction<string>>;
}

const courier = USPS_DISCOUNTED;

const USPSCourierAccountModal = ({
    accountId = '',
    open,
    onClose,
    onSave,
    setToast,
    onCreatedAccountSuccess,
    openUspsRechargeModal,
}: IProps) => {
    const {t} = useI18next();
    const modalContainer = useRef<HTMLDivElement>(null);
    const [invalidErrors, setInvalidErrors] = useState({});
    const status = accountId ? METHOD.edit : METHOD.add;
    const {data: courierInfo, isLoading: fetchCourierInfoLoading} = useGetCourierBySlug(courier);
    const {data: courierAccount, isLoading: fetchCourierAccountLoading} =
        useGetCourierAccountById(accountId); //有accountId时才获取
    const {data: stores, isLoading: fetchStoresLoading} = useGetShopifyStores();
    const accountBalance = courierAccount?.account_balance;
    const isFetchLoading =
        fetchCourierInfoLoading || fetchCourierAccountLoading || fetchStoresLoading;

    const {isTestMode} = useTestMode();
    const hasNextTopupStep: boolean = status === METHOD.add && courier === USPS_DISCOUNTED;
    const courierAccountDefaultValue = useGetCourierModalDefaultValue(courier, courierAccount);
    const methods = useHookForm({
        defaultValues: courierAccountDefaultValue,
        resolver: yupResolver(getSchema(courier)),
    });

    const version = courierAccount?.version || courierInfo?.courier_accounts?.[0]?.version;
    const {submitting, submit, errorInfo} = useSubmit({
        courier,
        version,
        courierAccount,
        stores,
        onSave,
        onCreatedAccountSuccess,
        onClose,
        setToast,
        status,
    });

    useScrollToError({hasError: Boolean(errorInfo), invalidErrors, modalContainer});

    if (open && (isFetchLoading || !courier)) {
        return (
            <LoadingModal
                loading={isFetchLoading}
                title={`${
                    status === METHOD.add
                        ? t('modal.set_up_account', {
                              name: courierInfo?.name || courier,
                              defaultValue: `Set up ${
                                  courierInfo?.name || courier
                              } carrier account`,
                          })
                        : t('modal.edit_account', {
                              name: courierAccount?.description,
                              defaultValue: `Edit ${courierAccount?.description}`,
                          })
                }`}
            />
        );
    }

    return (
        <Modal
            title={`${
                status === METHOD.add
                    ? isTestMode
                        ? t('modal.set_up_account.sandbox', {
                              name:
                                  courierNameHandler(courierInfo?.name) ||
                                  courierNameHandler(courier),
                              defaultValue: `Set up ${
                                  courierNameHandler(courierInfo?.name) ||
                                  courierNameHandler(courier)
                              } Sandbox carrier account`,
                          })
                        : t('modal.set_up_account', {
                              name:
                                  courierNameHandler(courierInfo?.name) ||
                                  courierNameHandler(courier),
                              defaultValue: `Set up ${
                                  courierNameHandler(courierInfo?.name) ||
                                  courierNameHandler(courier)
                              } carrier account`,
                          })
                    : t('modal.edit_account', {
                          name: courierAccount?.description,
                          defaultValue: `Edit ${courierAccount?.description}`,
                      })
            }`}
            open={open}
            onClose={onClose}
            primaryAction={{
                content: hasNextTopupStep
                    ? t('action.content.next', {defaultValue: 'Next'})
                    : t('action.content.submit', {defaultValue: 'Submit'}),
                onAction: methods.handleSubmit(submit, setInvalidErrors),
                loading: submitting,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: onClose,
                },
            ]}
            loading={isFetchLoading}
        >
            <div ref={modalContainer}>
                <FormProvider {...methods}>
                    {errorInfo && <ErrorBanner error={errorInfo} />}
                    <FormLayout>
                        <Card sectioned>
                            <Stack vertical>
                                <Stack.Item>
                                    <Stack>
                                        <CourierSection slug={courier} />
                                        {status === METHOD.edit && <EditCarrierAccountBanner />}
                                    </Stack>
                                </Stack.Item>
                                {status === METHOD.edit && (
                                    <Stack.Item>
                                        <Stack vertical>
                                            <Divider />
                                            <AccountIdCopySection accountId={accountId} />
                                            <Divider />
                                        </Stack>
                                    </Stack.Item>
                                )}
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
                                    {status === METHOD.edit &&
                                        courierAccount &&
                                        isNumber(accountBalance) && (
                                            <div style={{marginTop: 20}}>
                                                <AccountBalanceSection
                                                    carrierAccount={courierAccount}
                                                    onEditRecharge={openUspsRechargeModal}
                                                />
                                            </div>
                                        )}
                                </Stack.Item>
                                <Divider />
                                <Stack.Item>
                                    <Subheading>
                                        {t('fed_ex_modal.heading.credentials', {
                                            defaultValue: 'CREDENTIALS',
                                        })}
                                    </Subheading>
                                    <TextContainer>
                                        <GenerateFields fields={credentialFields} />
                                    </TextContainer>
                                    {courier === USPS_DISCOUNTED && (
                                        <BillingAddress stores={stores} slug={courier} />
                                    )}
                                    {courier === USPS_DISCOUNTED && !isTestMode && (
                                        <div style={{marginTop: 20}}>
                                            <TextContainer>
                                                <TextStyle variation="subdued">
                                                    {t('usps.discount.info', {
                                                        defaultValue:
                                                            'Note: Your free USPS account is provided by our partner Maersk, one of the largest USPS resellers. All postage fees are handled by Maersk. ',
                                                    })}
                                                    <br />
                                                    <br />
                                                </TextStyle>
                                            </TextContainer>
                                        </div>
                                    )}
                                </Stack.Item>
                            </Stack>
                        </Card>
                    </FormLayout>
                </FormProvider>
            </div>
        </Modal>
    );
};

export default USPSCourierAccountModal;
