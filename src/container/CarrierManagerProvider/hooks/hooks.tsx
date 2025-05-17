import {useEffect, useMemo} from 'react';

import {useCarrierManagerContext} from '../CarrierManagerProvider';

import {USPS_DISCOUNTED} from '@/constants';
import {
    CourierAccount,
    useGetCourierAccounts as useQueryGetCourierAccounts,
    CourierAccountType,
} from '@/queries/carrierAccounts';

const bindHandler = (
    existeHandler: VoidFunction | null,
    bindFunc: (func: VoidFunction) => void,
    handler?: VoidFunction
) => {
    if (!existeHandler && handler) {
        bindFunc(handler);
    }
};

// 给业务侧暴露使用的钩子
export const useCarrierAccountManagerModal = ({
    onSave,
    onClickAddNewAccount,
}: {
    onSave?: VoidFunction;
    onClickAddNewAccount?: VoidFunction;
}) => {
    const {
        carrierManagerModals: {
            carrierAccountManagerModal: {
                setOpen,
                onSaveHandler,
                bindSaveHandler,
                onClickAddNewAccountHandler,
                bindClickAddNewAccountSaveHandler,
            },
        },
    } = useCarrierManagerContext();

    return {
        open: () => {
            bindHandler(onSaveHandler, bindSaveHandler, onSave);
            bindHandler(
                onClickAddNewAccountHandler,
                bindClickAddNewAccountSaveHandler,
                onClickAddNewAccount
            );
            setOpen(true);
        },
        close: () => setOpen(false),
    };
};

export const useCarrierListModal = ({
    onClick,
    onCarrierItemSave,
}: {
    onClick?: VoidFunction;
    onCarrierItemSave?: VoidFunction;
}) => {
    const {
        carrierManagerModals: {
            carrierListModal: {
                setOpen,
                onClickHandler,
                bindClickHandler,
                onCarrierItemSaveHandler,
                bindCarrierItemSaveHandler,
            },
        },
    } = useCarrierManagerContext();

    // carrier list modal 挂载回调的时机应该是在使用这个 hook 的时候，而不是调用 open 方法的时候；
    // 因为 add other account 的 modal 弹出时机是有 sdk 决定的，需要挂载事件后续调用。
    useEffect(() => {
        bindHandler(onClickHandler, bindClickHandler, onClick);
        bindHandler(onCarrierItemSaveHandler, bindCarrierItemSaveHandler, onCarrierItemSave);
    }, [
        onClickHandler,
        onCarrierItemSaveHandler,
        bindClickHandler,
        bindCarrierItemSaveHandler,
        onClick,
        onCarrierItemSave,
    ]);

    return {
        open: () => {
            setOpen(true);
        },
        close: () => setOpen(false),
    };
};

export const useAddCarrierModal = ({onSave}: {onSave?: VoidFunction}) => {
    const {
        carrierManagerModals: {
            addCarrierModal: {setOpen, onSaveHandler, bindSaveHandler},
        },
    } = useCarrierManagerContext();

    return {
        open: () => {
            bindHandler(onSaveHandler, bindSaveHandler, onSave);
            setOpen(true);
        },
        close: () => setOpen(false),
    };
};

export const useGetCourierAccounts = ({
    enabled,
    includesUSPS = true,
}: {enabled?: boolean; includesUSPS?: boolean} = {}) => {
    const {carrierAccountsData, uspsDiscountedAccountData} = useCarrierManagerContext() || {};

    const queryData = useQueryGetCourierAccounts({
        enabledAccount: enabled,
        enabledQuery: !carrierAccountsData,
        includesUSPS,
    });

    // 没有 provdier 包裹的调用，直接请求接口数据
    if (!carrierAccountsData) {
        return queryData;
    }

    let carrierAccounts: CourierAccount[] = [];

    if (typeof enabled === 'boolean') {
        carrierAccounts = carrierAccountsData.data.filter(item => item.enabled === enabled);
    }

    if (includesUSPS && uspsDiscountedAccountData) {
        carrierAccounts = [...carrierAccounts, uspsDiscountedAccountData];
    }

    return {
        ...carrierAccountsData,
        data: carrierAccounts,
    };
};

export const useGetUSPSDiscountedAccount = () => {
    const {data: userAccounts} = useQueryGetCourierAccounts({includesUSPS: true});

    return useMemo(
        () => userAccounts?.find(({slug}) => slug === USPS_DISCOUNTED) ?? null,
        [userAccounts]
    );
};

export const useGetHasPendingImportCarrierAccount = () => {
    const {carrierAccountsData} = useCarrierManagerContext() || {};

    const queryData = useQueryGetCourierAccounts({
        enabledQuery: !carrierAccountsData,
        includesUSPS: false, // 判断是否有需要导入的 carrier account，需要把 usps filter 掉
    });

    let data = carrierAccountsData;

    // 没有 provdier 包裹的调用，直接请求接口数据
    if (!carrierAccountsData) {
        data = queryData;
    }

    // 如果没被打开 && 用户自己的号才可以导入
    return useMemo(
        () =>
            data?.data?.some(
                ({enabled, type}: CourierAccount) => !enabled && type === CourierAccountType.user
            ),
        [data]
    );
};

export function useShouldUpgradeAccount() {
    const {showUpgradeBanner} = useCarrierManagerContext();
    return showUpgradeBanner;
}
