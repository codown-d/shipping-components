import {yupResolver} from '@hookform/resolvers/yup';
import {FormLayout, Card, Modal, Banner, Stack} from '@shopify/polaris';
import React, {useState, useMemo} from 'react';
import {FormProvider} from 'react-hook-form';
import * as yup from 'yup';

import ControlledSelect from '@/components/FormFields/Select';
import {IModalProps} from '@/container/CarrierAccountList/types';
import {useHookForm} from '@/hooks/useHookForm';
import {t, useI18next} from '@/i18n';
import {useGetRecharge, useUpdateRecharge} from '@/queries/carrierAccounts/recharge';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';
import {getCurrencySelectOptions} from '@/utils/intl';

const schema = yup.object().shape({
    threshold: yup.number().label(t('label.balance_threshold', 'Balance threshold')),
    amount: yup.number().label(t('label.recharge_amount', 'Recharge amount')),
});

const RechargeModal = ({open, slug, accountId, onClose, setToast, onSave}: IModalProps) => {
    const {t} = useI18next();
    const [errorMessage, setErrorMessage] = useState<string>('');

    // 回显数据
    const {data: recharge, isLoading: isFetchingRecharge} = useGetRecharge({slug, accountId});

    const defaultValues = useMemo(() => {
        const amount = recharge?.amount ?? 0;
        const threshold = recharge?.threshold ?? 0;
        return {
            amount: String(amount),
            threshold: String(threshold),
        };
    }, [recharge?.amount, recharge?.threshold]);

    // 表单及提交
    const methods = useHookForm({defaultValues, resolver: yupResolver(schema)});

    const {mutate: updateCourierAccountRecharge, isLoading: isUpdatingRecharge} = useUpdateRecharge(
        {slug, accountId}
    );

    const thresdHoldOptions = useMemo(
        () => getCurrencySelectOptions([0, 10, 25, 50, 100, 250, 500, 1000, 2000, 5000]),
        []
    );

    const amountOptions = useMemo(
        () => getCurrencySelectOptions([10, 20, 50, 100, 250, 500, 1000, 2000, 5000, 10000]),
        []
    );

    const onSubmit = methods.handleSubmit(({amount, threshold}) => {
        updateCourierAccountRecharge(
            {
                amount: Number(amount),
                threshold: Number(threshold),
            },
            {
                onSuccess: () => {
                    setToast(
                        t('toast.recharge.success', {
                            defaultValue: 'Auto recharge amount set up successfully.',
                        })
                    );
                    onSave?.();
                    onClose();
                },
                onError: error => {
                    const message = getErrorMessageByMeta(error);
                    setErrorMessage(message);
                },
            }
        );
    });
    return (
        <Modal
            title={t('auto_recharge.title', {defaultValue: 'Set up auto-recharge'})}
            loading={isFetchingRecharge}
            onClose={onClose}
            open={open}
            primaryAction={{
                content: t('action.content.submit', {defaultValue: 'Submit'}),
                onAction: onSubmit,
                loading: isUpdatingRecharge,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: onClose,
                },
            ]}
        >
            <Card.Section>
                <Stack vertical>
                    {errorMessage && (
                        <Banner status="critical" onDismiss={() => setErrorMessage('')}>
                            {errorMessage}
                        </Banner>
                    )}
                    <FormProvider {...methods}>
                        <FormLayout>
                            <FormLayout.Group
                                helpText={t('auto_recharge.form.help_text', {
                                    defaultValue:
                                        'You will be charged the recharge amount when you first generate a label.',
                                })}
                            >
                                <ControlledSelect
                                    name="threshold"
                                    label={t('auto_recharge.balance', {
                                        defaultValue: 'When balance drops below:',
                                    })}
                                    options={thresdHoldOptions}
                                />
                                <ControlledSelect
                                    name="amount"
                                    label={t('auto_recharge.amount', {
                                        defaultValue: 'Recharge by this amount:',
                                    })}
                                    options={amountOptions}
                                />
                            </FormLayout.Group>
                        </FormLayout>
                    </FormProvider>
                </Stack>
            </Card.Section>
        </Modal>
    );
};

export default RechargeModal;
