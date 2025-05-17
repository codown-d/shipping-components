import {SkeletonBodyText, Card} from '@shopify/polaris';
import React, {useState, ReactNode} from 'react';

import UserCourierAccount from '@/components/CarrierAccountList/CarrierAccountItem';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';
import {CourierAccount} from '@/queries/carrierAccounts';
import {useGetAllCouriers} from '@/queries/couriers';

interface IProps {
    renderChildren?: (item: CourierAccount) => ReactNode;
}

const CarrierAccountList = ({renderChildren}: IProps) => {
    const {
        trackingNumberPagePathName,
        carrierAccountsData: {data: userCourierAccounts, isLoading: courierAccountsLoading},
        editSingleCarrierRelativeModals: {
            openEditShippingServiceModal,
            openRemoveCourierModal,
            openEditCourierAccountModal,
            openUpgradeAccountModal,
        },
        editable,
    } = useCarrierManagerContext();

    const {
        data: {all: couriersV3Data},
        isLoading: couriersLoading,
    } = useGetAllCouriers();

    const isLoading = courierAccountsLoading || couriersLoading;

    if (isLoading) {
        return (
            <Card.Section>
                <SkeletonBodyText lines={3} />
            </Card.Section>
        );
    }

    return (
        <>
            {userCourierAccounts?.map(item => {
                if (!item.enabled) return;

                const showTrackingNumberButton = couriersV3Data.length
                    ? couriersV3Data.some(i => i.slug === item.slug && i.tracking_numbers)
                    : false;

                const showUpgradeButton =
                    !!item?.upgrade_version && item?.upgrade_version > item?.version;

                const courier = couriersV3Data?.find(i => i.slug === item.slug);

                const upgradeDueDate = courier?.courier_accounts?.find(
                    i => i.version === item.version
                )?.upgrade_due_date;

                return (
                    <UserCourierAccount
                        key={item.id}
                        carrierAccount={item}
                        upgradeDueDate={upgradeDueDate}
                        onService={openEditShippingServiceModal}
                        onRemove={openRemoveCourierModal}
                        onEdit={openEditCourierAccountModal}
                        onUpgrade={openUpgradeAccountModal}
                        showTrackingNumberButton={showTrackingNumberButton}
                        showUpgradeButton={showUpgradeButton}
                        trackingNumberPagePathName={trackingNumberPagePathName}
                        renderChildren={() => renderChildren?.(item)}
                        editable={editable}
                    />
                );
            })}
        </>
    );
};

export default CarrierAccountList;
