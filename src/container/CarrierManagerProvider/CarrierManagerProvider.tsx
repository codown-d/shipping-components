import {createContext, Dispatch, SetStateAction, useState, useContext, useMemo} from 'react';

import {USPS_DISCOUNTED} from '@/constants';
import useOpenCarrierAccountManagerModals, {
    IOpenCarrierAccountManagerModals,
} from '@/container/CarrierManagerProvider/hooks/useOpenCarrierAccountManagerModals';
import useOpenEditAccountModals, {
    IEditCarrierAccountModals,
} from '@/container/CarrierManagerProvider/hooks/useOpenEditAccountModals';
import {CourierAccount, useGetCourierAccounts} from '@/queries/carrierAccounts';
import {useGetRecharge, RechargeData} from '@/queries/carrierAccounts/recharge';
import {ILocationAddress} from '@/types/locations';

const configDefaultValue = {
    productName: '',
    trackingNumberPagePathName: '',
    text: {
        removeBanner: '',
    },
    carrierListDisplayBy: 'modal',
    carrierListContentConfig: {},
    editable: true,
};

export type CarrierItemConfig = {
    content?: string;
    disabled?: boolean;
};

export type ICarrierManagerStaticContext = {
    productName: string;
    trackingNumberPagePathName: string;
    text?: {
        removeBanner?: string;
    };
    billing?: {
        currentPlanName?: string;
        carrierAccountQuota?: number;
        onUpgrade?: VoidFunction;
    };
    // 默认提供 carrier list modal 的形式，如果需要以页面形式展示列表，则需要指明该项
    carrierListDisplayBy?: 'modal' | 'page';
    // 选择 carrier 时，有些 carrier 可能有合作，需要加上广告

    defaultShippingAddress?: ILocationAddress;
    carrierListContentConfig?: Record<string, CarrierItemConfig>;
};

export interface ICarrierManagerContext extends ICarrierManagerStaticContext {
    // 除了 usps 之外的数据
    carrierAccountsData: {data: CourierAccount[]; isLoading: boolean; refetch: VoidFunction};
    // usps account 数据
    uspsDiscountedAccountData: CourierAccount | null;
    // usps recharge 数据
    uspsRechargeData: {data: RechargeData | undefined; isLoading: boolean; refetch: VoidFunction};

    // 编辑单个 carrier account 的相关 modal -> shipping service, remove, edit account
    editSingleCarrierRelativeModals: IEditCarrierAccountModals;
    // 管理 carrier 的相关 modal：导入 carrier account、添加 carrier account
    carrierManagerModals: IOpenCarrierAccountManagerModals;

    toastMsg: string;
    setToast: Dispatch<SetStateAction<string>>;

    editable?: boolean; // 是否可以编辑 courier account 信息

    showUpgradeBanner: boolean;
}

export const useCarrierManagerValue = (
    config: ICarrierManagerStaticContext
): ICarrierManagerContext => {
    const [toastMsg, setToast] = useState<string>('');

    const allCarrierAccountsData = useGetCourierAccounts();

    const editSingleCarrierRelativeModals = useOpenEditAccountModals();

    const carrierManagerModals = useOpenCarrierAccountManagerModals();

    const uspsDiscountedAccountData =
        allCarrierAccountsData?.data?.find(({slug}) => slug === USPS_DISCOUNTED) ?? null;

    const uspsRechargeData = useGetRecharge({
        slug: uspsDiscountedAccountData?.slug,
        accountId: uspsDiscountedAccountData?.id,
    });

    const carrierAccountsData = useMemo(
        () => ({
            ...allCarrierAccountsData,
            data: allCarrierAccountsData?.data?.filter(({slug}) => slug !== USPS_DISCOUNTED),
        }),
        [allCarrierAccountsData]
    );

    const showUpgradeBanner = useMemo(
        () =>
            allCarrierAccountsData.data
                ?.filter(item => item.enabled && item.slug !== USPS_DISCOUNTED)
                ?.some(item => !!item?.upgrade_version && item?.upgrade_version > item?.version),
        [allCarrierAccountsData]
    );

    const configValue = Object.assign({}, configDefaultValue, config);

    return useMemo(
        () => ({
            ...configValue,
            showUpgradeBanner,
            carrierAccountsData,
            uspsDiscountedAccountData,
            editSingleCarrierRelativeModals,
            carrierManagerModals,
            toastMsg,
            setToast,
            uspsRechargeData,
        }),
        [
            showUpgradeBanner,
            configValue,
            toastMsg,
            carrierAccountsData,
            uspsDiscountedAccountData,
            editSingleCarrierRelativeModals,
            carrierManagerModals,
            uspsRechargeData,
        ]
    );
};

export const useCarrierManagerContext = () => {
    return useContext(CarrierManagerContext);
};

export const CarrierManagerContext = createContext<ICarrierManagerContext>(null as any);
