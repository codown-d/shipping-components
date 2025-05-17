import EditShippingServicesModal from '@/components/CarrierAccountList/EditShippingServicesModal';
import RemoveCourierAccountModal from '@/components/CarrierAccountList/RemoveCourierAccountModal';
import CommonCarrierAccountModal from '@/components/CarrierAccountModal/CommonCarrierAccountModal';
import {FedExCourierAccountModal} from '@/components/CarrierAccountModal/SpecialCarrierAccountModal';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';
import {ModalName} from '@/container/CarrierManagerProvider/hooks/useOpenEditAccountModals';

const EditCarrierAccountModals = () => {
    const {
        text,
        carrierAccountsData: {refetch},
        setToast,
        editSingleCarrierRelativeModals: {currentEditCarrierInfo, closeModal, currentModalName},
    } = useCarrierManagerContext();

    // 由于 oauth2 验证，如果从其他平台跳转过来，会带 query 参数，需要在关闭 modal 的时候，清除这些 query 参数，不然会认为还处于认证流程
    const clearQueryParams = () => {
        window.history.replaceState({}, '', `${window.location.pathname}`);
    };

    const onClose = () => {
        clearQueryParams();
        closeModal();
    };

    return (
        <>
            {currentModalName ? (
                <>
                    <EditShippingServicesModal
                        open={currentModalName === ModalName.shippingService}
                        onClose={onClose}
                        setToast={setToast}
                        onSave={refetch}
                        {...currentEditCarrierInfo}
                    />
                    <RemoveCourierAccountModal
                        open={currentModalName === ModalName.removeAccount}
                        onClose={onClose}
                        {...currentEditCarrierInfo}
                        removeText={text?.removeBanner}
                        onSave={refetch}
                        setToast={setToast}
                    />
                    <CommonCarrierAccountModal
                        open={currentModalName === ModalName.common}
                        onClose={onClose}
                        setToast={setToast}
                        onSave={refetch}
                        {...currentEditCarrierInfo}
                    />
                    <FedExCourierAccountModal
                        open={
                            currentModalName === ModalName.fedex ||
                            currentModalName === ModalName.fedexSmartPost
                        }
                        onClose={onClose}
                        setToast={setToast}
                        onSave={refetch}
                        {...currentEditCarrierInfo}
                    />
                </>
            ) : null}
        </>
    );
};

export default EditCarrierAccountModals;
