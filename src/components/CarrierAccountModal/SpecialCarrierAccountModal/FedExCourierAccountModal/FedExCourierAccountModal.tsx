import {yupResolver} from '@hookform/resolvers/yup';
import {Toast} from '@shopify/polaris';
import React, {useState, useRef} from 'react';
import {FormProvider} from 'react-hook-form';

import {useSubmit} from '../hooks';

import FedExCourierAccountForm from './components/FedExCourierAccountForm';
import {fedexSchema, addDefaultValue, editDefaultValue} from './schema';
import {METHOD} from './typings';
import {fedexNameMap} from './utils';

import CustomerModal from '@/components/CustomerModal';
import ErrorBanner from '@/components/ErrorBanner';
import LoadingModal from '@/components/LoadingModal';
import {IModalProps} from '@/container/CarrierAccountList/types';
import {useHookForm} from '@/hooks/useHookForm';
import {useI18next} from '@/i18n';
import {useGetCourierAccountById} from '@/queries/carrierAccounts';
import {useGetCourierBySlug} from '@/queries/couriers';
import {ILocationAddress} from '@/types/locations';

interface IFedexCourierModalProps extends IModalProps {
    defaultShippingAddress?: ILocationAddress;
}

const FedExCourierAccountModal = ({
    open,
    slug = '',
    accountId = '',
    defaultShippingAddress,
    onSave,
    onClose,
    onBack,
}: IFedexCourierModalProps) => {
    const {t} = useI18next();
    const modalContainer = useRef<HTMLDivElement>(null);
    const [toastMsg, setToast] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [accountCountry, setAccountCountry] = useState<string>();

    const mode: METHOD = accountId ? METHOD.EDIT : METHOD.ADD;
    const {data: courierInfo, isLoading} = useGetCourierAccountById(accountId);
    const {data: courier} = useGetCourierBySlug(slug);

    const version = courierInfo?.version || courier?.courier_accounts?.[0]?.version;

    const methods = useHookForm({
        defaultValues:
            mode === METHOD.ADD
                ? addDefaultValue(slug, defaultShippingAddress)
                : editDefaultValue(courierInfo),
        resolver: yupResolver(fedexSchema(slug, mode, accountCountry)),
    });

    const {errorInfo, submit, isSubmitting} = useSubmit({
        slug,
        version,
        mode,
        onClose,
        onSave,
        setToast,
        modalContainer,
        accountId,
        handleSubmit: methods.handleSubmit,
    });

    if (open && isLoading) {
        return (
            <LoadingModal
                loading={isLoading}
                title={`${
                    mode === METHOD.ADD
                        ? t('fed_ex_modal.loading.title.add', {
                              slug: fedexNameMap[slug],
                              defaultValue: `Set up ${fedexNameMap[slug]} carrier account`,
                          })
                        : t('fed_ex_modal.loading.title.edit', {
                              defaultValue: `Edit ${fedexNameMap[slug]}`,
                              slug: fedexNameMap[slug],
                          })
                }`}
            />
        );
    }

    return (
        <CustomerModal
            title={`${
                mode === METHOD.ADD
                    ? t('fed_ex_modal.loading.title.add', {
                          slug: fedexNameMap[slug],
                          defaultValue: `Set up ${fedexNameMap[slug]} carrier account`,
                      })
                    : t('fed_ex_modal.loading.title.edit', {
                          defaultValue: `Edit ${courierInfo?.description ?? ''}`,
                          slug: courierInfo?.description ?? '',
                      })
            }`}
            onClose={onClose}
            open={open}
            primaryAction={{
                content: t('action.content.submit', {defaultValue: 'Submit'}),
                onAction: submit,
                loading: isSubmitting,
                disabled: mode === METHOD.ADD && !checked,
            }}
            secondaryActions={
                mode === METHOD.ADD
                    ? [
                          {
                              content: t('action.content.back', {defaultValue: 'Back'}),
                              onAction: onBack,
                          },
                      ]
                    : undefined
            }
            loading={isLoading}
            withBackArrow={mode === METHOD.ADD}
            onBack={onBack}
        >
            {errorInfo && <ErrorBanner error={errorInfo} />}
            <div ref={modalContainer}>
                <FormProvider {...methods}>
                    <FedExCourierAccountForm
                        checked={checked}
                        setChecked={setChecked}
                        setAccountCountry={setAccountCountry}
                        mode={mode}
                        accountId={accountId}
                        slug={slug}
                    />
                </FormProvider>
            </div>
            {toastMsg && <Toast content={toastMsg} onDismiss={() => {}} />}
        </CustomerModal>
    );
};

export default FedExCourierAccountModal;
