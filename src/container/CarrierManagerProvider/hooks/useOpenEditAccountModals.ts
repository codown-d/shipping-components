import {useState, useMemo} from 'react';

import {CourierAccount} from '@/queries/carrierAccounts';
import {ICourierInfo} from '@/queries/couriers';

export enum ModalName {
    common = 'common',
    fedex = 'fedex',
    fedexSmartPost = 'fedexSmartPost',
    usps = 'usps',
    shippingService = 'shippingService',
    removeAccount = 'removeAccount',
    uspsRecharge = 'uspsRecharge',
    upgrade = 'upgrade',
}

export const courierModalmap: Record<string, ModalName> = {
    'fedex-smartpost': ModalName.fedexSmartPost,
    fedex: ModalName.fedex,
    'usps-discounted': ModalName.usps,
};

export interface IEditCarrierAccountModals {
    currentEditCarrierInfo: ICourierInfo | null; // 当前正在编辑的 carrier 信息
    currentModalName: ModalName | null;
    openEditShippingServiceModal: (courier: ICourierInfo) => void;
    openEditCourierAccountModal: (carrierAccount: CourierAccount, isAfterUpgrade?: boolean) => void;
    openUpgradeAccountModal: (carrierAccount: CourierAccount) => void;
    openRemoveCourierModal: (accountId: string) => void;
    openEditUspsRechargeModal: VoidFunction;
    closeModal: () => void;
}

// 管理 modal 的 hooks
const useOpenEditAccountModals = (): IEditCarrierAccountModals => {
    const [currentCarrier, setCurrentCarrier] = useState<ICourierInfo | null>(null);
    const [currentModalName, setCurrentModalName] = useState<ModalName | null>(null);

    const openEditShippingServiceModal = (courier: ICourierInfo) => {
        setCurrentCarrier(courier);
        setCurrentModalName(ModalName.shippingService);
    };

    const openEditCourierAccountModal = (
        carrierAccount: CourierAccount,
        isAfterUpgrade = false
    ) => {
        const info = {
            slug: carrierAccount.slug,
            accountId: carrierAccount.id,
            isAfterUpgrade,
        };
        setCurrentCarrier(info);
        setCurrentModalName(courierModalmap[info.slug] || ModalName.common);
    };

    const openRemoveCourierModal = (accountId: string) => {
        setCurrentCarrier({accountId, slug: ''}); //删除 modal 不需要 slug 信息
        setCurrentModalName(ModalName.removeAccount);
    };

    const openEditUspsRechargeModal = () => {
        setCurrentModalName(ModalName.uspsRecharge);
    };

    const openUpgradeAccountModal = (carrierAccount: CourierAccount) => {
        const info = {
            slug: carrierAccount.slug,
            accountId: carrierAccount.id,
            isBeforeUpgrade: true,
        };
        setCurrentCarrier(info);
        setCurrentModalName(courierModalmap[info.slug] || ModalName.common);
    };

    const closeModal = () => {
        setCurrentCarrier(null);
        setCurrentModalName(null);
    };

    return useMemo(
        () => ({
            currentEditCarrierInfo: currentCarrier,
            currentModalName,
            openEditShippingServiceModal,
            openEditCourierAccountModal,
            openRemoveCourierModal,
            closeModal,
            openEditUspsRechargeModal,
            openUpgradeAccountModal,
        }),
        [currentCarrier, currentModalName]
    );
};

export default useOpenEditAccountModals;
