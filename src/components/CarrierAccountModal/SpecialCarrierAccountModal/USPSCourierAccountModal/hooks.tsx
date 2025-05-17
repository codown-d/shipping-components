import dayjs from 'dayjs';
import {Dispatch, SetStateAction, useCallback} from 'react';

import {AddressSource, METHOD} from './types';
import {getEarliestStore, storeAddressToBillingAddress} from './utils';

import {USPS_DISCOUNTED} from '@/constants';
import {
    CourierAccount,
    useAddUspsDiscountedCourierAccount,
    useEditCarrierAccountCommon,
    useEditUspsDiscountedCourierAccount,
    USPSCarrierAccountPayload,
} from '@/queries/carrierAccounts';
import {StoresState} from '@/queries/stores';
import {getIsInTestMode} from '@/utils/routes';

const creditCardErrorCode = 42212;

export const useSubmit = ({
    courier,
    version,
    courierAccount,
    stores,
    onSave,
    onCreatedAccountSuccess,
    onClose,
    setToast,
    status,
}: {
    courier: string;
    version?: number;
    courierAccount?: CourierAccount;
    stores?: StoresState;
    onSave?: (id: string) => void;
    onCreatedAccountSuccess?: (id: string) => void;
    onClose: VoidFunction;
    setToast: Dispatch<SetStateAction<string>>;
    status: METHOD;
}) => {
    //只针对usps，去掉了旧有的分支逻辑
    const {
        mutate: createUspsDiscountedCourierAccount,
        error: createError,
        isLoading: createUspsDiscountedCourierAccountLoading,
    } = useAddUspsDiscountedCourierAccount();
    const {
        mutate: updateUspsDiscountedCourierAccount,
        error: updateUspsError,
        isLoading: updateUspsDiscountedCourierAccountLoading,
    } = useEditUspsDiscountedCourierAccount(courierAccount?.id ?? '');
    const {
        mutate: updateCourierAccount,
        error: updateError,
        isLoading: updateCourierAccountLoading,
    } = useEditCarrierAccountCommon(courierAccount?.id ?? '');

    const submitting =
        createUspsDiscountedCourierAccountLoading ||
        updateUspsDiscountedCourierAccountLoading ||
        updateCourierAccountLoading;

    const onSubmit = useCallback(
        data => {
            if (status === METHOD.add) {
                const postPayload = {
                    description: data.description,
                    credit_card: {
                        number: data.credit_card_number,
                        expiration_month: data.card_expiration_month,
                        holder_name: data.card_holder_name,
                        expiration_year: data.card_expiration_year,
                        security_code: data.card_security_code,
                        billing_address: data.credit_card.billing_address,
                    },
                    slug: courier,
                    version,
                };

                if (postPayload.credit_card.billing_address.source === AddressSource.SHOPIFY) {
                    const earliestStore = getEarliestStore(stores?.stores);
                    postPayload.credit_card.billing_address = {
                        ...postPayload.credit_card.billing_address,
                        ...storeAddressToBillingAddress(earliestStore),
                    };
                }

                const create = (payload: USPSCarrierAccountPayload) =>
                    createUspsDiscountedCourierAccount(payload, {
                        onSuccess: res => {
                            setToast('Courier account set up successfully.');
                            onCreatedAccountSuccess?.(res.id);
                            // 还需要打开 recharge modal，所以不调用 onclose
                        },
                        onError: error => {
                            const errorCode = error.code;
                            const retryPayload = {
                                ...postPayload,
                                credit_card: {
                                    billing_address: postPayload.credit_card.billing_address,
                                },
                            };

                            if (errorCode === creditCardErrorCode) {
                                // 加 setTimeout 的原因：若同步，执行 retry 请求后，前一个请求 isloading 才设置为 false，从而覆盖了 retry 请求 isloading 为 true 的状态
                                setTimeout(() => create(retryPayload), 0);
                            }
                        },
                    });

                create(postPayload);
                return;
            }

            const updatePayload = {
                description: data?.description,
                credit_card: {
                    number: data.credit_card_number,
                    expiration_month: data.card_expiration_month,
                    holder_name: data.card_holder_name,
                    expiration_year: data.card_expiration_year,
                    security_code: data.card_security_code,
                    billing_address: data.credit_card.billing_address,
                },
                slug: courier,
                version,
            };

            if (updatePayload.credit_card.billing_address.source === AddressSource.SHOPIFY) {
                const earliestStore = getEarliestStore(stores?.stores);
                updatePayload.credit_card.billing_address = {
                    ...updatePayload.credit_card.billing_address,
                    ...storeAddressToBillingAddress(earliestStore),
                };
            }
            updateCourierAccount({description: updatePayload.description});
            updateUspsDiscountedCourierAccount(updatePayload.credit_card, {
                onSuccess: () => {
                    setToast('Courier account updated.');
                    onClose();
                },
            });
        },
        [courierAccount, status, stores, courier]
    );

    return {
        submitting,
        submit: onSubmit,
        errorInfo:
            updateUspsError ||
            updateError ||
            (createError?.code !== creditCardErrorCode && createError),
    };
};

export const useGetCourierModalDefaultValue = (slug: string, courierAccount?: CourierAccount) => {
    const isTestMode = getIsInTestMode();

    const version = courierAccount?.version;

    if (!courierAccount && slug === USPS_DISCOUNTED) {
        if (isTestMode) {
            return {
                credit_card_number: '4242424242424242',
                card_holder_name: 'Test',
                card_expiration_month: '10',
                card_expiration_year: dayjs().add(10, 'year').format('YYYY'),
                card_security_code: '123',
                credit_card: {
                    billing_address: {
                        source: AddressSource.MANUAL,
                        country: 'USA',
                        street2: '',
                    },
                },
                version,
            };
        }
        return {
            credit_card: {
                billing_address: {
                    source: AddressSource.MANUAL,
                    country: 'USA',
                    street2: '',
                },
            },
            version,
        };
    }

    return courierAccount;
};
