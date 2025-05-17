import {Toast} from '@shopify/polaris';
import React, {FC, useEffect} from 'react';

import CarrierAccountManagerModals from './CarrierAccountManagerModals';
import {
    CarrierManagerContext,
    ICarrierManagerStaticContext,
    useCarrierManagerValue,
} from './CarrierManagerProvider';

import {getFromCanadapost} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/hooks/useCanadaPostCarrier';
import {ModalMode} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/hooks/useModalInfoMap';
import useOauth2LoginData, {
    useOauth2LoginStatus,
} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/hooks/useOauth2DataAfterLogin';
import EditCarrierAccountModals from '@/container/EditCarrierAccountModals';

const CarrierManagerProvider: FC<{config: ICarrierManagerStaticContext}> = ({config, children}) => {
    const CarrierManagerValue = useCarrierManagerValue(config);

    useEffect(() => {
        if (CarrierManagerValue.carrierListDisplayBy === 'modal') {
            const {isAfterCanadapostLogin} = getFromCanadapost();

            if (isAfterCanadapostLogin) {
                CarrierManagerValue.carrierManagerModals.carrierListModal.setOpen(true);
            }
        }
    }, []);

    // 需要判断是否为 oauth2 流程登录完成，如果登录完成，则打开相关的 slug modal
    const {slug, isOauth2Enabled, state} = useOauth2LoginData();

    const {isAfterOauth2Login} = useOauth2LoginStatus(
        !!isOauth2Enabled,
        state?.courier_account_id ? ModalMode.EDIT : ModalMode.ADD
    );

    // 获取到最新 version 的 carrier account 数据
    const afterOauth2LoginCarrierAccount = CarrierManagerValue.carrierAccountsData.data
        ?.filter(i => i.enabled)
        .find(item => item.id === state?.courier_account_id);

    useEffect(() => {
        if (CarrierManagerValue.carrierListDisplayBy === 'modal') {
            // 如果 oauth2 登录 && 登录后，唤起对应 slug 的 modal
            if (isAfterOauth2Login && slug && !state?.courier_account_id) {
                CarrierManagerValue.carrierManagerModals.setCurrentOnAddedSlug(slug);
                CarrierManagerValue.carrierManagerModals.addCarrierModal.setOpen(true);
            }

            if (
                isAfterOauth2Login &&
                slug &&
                state?.courier_account_id &&
                afterOauth2LoginCarrierAccount
            ) {
                CarrierManagerValue.editSingleCarrierRelativeModals.openEditCourierAccountModal(
                    afterOauth2LoginCarrierAccount,
                    true
                );
            }
        }
    }, [isAfterOauth2Login, slug, afterOauth2LoginCarrierAccount]);

    return (
        <CarrierManagerContext.Provider value={CarrierManagerValue}>
            {/* 处理 carrier account 的导入、添加 modal */}
            <CarrierAccountManagerModals />

            {/* 处理单个 carrier 相关信息的 modal */}
            <EditCarrierAccountModals />

            {CarrierManagerValue.toastMsg && (
                <Toast
                    content={CarrierManagerValue.toastMsg}
                    onDismiss={() => {
                        CarrierManagerValue.setToast('');
                    }}
                />
            )}
            {children}
        </CarrierManagerContext.Provider>
    );
};

export default CarrierManagerProvider;
