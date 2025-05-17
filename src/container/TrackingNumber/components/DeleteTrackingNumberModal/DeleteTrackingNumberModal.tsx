import {TextStyle, Stack, Banner, Toast, Modal} from '@shopify/polaris';
import React, {useState} from 'react';

import {useTrackingNumberContext} from '../../hooks/useTrackingNumberContext';

import {t, useI18next} from '@/i18n';
import {useDeleteTrackingNumber} from '@/queries/trackingNumber';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

const DEFAULT_ERROR_MESSAGE = t('default.error.message.delete', 'Delete tracking number error.');

const DeleteTrackingNumberModal = () => {
    const {t} = useI18next();
    const [errorMessage, setErrorMessage] = useState('');

    const {deleteModalInfo, closeDeleteModal, refetchTrackingNumber} = useTrackingNumberContext();
    const {mutate, isLoading} = useDeleteTrackingNumber();
    const [toastMsg, setToast] = useState<string>('');

    const {
        active,
        info: {pool, type, available_count, max, data, id},
    } = deleteModalInfo;

    const handleDeleteTrackingNumber = () => {
        mutate(id, {
            onSuccess: () => {
                setToast(
                    t('delete_modal.toast.success', {
                        defaultValue: 'Tracking number deleted successfully',
                    })
                );
                closeDeleteModal();
                refetchTrackingNumber();
            },
            onError: error => {
                const message = getErrorMessageByMeta(error, DEFAULT_ERROR_MESSAGE);
                setErrorMessage(message);
            },
        });
    };

    return (
        <Modal
            title={t('delete_modal.title', {defaultValue: 'Are you sure to delete?'})}
            open={active}
            onClose={closeDeleteModal}
            primaryAction={{
                content: t('action.content.delete', {defaultValue: 'Delete'}),
                onAction: handleDeleteTrackingNumber,
                loading: isLoading,
                destructive: true,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: closeDeleteModal,
                },
            ]}
        >
            <Modal.Section>
                <Stack vertical alignment="center">
                    {errorMessage && (
                        <Banner status="critical" onDismiss={() => setErrorMessage('')}>
                            {errorMessage}
                        </Banner>
                    )}
                    <TextStyle variation="strong">
                        {type === 'range' && `${pool}, ${type}, ${available_count}/${max}`}
                        {type === 'values' && `${pool}, ${type}, ${available_count}/${data.length}`}
                    </TextStyle>
                </Stack>
                {toastMsg && <Toast content={toastMsg} onDismiss={() => {}} />}
            </Modal.Section>
        </Modal>
    );
};

export default DeleteTrackingNumberModal;
