import {Modal, Tabs} from '@shopify/polaris';
import React, {useState} from 'react';

import EasyshipAccountModal from '../EasyshipAccountModal';
import CarrierAccountTabContent from './components/CarrierAccountTabContent';
import CarrierSearch from './components/CarrierSearch';
import ShippingPartnerSearch from './components/ShippingPartnerSearch';
import ShippingPartnerTabContent from './components/ShippingPartnerTabContent';
import {useShippingPartnerModal} from './hooks/useShippingPartnerModal';

interface ShippingPartnerModalProps {
    open: boolean;
    onClose: () => void;
    onSelect?: (slug: string) => void;
}

const ShippingPartnerModal: React.FC<ShippingPartnerModalProps> = ({open, onClose, onSelect}) => {
    const [isEasyshipModalOpen, setIsEasyshipModalOpen] = useState(false);

    // 处理Easyship账号创建
    const handleEasyshipSelect = () => {
        // 先关闭当前弹窗，再打开Easyship账号创建弹窗
        onClose();
        setIsEasyshipModalOpen(true);
    };

    // 处理Easyship账号创建完成
    const handleEasyshipModalClose = () => {
        setIsEasyshipModalOpen(false);
    };

    // 处理Easyship账号创建提交
    const handleEasyshipSubmit = (data: any) => {
        console.log('Easyship account created:', data);
        setIsEasyshipModalOpen(false);
        // 这里可以添加创建成功后的逻辑
        if (onSelect) {
            onSelect('easyship');
        }
    };

    const {
        selected,
        partnerSearchValue,
        carrierSearchValue,
        selectedRegion,
        isError,
        setIsError,
        userCourierAccounts,
        isLoadingAccounts,
        openCarrierListModal,
        isLoading,
        partnerOptions,
        filteredAccounts,
        regionOptions,
        tabs,
        handleTabChange,
        handlePartnerSearchChange,
        handleCarrierSearchChange,
        handleRegionChange,
        setCarrierSearchValue,
    } = useShippingPartnerModal(open, onClose, (slug) => {
        // 如果是Easyship，打开Easyship账号创建弹窗
        if (slug === 'easyship') {
            handleEasyshipSelect();
        } else if (onSelect) {
            onSelect(slug);
        }
    });

    return (
        <>
            <Modal open={open} onClose={onClose} title="Chose shipping partner or carrier" large>
                <Modal.Section>
                    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />

                    {/* 根据当前选中的标签页显示不同的搜索框 */}
                    {selected === 0 ? (
                        <ShippingPartnerSearch
                            searchValue={partnerSearchValue}
                            onSearchChange={handlePartnerSearchChange}
                            selectedRegion={selectedRegion}
                            onRegionChange={handleRegionChange}
                            regionOptions={regionOptions}
                        />
                    ) : (
                        <CarrierSearch
                            searchValue={carrierSearchValue}
                            onSearchChange={handleCarrierSearchChange}
                        />
                    )}

                    {selected === 0 && (
                        <ShippingPartnerTabContent
                            isLoading={isLoading}
                            partnerOptions={partnerOptions}
                        />
                    )}

                    {selected === 1 && (
                        <CarrierAccountTabContent
                            isError={isError}
                            setIsError={setIsError}
                            isLoadingAccounts={isLoadingAccounts}
                            userCourierAccounts={userCourierAccounts}
                            filteredAccounts={filteredAccounts}
                            carrierSearchValue={carrierSearchValue}
                            setCarrierSearchValue={setCarrierSearchValue}
                            openCarrierListModal={openCarrierListModal}
                        />
                    )}
                </Modal.Section>
            </Modal>

            {/* Easyship账号创建弹窗 */}
            <EasyshipAccountModal
                open={isEasyshipModalOpen}
                onClose={handleEasyshipModalClose}
                onSubmit={handleEasyshipSubmit}
            />
        </>
    );
};

export default ShippingPartnerModal;
