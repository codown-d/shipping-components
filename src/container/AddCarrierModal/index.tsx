import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import CommonCarrierAccountModal from '@/components/CarrierAccountModal/CommonCarrierAccountModal';
import {FedExCourierAccountModal} from '@/components/CarrierAccountModal/SpecialCarrierAccountModal';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';

interface IProps {
    open: boolean;
    slug: string;
    onClose: VoidFunction;
    onSave?: VoidFunction;
}

enum ModalName {
    common = 'common',
    fedex = 'fedex',
    fedexSmartPost = 'fedexSmartPost',
    usps = 'usps',
    recharge = 'recharge',
}

const courierModalmap: Record<string, ModalName> = {
    'fedex-smartpost': ModalName.fedexSmartPost,
    fedex: ModalName.fedex,
    'usps-discounted': ModalName.usps,
};

const AddCarrierModal = ({open, slug, onClose, onSave}: IProps) => {
    const [currentModalName, setCurrentModalName] = useState<ModalName | null>(null);
    const {
        setToast,
        carrierManagerModals: {addCarrierModal, carrierListModal},
        defaultShippingAddress,
    } = useCarrierManagerContext();

    useEffect(() => {
        setCurrentModalName(open ? courierModalmap[slug] || ModalName.common : null);
    }, [open, slug]);

    // 由于 oauth2 验证，如果从其他平台跳转过来，会带 query 参数，需要在关闭 modal 的时候，清除这些 query 参数，不然会认为还处于认证流程
    const clearQueryParams = () => {
        window.history.replaceState({}, '', `${window.location.pathname}`);
    };

    const closeModal = () => {
        clearQueryParams();
        onClose();
        setCurrentModalName(null);
    };

    const onBack = () => {
        clearQueryParams();
        addCarrierModal.setOpen(false);
        carrierListModal.setOpen(true);
    };

    if (!open) {
        return null;
    }

    return (
        <>
            <CommonCarrierAccountModal
                open={currentModalName === ModalName.common}
                slug={slug}
                onClose={closeModal}
                onSave={onSave}
                setToast={setToast}
                onBack={onBack}
            />

            <FedExCourierAccountModal
                open={currentModalName === ModalName.fedex}
                defaultShippingAddress={defaultShippingAddress}
                onClose={closeModal}
                onSave={onSave}
                setToast={setToast}
                onBack={onBack}
                slug="fedex"
            />
            <FedExCourierAccountModal
                open={currentModalName === ModalName.fedexSmartPost}
                defaultShippingAddress={defaultShippingAddress}
                onClose={closeModal}
                onSave={onSave}
                setToast={setToast}
                onBack={onBack}
                slug="fedex-smartpost"
            />
        </>
    );
};

export default AddCarrierModal;
