import {TextStyle, Button, Stack} from '@shopify/polaris';
import React, {useState, useCallback} from 'react';

import ShippingPartnerModal from '../ShippingPartnerModal';

import styles from './ShippingPartner.module.scss';
// 导入SVG资源
import CarriersList from './assets/carriers_list.svg';
import SaveBadge from './assets/save_91_percent.svg';

interface ShippingPartnerProps {
    onAddCarrier: () => void;
}

const ShippingPartner: React.FC<ShippingPartnerProps> = ({onAddCarrier}) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    const handleSelectCarrier = useCallback(
        (_slug: string) => {
            setModalOpen(false);
            // 在实际应用中，这里可能需要处理选择的物流合作伙伴
            onAddCarrier();
        },
        [onAddCarrier]
    );

    return (
        <>
            <div className={styles.card}>
                <div className={styles.content}>
                    <Stack vertical spacing="tight">
                        <TextStyle variation="strong">Shipping partner</TextStyle>

                        <TextStyle>
                            Choose an Aftership shipping partner and enjoy exclusive discounts from
                            over 30 carriers, saving up to 91%
                        </TextStyle>

                        <div>
                            <Button onClick={handleOpenModal}>Add carrier</Button>
                        </div>
                    </Stack>
                </div>

                {/* 右侧carriers列表 */}
                <img src={CarriersList} alt="Carriers List" className={styles.carriers_list} />

                {/* 右侧SAVE 91%标签 */}
                <img src={SaveBadge} alt="Save 91%" className={styles.save_badge} />
            </div>

            <ShippingPartnerModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSelect={handleSelectCarrier}
            />
        </>
    );
};

export default ShippingPartner;
