import {useMemo} from 'react';

import {
    CourierAccountsData,
    CourierAccount,
    ICarrierAccountPayload,
    ICarrierAccountSpecificPayload,
    BatchCarrierAccountPayload,
    USPSCarrierAccountPayload,
    DeleteCarrierAccountPayload,
} from './types';

import {USPS_DISCOUNTED} from '@/constants';
import useMutation from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import {
    CredentialsRequest,
    CredentialsResponse,
    RegistrationUrlRequest,
    RegistrationUrlResponse,
    useGetAllCouriers,
} from '@/queries/couriers';
import {request} from '@/utils/network';

export const useGetCourierAccounts = ({
    enabledAccount,
    enabledQuery = true,
    includesUSPS = true,
}: {enabledAccount?: boolean; enabledQuery?: boolean; includesUSPS?: boolean} = {}) => {
    const {
        data: {all},
    } = useGetAllCouriers({enabledQuery});

    const supportSlug = useMemo(() => all.map(item => item.slug), [all]);

    const res = useQuery<CourierAccountsData>(() => request('/v4/me/courier-accounts'), {
        enabled: enabledQuery,
    });

    const data = useMemo(
        () =>
            res.data?.courier_accounts
                ?.filter(item => {
                    const isSupported = supportSlug.includes(item.slug);

                    // usps 较为特殊，不看 enabled 字段
                    if (item.slug === USPS_DISCOUNTED) return isSupported && includesUSPS;

                    if (typeof enabledAccount === 'boolean') {
                        if (enabledAccount) {
                            return item.enabled && isSupported;
                        } else {
                            return !item.enabled && isSupported;
                        }
                    } else {
                        return isSupported;
                    }
                })
                .map(accounts => {
                    const courierData = all?.find(({slug}) => slug === accounts.slug);

                    return {
                        ...accounts,
                        originSlugName: courierData?.name ?? '',
                    };
                }) ?? [],
        [enabledAccount, res.data?.courier_accounts, supportSlug, includesUSPS, all]
    );

    return useMemo(() => {
        return {
            ...res,
            data,
        };
    }, [res, data]);
};

export const useGetCourierAccountById = (id: string) => {
    return useQuery<CourierAccount>(() => request(`/v4/me/courier-accounts/${id}`), {
        enabled: Boolean(id),
    });
};

export const useAddCarrierAccountMutate = () => {
    return useMutation<ICarrierAccountPayload, CourierAccount>(payload => {
        return request('/v4/me/courier-accounts', {
            method: 'POST',
            body: payload,
        });
    });
};

// enabled / shipping-services / custom-fields 字段为各业务独有，通过该接口修改
export const useEditCarrierAccountPersonal = (accountId: string) => {
    return useMutation<ICarrierAccountSpecificPayload, CourierAccount>(payload => {
        return request(`/v4/me/courier-accounts/${accountId}/personal-settings`, {
            method: 'PATCH',
            body: payload,
        });
    });
};

// 批量编辑 Carrier Accounts
export const useEditCarrierAccountsPersonal = () => {
    return useMutation((payload: ICarrierAccountSpecificPayload[]) => {
        return request('/v4/me/batch/courier-accounts/personal-settings', {
            method: 'PATCH',
            body: payload,
        });
    });
};

// 除了上面业务独有的字段，其他通用字段通过该接口修改
export const useEditCarrierAccountCommon = (accountId: string) => {
    return useMutation<ICarrierAccountPayload, CourierAccount>(payload => {
        return request(`/v4/me/courier-accounts/${accountId}`, {
            method: 'PATCH',
            body: payload,
        });
    });
};

// 批量修改 enabled
export const useEditCourierAccountsEnabled = () => {
    return useMutation<BatchCarrierAccountPayload, CourierAccountsData>(params =>
        request('/v4/me/courier-accounts', {
            method: 'PATCH',
            body: params,
        })
    );
};

// 创建 usps 账号
export const useAddUspsDiscountedCourierAccount = () => {
    return useMutation<USPSCarrierAccountPayload, CourierAccount>(payload => {
        return request(`/v4/me/couriers/usps-discounted/courier-accounts`, {
            method: 'POST',
            body: payload,
        });
    });
};

// 更改 usps 账号
export const useEditUspsDiscountedCourierAccount = (accountId: string) => {
    return useMutation<USPSCarrierAccountPayload['credit_card'], CourierAccount>(payload => {
        return request(
            `/v4/me/couriers/usps-discounted/courier-accounts/${accountId}/credit-card`,
            {
                method: 'PUT',
                body: payload,
            }
        );
    });
};

// 删除 usps 账号
export const useDeleteCarrierAccount = () => {
    return useMutation<DeleteCarrierAccountPayload, CourierAccount>(({accountId}) => {
        return request(`/v4/me/courier-accounts/${accountId}`, {
            method: 'DELETE',
        });
    });
};

// canada-post 相关
export const useGetRegisterUrl = () => {
    return useMutation<RegistrationUrlRequest, RegistrationUrlResponse>(payload => {
        return request('/v4/me/couriers/canada-post/registration-urls', {
            body: payload,
            method: 'POST',
        });
    });
};

export const useGetCredentials = () => {
    return useMutation<CredentialsRequest, CredentialsResponse>(
        payload => {
            return request('/v4/me/couriers/canada-post/credentials', {
                body: payload,
                method: 'POST',
            });
        },
        {
            retryDelay: 2000,
            retry: 10,
        }
    );
};
