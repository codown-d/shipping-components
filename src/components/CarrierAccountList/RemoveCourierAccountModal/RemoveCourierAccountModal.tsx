import {Card, Modal} from '@shopify/polaris';
import React, {useCallback, useMemo} from 'react';

import {IModalProps} from '@/container/CarrierAccountList/types';
import {useI18next} from '@/i18n';
import {useEditCarrierAccountPersonal, useGetCourierAccountById} from '@/queries/carrierAccounts';

// const DEFAULT_REMOVE_TEXT =
//     'Once removed, this carrier account will not be available when you add shipping info for labels.';

export default function RemoveCourierAccountModal({
    open,
    accountId = '',
    setToast,
    onClose,
    onSave,
    removeText,
}: IModalProps & {removeText?: string}) {
    const {t} = useI18next();
    const DEFAULT_REMOVE_TEXT = useMemo(
        () =>
            t('remove_account_modal.text', {
                defaultValue:
                    'Once removed, this carrier account will not be available when you add shipping info for labels.',
            }),
        [t]
    );
    const {data: courierAccount} = useGetCourierAccountById(accountId);

    const {mutate, isLoading} = useEditCarrierAccountPersonal(accountId);

    const handleRemoveBtnClick = useCallback(() => {
        mutate(
            {enabled: false},
            {
                onSuccess: () => {
                    setToast(
                        t('toast.account_removed', {defaultValue: 'Courier account removed.'})
                    );
                    onSave?.();
                    onClose();
                },
            }
        );
    }, [accountId, t]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t('remove_account_modal.title', {
                description: courierAccount?.description ?? '',
                slug: courierAccount?.slug ? ` (${courierAccount.slug})` : '',
                defaultValue: `Remove ${courierAccount?.description ?? ''}${
                    courierAccount?.slug ? ` (${courierAccount.slug})` : ''
                }`,
            })}
            primaryAction={{
                content: t('action.content.remove', {defaultValue: 'Remove'}),
                destructive: true,
                onAction: handleRemoveBtnClick,
                loading: isLoading,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: onClose,
                },
            ]}
        >
            <Card sectioned>{removeText || DEFAULT_REMOVE_TEXT}</Card>
        </Modal>
    );
}
