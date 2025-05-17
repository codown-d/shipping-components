import {Card, Modal} from '@shopify/polaris';
import React, {useCallback, useMemo} from 'react';

import {USPS_DISCOUNTED} from '@/constants';
import {IModalProps} from '@/container/CarrierAccountList/types';
import {t, useI18next} from '@/i18n';
import {useDeleteCarrierAccount, useGetCourierAccountById} from '@/queries/carrierAccounts';

const removeTextSlugMap: Record<string, string> = {
    [USPS_DISCOUNTED]: t(
        'usps.remove.text',
        `Once deleted, this carrier account will not be available on both AfterShip Returns and AfterShip Shipping. The account balance will be refunded to you in around 4 weeks.`
    ),
};

export default function DeleteCourierAccountModal({
    open,
    accountId = '',
    setToast,
    onClose,
    onSave,
}: IModalProps) {
    const {t} = useI18next();
    const {data: courierAccount} = useGetCourierAccountById(accountId);

    const {mutate, isLoading} = useDeleteCarrierAccount();

    const handleDeleteBtnClick = useCallback(() => {
        mutate(
            {accountId},
            {
                onSuccess: () => {
                    setToast(
                        t('toast.account_deleted', {defaultValue: 'Courier account deleted.'})
                    );
                    onSave?.();
                    onClose();
                },
            }
        );
    }, [accountId, t]);

    const removeText = useMemo(() => {
        if (courierAccount?.slug && removeTextSlugMap[courierAccount.slug])
            return removeTextSlugMap[courierAccount.slug];

        return t('usps.remove.text.default', {
            defaultValue: `Once deleted, this carrier account will not be available on both AfterShip Returns and AfterShip Shipping.`,
        });
    }, [courierAccount?.slug, t]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t('delete_account_modal.title', {
                description: courierAccount?.description ?? '',
                slug: courierAccount?.slug ? ` (${courierAccount.slug})` : '',
                defaultValue: `Delete ${courierAccount?.description ?? ''}${
                    courierAccount?.slug ? ` (${courierAccount.slug})` : ''
                }`,
            })}
            primaryAction={{
                content: t('action.content.delete', {defaultValue: 'Delete'}),
                destructive: true,
                onAction: handleDeleteBtnClick,
                loading: isLoading,
            }}
            secondaryActions={[
                {
                    content: t('action.content.cancel', {defaultValue: 'Cancel'}),
                    onAction: onClose,
                },
            ]}
        >
            <Card sectioned>{removeText}</Card>
        </Modal>
    );
}
