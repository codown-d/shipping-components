import {yupResolver} from '@hookform/resolvers/yup';
import {Card, Stack, Toast, Modal, Banner} from '@shopify/polaris';
import React, {useState} from 'react';
import {FormProvider} from 'react-hook-form';

import {useTrackingNumberContext} from '../../hooks/useTrackingNumberContext';

import {IValuesMethodFiledValues, useValuesMethodSubmit} from './hooks/useValuesMethodSubmit';
import {getSchema} from './schema';

import TextField from '@/components/FormFields/TextField';
import {useHookForm} from '@/hooks/useHookForm';
import {useI18next, t} from '@/i18n';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

interface IAddTrackingNumberModalProps {
    open: boolean;
    onClose: VoidFunction;
}

const defaultValues: IValuesMethodFiledValues = {
    description: '',
    data: '',
};

const DEFAULT_ERROR_MESSAGE = t('default.error.message.add', 'Add tracking number error.');

const ValuesMethodAddModal = (props: IAddTrackingNumberModalProps) => {
    const {t} = useI18next();
    const {open, onClose} = props;

    const [errorMessage, setErrorMessage] = useState('');
    const {preAssignedNumberConfigs} = useTrackingNumberContext();

    const trackingNumberRegex = preAssignedNumberConfigs[0]?.tracking_number_regex || '';

    const {submit, isLoading, toastMsg} = useValuesMethodSubmit();

    const handleAddTrackingNumber = (values: IValuesMethodFiledValues) => {
        submit({
            ...values,
            onSuccess: () => {
                onClose();
            },
            onError: error => {
                const message = getErrorMessageByMeta(error, DEFAULT_ERROR_MESSAGE);
                setErrorMessage(message);
            },
        });
    };

    const methods = useHookForm({
        defaultValues,
        resolver: yupResolver(getSchema(trackingNumberRegex)),
    });

    return (
        <Modal
            title={t('add_modal.title', {defaultValue: 'Add tracking number'})}
            open={open}
            onClose={onClose}
            secondaryActions={[
                {content: t('action.content.cancel', {defaultValue: 'Cancel'}), onAction: onClose},
            ]}
            primaryAction={{
                content: t('action.content.submit', {defaultValue: 'Submit'}),
                loading: isLoading,
                onAction: methods.handleSubmit(handleAddTrackingNumber),
            }}
        >
            <Card.Section>
                <Stack vertical>
                    {errorMessage && (
                        <Banner
                            status="critical"
                            onDismiss={() => {
                                setErrorMessage('');
                            }}
                        >
                            {errorMessage}
                        </Banner>
                    )}
                    <FormProvider {...methods}>
                        <TextField
                            label={t('add_modal.desc', {defaultValue: 'Description'})}
                            name="description"
                        />
                        <TextField
                            label={t('add_modal.tracking_number', {
                                defaultValue: 'Tracking numbers',
                            })}
                            name="data"
                            multiline={4}
                            placeholder={t('add_modal.tracking_number.placeholder', {
                                defaultValue: 'One tracking number per line, Max 5000.',
                            })}
                        />
                    </FormProvider>
                </Stack>
            </Card.Section>
            {toastMsg && <Toast content={toastMsg} onDismiss={() => {}} />}
        </Modal>
    );
};

export default ValuesMethodAddModal;
