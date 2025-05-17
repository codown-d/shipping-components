import {Stack, Banner, SkeletonBodyText, Modal} from '@shopify/polaris';
import React, {useEffect, useMemo, useState} from 'react';
import {FormProvider} from 'react-hook-form';

import CarrierSection from '../CarrierSection';

import AccountIdCopySection from './components/AccountIdCopySection';
import ModalContent from './components/ModalFormContent/ModalContent';
import UPSAgreement from './components/UPSSection/Agreement';
import {getFromCanadapost} from './hooks/useCanadaPostCarrier';
import {useCarrierAccountFieldList} from './hooks/useCarrierAccountFieldList';
import useCarrierAccountForm from './hooks/useCarrierAccountForm';
import {ModalMode, useModalInfoMap} from './hooks/useModalInfoMap';
import {useOauth2LoginStatus} from './hooks/useOauth2DataAfterLogin';

import CustomerModal from '@/components/CustomerModal';
import Divider from '@/components/Divider';
import EditCarrierAccountBanner from '@/components/EditCarrierAccountBanner';
import {needAgreementCarrierSlugs, showInvoiceCarrierSlugs, UPSCarrierSlugs} from '@/constants';
import {IModalProps} from '@/container/CarrierAccountList/types';
import {useI18next} from '@/i18n';
import {useGetCourierAccountById} from '@/queries/carrierAccounts';
import {useGetCourierBySlug} from '@/queries/couriers';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

const CommonCarrierAccountModal = ({
    open,
    slug = '',
    accountId = '',
    isBeforeUpgrade,
    isAfterUpgrade,
    onSave,
    setToast,
    onClose,
    onBack,
}: IModalProps) => {
    const {t} = useI18next();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const mode: ModalMode = useMemo(() => {
        if (isBeforeUpgrade) return ModalMode.UPGRADE;
        return accountId ? ModalMode.EDIT : ModalMode.ADD;
    }, [accountId, isBeforeUpgrade]);

    // 用于 mode = EDIT 表单回显
    const {data: carrierAccountData, isLoading: isCarrierAccountLoading} =
        useGetCourierAccountById(accountId);

    // 用于 courier 表单特性 —— 基础规则
    const {data: carrierData, isLoading: isCarrierLoading} = useGetCourierBySlug(slug);

    const {name = '', guide = '', courier_accounts = []} = carrierData || {};
    const {courierAccountSchema, dynamicFormInfo} = useCarrierAccountFieldList({
        mode,
        slug,
        courierAccountsSchema: courier_accounts,
        version: carrierAccountData?.version,
        isAfterUpgrade,
    });

    const oauth2Enabled = !!courierAccountSchema?.oauth_enabled;

    // 用于 courier 表单特性 —— 特殊规则
    const {isBeforeCanadapostLogin} = getFromCanadapost(slug, mode);
    const {isBeforeOauth2Login} = useOauth2LoginStatus(oauth2Enabled, mode);
    const [agreementChecked, setAgreementChecked] = useState<boolean>(
        !needAgreementCarrierSlugs.includes(slug)
    );
    const showUPSAgreement = UPSCarrierSlugs.includes(slug) && mode === 'ADD' && !oauth2Enabled;
    const showInvoice = showInvoiceCarrierSlugs.includes(slug) && !oauth2Enabled;

    // 生成表单
    const {methods, isEditFormDirty} = useCarrierAccountForm({
        slug,
        mode,
        version: courierAccountSchema?.version,
        dynamicFormInfo,
        showInvoice,
        carrierAccountData,
    });
    useEffect(() => {
        if (courierAccountSchema?.version) {
            methods.register('version');
            methods.setValue('version', courierAccountSchema?.version);
        }
    }, [courierAccountSchema]);

    const formDisabled =
        isAfterUpgrade && !courierAccountSchema?.upgrade_fields?.length
            ? !!errorMessage
            : isBeforeCanadapostLogin ||
              !isEditFormDirty ||
              (!agreementChecked && mode === 'ADD' && !oauth2Enabled) ||
              isBeforeOauth2Login;

    // mode = 'ADD' || 'EDIT' || 'UPGRADE' 不同的文本和提交行为
    const {titlePrefix, successMessage, defaultErrorMessage, submit, isSubmitting} =
        useModalInfoMap({
            slug,
            mode,
            accountId,
            isAfterUpgrade,
        });

    const handleAddSubmit = methods.handleSubmit(
        values => {
            submit(
                {
                    ...values,
                    version: courierAccountSchema?.version,
                },
                {
                    onSuccess: () => {
                        setToast(successMessage);
                        onSave?.();
                        onClose();
                    },
                    onError: error => {
                        const message = getErrorMessageByMeta(error, defaultErrorMessage);
                        setErrorMessage(message);
                    },
                }
            );
        },
        error => {
            console.error('Invalid form - ', error);
        }
    );

    const isDataFetching = !carrierData || isCarrierLoading || isCarrierAccountLoading;

    return (
        <CustomerModal
            title={t('common_modal.title', {
                titlePrefix,
                name,
                defaultValue: `${titlePrefix} ${name} carrier account`,
            })}
            open={open}
            onClose={onClose}
            secondaryActions={
                mode === 'ADD'
                    ? [
                          {
                              content: t('action.content.back', {defaultValue: 'Back'}),
                              onAction: onBack,
                          },
                      ]
                    : undefined
            }
            primaryAction={{
                content: t('action.content.submit', {defaultValue: 'Submit'}),
                onAction: handleAddSubmit,
                loading: isSubmitting,
                disabled: formDisabled,
            }}
            loading={isDataFetching}
            onBack={onBack}
            withBackArrow={mode === 'ADD'}
        >
            <Modal.Section>
                {isDataFetching ? (
                    <SkeletonBodyText lines={8} />
                ) : (
                    <>
                        <Stack vertical>
                            {errorMessage && (
                                <Banner status="critical" onDismiss={() => setErrorMessage('')}>
                                    {errorMessage}
                                </Banner>
                            )}
                            <CarrierSection slug={slug} name={name} guideUrl={guide} />
                            {mode === 'EDIT' && <EditCarrierAccountBanner />}
                            <Divider />
                            {mode === 'EDIT' && <AccountIdCopySection accountId={accountId} />}
                            {mode === 'EDIT' && <Divider />}
                        </Stack>
                        <FormProvider {...methods}>
                            <ModalContent
                                accountId={accountId}
                                dynamicFormInfo={dynamicFormInfo}
                                mode={mode}
                                oauth2Enabled={oauth2Enabled}
                                showInvoice={showInvoice}
                                showDivider={showUPSAgreement}
                                slug={slug}
                                onErrorMessage={setErrorMessage}
                                name={name}
                            />
                        </FormProvider>
                        {showUPSAgreement && (
                            <UPSAgreement
                                checked={agreementChecked}
                                onChecked={setAgreementChecked}
                            />
                        )}
                    </>
                )}
            </Modal.Section>
        </CustomerModal>
    );
};

export default CommonCarrierAccountModal;
