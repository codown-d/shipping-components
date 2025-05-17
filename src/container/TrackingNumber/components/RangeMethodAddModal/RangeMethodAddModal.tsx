import {yupResolver} from '@hookform/resolvers/yup';
import {Banner, Card, Stack, Select, Modal, Toast} from '@shopify/polaris';
import React, {useEffect, useState} from 'react';
import {FormProvider} from 'react-hook-form';

import {useRangeMethodConfig} from './hooks/useRangeMethodConfig';
import {IRangeMethodFiledValues, useRangeMethodSubmit} from './hooks/useRangeMethodSubmit';
import {getSchema} from './schema';

import TextField from '@/components/FormFields/TextField';
import {useHookForm} from '@/hooks/useHookForm';
import {t, useI18next} from '@/i18n';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

interface IAddTrackingNumberModalProps {
    open: boolean;
    onClose: VoidFunction;
}

const defaultValues: IRangeMethodFiledValues = {
    description: '',
    min: '',
    max: '',
};

const DEFAULT_ERROR_MESSAGE = t('default.error.message.add', 'Add tracking number error.');

const RangeMethodAddModal = (props: IAddTrackingNumberModalProps) => {
    const {t} = useI18next();
    const {open, onClose} = props;

    const [errorMessage, setErrorMessage] = useState('');
    const [label, setLabel] = useState<string>('');

    const {submit, isLoading, toastMsg} = useRangeMethodSubmit();

    const {labelOptions, trackingNumberRegex} = useRangeMethodConfig(label);

    const handleAddTrackingNumber = (values: IRangeMethodFiledValues) => {
        submit({
            ...values,
            label,
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

    useEffect(() => {
        if (labelOptions && labelOptions.length) {
            setLabel(labelOptions[0].value);
        }
    }, [labelOptions]);

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
                        {/* unused react-hook-form 👇🏻 */}
                        <Select
                            label={t('label.title', {defaultValue: 'Label'})}
                            placeholder={t('add_modal.select.placeholder', {
                                defaultValue: 'Select pool type',
                            })}
                            options={labelOptions}
                            value={label}
                            onChange={setLabel}
                        />
                        {/* used react-hook-form 👆🏻 */}
                        {!!label && (
                            <Stack vertical>
                                <TextField
                                    label={t('table.column.description', {
                                        defaultValue: 'Description',
                                    })}
                                    name="description"
                                />
                                <TextField
                                    label={t('table.column.from_number', {
                                        defaultValue: 'From number',
                                    })}
                                    name="min"
                                    placeholder={t('add_modal.from_number.placeholder', {
                                        defaultValue: 'Enter start of the range (number)',
                                    })}
                                />
                                <TextField
                                    label={t('table.column.to_number', {defaultValue: 'To number'})}
                                    name="max"
                                    placeholder={t('add_modal.to_number.placeholder', {
                                        defaultValue: 'Enter end of the range (number)',
                                    })}
                                />
                            </Stack>
                        )}
                    </FormProvider>
                </Stack>
            </Card.Section>
            {toastMsg && <Toast content={toastMsg} onDismiss={() => {}} />}
        </Modal>
    );
};

export default RangeMethodAddModal;
