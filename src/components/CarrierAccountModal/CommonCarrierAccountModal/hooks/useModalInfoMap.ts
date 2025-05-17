import {useAuth} from '@aftership/automizely-product-auth';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import {useMemo, useCallback} from 'react';

import {t} from '@/i18n';
import {
    ICarrierAccountPayload,
    useAddCarrierAccountMutate,
    useEditCarrierAccountCommon,
} from '@/queries/carrierAccounts';
import {ResponseMeta} from '@/queries/response';

export enum ModalMode {
    ADD = 'ADD',
    EDIT = 'EDIT',
    UPGRADE = 'UPGRADE',
}

export interface ICarrierAccountModalFormValue {
    description: string;
    credentials?: ICarrierAccountPayload['credentials'];
    address?: ICarrierAccountPayload['address'];
    invoice?: ICarrierAccountPayload['invoice'];
    version?: ICarrierAccountPayload['version'];
}

export interface ICarrierAccountMutateOptions {
    onSuccess?: VoidFunction;
    onError?: (error: ResponseMeta<string>) => void;
}

interface ICarrierAccountModalInfo {
    titlePrefix: string;
    successMessage: string;
    defaultErrorMessage: string;
    submit: (values: ICarrierAccountModalFormValue, options?: ICarrierAccountMutateOptions) => void;
    isSubmitting: boolean;
}

interface IModalInfoParams {
    slug: string;
    mode: ModalMode;
    accountId: string;
    isAfterUpgrade?: boolean;
}

const isInvalidValue = (value: unknown) => {
    if (value === null || typeof value === 'undefined') {
        return true;
    }
    return false;
};

export const useModalInfoMap = (params: IModalInfoParams) => {
    const {slug, mode, accountId, isAfterUpgrade = false} = params;

    const [{organization}] = useAuth();

    const {mutate: addMutate, isLoading: isAddLoading} = useAddCarrierAccountMutate();

    const {mutate: editMutate, isLoading: isEditLoading} = useEditCarrierAccountCommon(accountId);

    const submit = useCallback(
        (values: ICarrierAccountModalFormValue, options?: ICarrierAccountMutateOptions) => {
            const {description, credentials, version, address, invoice} = values;

            const invoiceTransform = invoice?.enabled
                ? {
                      invoice: {
                          invoice_amount: invoice.invoice_amount,
                          invoice_number: invoice.invoice_number,
                          invoice_currency: invoice.invoice_currency,
                          control_id: invoice.control_id || null,
                          invoice_date: invoice.invoice_date
                              ? dayjs(invoice.invoice_date).format()
                              : '',
                      },
                  }
                : {};

            if (mode === 'ADD') {
                addMutate(
                    {
                        slug,
                        description,
                        credentials,
                        ...(invoice && invoiceTransform),
                        address: omitBy(address, isEmpty),
                        timezone: organization?.timezone_identifier || '',
                        version,
                    },
                    {
                        onSuccess: options?.onSuccess,
                        onError: options?.onError,
                    }
                );
            } else {
                editMutate(
                    omitBy(
                        {
                            slug,
                            description: description,
                            ...(invoice && invoiceTransform),
                            credentials: omitBy(credentials, isInvalidValue),
                            address: omitBy(address, isInvalidValue),
                            version,
                        },
                        isInvalidValue
                    ),
                    {
                        onSuccess: options?.onSuccess,
                        onError: options?.onError,
                    }
                );
            }
        },
        [addMutate, mode, slug, editMutate, organization]
    );

    const modalInfoMap = useMemo<Record<ModalMode, ICarrierAccountModalInfo>>(() => {
        const UPGRADE = {
            titlePrefix: t('action.content.upgrade', 'Upgrade'),
            successMessage: t('modal.upgrade.message.success', 'Carrier account upgraded'),
            defaultErrorMessage: t('modal.edit.message', 'Carrier account upgrad error'),
            submit,
            isSubmitting: isEditLoading,
        };
        return {
            ADD: {
                titlePrefix: t('action.content.set_up', 'Set up'),
                successMessage: t(
                    'modal.add.message.success',
                    'Carrier account set up successfully.'
                ),
                defaultErrorMessage: t('modal.add.message', 'Carrier account set up error.'),
                submit,
                isSubmitting: isAddLoading,
            },
            // 升级后走的是 edit，所以这里的逻辑是一样的，只是文案不一样
            EDIT: {
                titlePrefix: isAfterUpgrade
                    ? UPGRADE.titlePrefix
                    : t('action.content.edit', 'Edit'),
                successMessage: isAfterUpgrade
                    ? UPGRADE.successMessage
                    : t('modal.edit.message.success', 'Carrier account edit successfully.'),
                defaultErrorMessage: isAfterUpgrade
                    ? UPGRADE.defaultErrorMessage
                    : t('modal.edit.message', 'Carrier account edit error.'),
                submit,
                isSubmitting: isEditLoading,
            },
            UPGRADE: {
                titlePrefix: t('action.content.upgrade', 'Upgrade'),
                successMessage: t('modal.upgrade.message.success', 'Carrier account upgraded'),
                defaultErrorMessage: t('modal.edit.message', 'Carrier account upgrad error'),
                submit,
                isSubmitting: isEditLoading,
            },
        };
    }, [isAddLoading, isEditLoading, submit]);

    return modalInfoMap[mode];
};
