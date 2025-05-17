import {FormLayout, TextStyle, Modal} from '@shopify/polaris';
import React, {useEffect, useMemo} from 'react';
import {FormProvider, useForm} from 'react-hook-form';

import DeletedServicesBanner from './DeletedServicesBanner';
import {getCourierAccountShippingServicesOptions, shippingServicesAdaptor} from './utils';

import ControlledChoiceList from '@/components/FormFields/ChoiceList';
import {IModalProps} from '@/container/CarrierAccountList/types';
import {useI18next} from '@/i18n';
import {useGetCourierAccountById} from '@/queries/carrierAccounts';
import {
    useEditCourierAccountsShippingServices,
    useGetCourierAccountsShippingServices,
} from '@/queries/carrierAccounts/shippingServices';
import {useGetCourierBySlug} from '@/queries/couriers';

const EditShippingServicesModal = ({
    open,
    slug = '',
    accountId = '',
    onClose,
    onSave,
    setToast,
}: IModalProps) => {
    const {t} = useI18next();
    // 获取 service 数据
    const {data: courierAccount, isLoading: fetchAccountLoading} =
        useGetCourierAccountById(accountId);
    const {data: courierAccountShippingServices, isLoading: fetchServicesLoading} =
        useGetCourierAccountsShippingServices(accountId);
    const {data: courier, isLoading: fetchCourierLoading} = useGetCourierBySlug(slug);

    const options = useMemo(() => {
        return getCourierAccountShippingServicesOptions(
            courier,
            courierAccount?.slug,
            courierAccount?.account_country
        );
    }, [courier, courierAccount]);

    const defaultValueOfEnabledShippingServices = useMemo(
        () =>
            courierAccountShippingServices?.shipping_services
                ?.filter(item => item?.enabled)
                .map(item => item?.service_type),
        [courierAccountShippingServices]
    );
    const methods = useForm();

    useEffect(() => {
        methods.reset({
            shipping_services: defaultValueOfEnabledShippingServices,
        });
    }, [defaultValueOfEnabledShippingServices]);

    const fetchLoading = fetchAccountLoading || fetchServicesLoading || fetchCourierLoading;

    // 更新 service 数据
    const {mutate, isLoading: submitting} = useEditCourierAccountsShippingServices(accountId);
    const updateShippingServices = methods.handleSubmit(data => {
        mutate(
            {
                shipping_services: shippingServicesAdaptor(data?.shipping_services ?? [], options),
            },
            {
                onSuccess: () => {
                    setToast(
                        t('toast.services_updated', {defaultValue: 'Shipping services updated.'})
                    );
                    onSave?.();
                    onClose();
                },
            }
        );
    });

    const shippingServices = methods.watch('shipping_services') ?? [];

    const isSelectZeroService = useMemo(() => {
        const services = shippingServicesAdaptor(shippingServices, options);
        return services.every(({enabled}) => !enabled);
    }, [shippingServices?.join(',')]);

    return (
        <Modal
            sectioned
            title={t('services_modal.title', {
                defaultValue: `Edit shipping services ${
                    courierAccount?.description ? ` - ${courierAccount.description}` : ''
                }`,
                description: courierAccount?.description ? ` - ${courierAccount.description}` : '',
            })}
            open={open}
            onClose={onClose}
            primaryAction={{
                content: t('action.content.confirm', {defaultValue: 'Confirm'}),
                loading: submitting,
                disabled: fetchLoading || isSelectZeroService,
                onAction: updateShippingServices,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: onClose,
                },
            ]}
            loading={fetchLoading}
        >
            <FormProvider {...methods}>
                <FormLayout>
                    <DeletedServicesBanner
                        accountServices={courierAccountShippingServices?.shipping_services ?? []}
                        courier={courier}
                    />
                    <TextStyle>
                        {t('services_modal.form.info', {
                            defaultValue: 'Select the services you want to use for shipping.',
                        })}
                    </TextStyle>
                    <ControlledChoiceList
                        name="shipping_services"
                        title={t('title.shipping_services', {defaultValue: 'Shipping services'})}
                        choices={options}
                        allowMultiple
                        haveSelectAll
                        titleHidden
                    />
                </FormLayout>
            </FormProvider>
        </Modal>
    );
};

export default EditShippingServicesModal;
