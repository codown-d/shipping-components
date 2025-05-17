import AddCarrierModal from '../AddCarrierModal';
import CarrierAccountManager from '../CarrierAccountManager';
import CarrierListModal from '../CarrierList/CarrierListModal';

import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';

const CarrierAccountManagerModals = () => {
    const {
        carrierManagerModals: {
            carrierListModal,
            addCarrierModal,
            carrierAccountManagerModal,
            currentOnAddedSlug,
            setCurrentOnAddedSlug,
        },
        billing,
        carrierAccountsData,
        productName,
        carrierListDisplayBy,
    } = useCarrierManagerContext();

    const onUpgradePlanHandler = () => {
        carrierAccountManagerModal.setOpen(false);
        billing?.onUpgrade?.();
    };

    return (
        <>
            {carrierListModal.isOpen && (
                <CarrierListModal
                    open={carrierListModal.isOpen}
                    onClose={() => carrierListModal.setOpen(false)}
                    onClick={slug => {
                        setCurrentOnAddedSlug(slug);
                        carrierListModal.setOpen(false);
                        addCarrierModal.setOpen(true);
                        carrierListModal.onClickHandler?.();
                    }}
                />
            )}
            {addCarrierModal.isOpen && (
                <AddCarrierModal
                    open={addCarrierModal.isOpen}
                    // onClose 只包含 cancel 和 右上角关闭弹窗 的操作
                    onClose={() => addCarrierModal.setOpen(false)}
                    slug={currentOnAddedSlug}
                    // onSave 是保存成功的回调 (一般组件内会和onClose一起调用，
                    // 但不和refetch组合用，因为后者在组件内并不知道是否影响其他组件)
                    onSave={() => {
                        carrierAccountsData.refetch();
                        addCarrierModal.onSaveHandler?.();
                        carrierListModal.onCarrierItemSaveHandler?.();
                    }}
                />
            )}
            {carrierAccountManagerModal.isOpen && (
                <CarrierAccountManager
                    maxAccountNumber={billing?.carrierAccountQuota}
                    productName={productName}
                    currentPlanName={billing?.currentPlanName}
                    open={carrierAccountManagerModal.isOpen}
                    onClose={() => {
                        carrierAccountManagerModal.setOpen(false);
                    }}
                    onClickAddNewAccount={() => {
                        carrierAccountManagerModal.setOpen(false);

                        if (carrierAccountManagerModal.onClickAddNewAccountHandler) {
                            carrierAccountManagerModal.onClickAddNewAccountHandler();
                        } else {
                            if (carrierListDisplayBy === 'modal') {
                                carrierListModal.setOpen(true);
                            }
                        }
                    }}
                    onSave={() => {
                        carrierAccountsData.refetch();
                        carrierAccountManagerModal.onSaveHandler?.();
                    }}
                    onUpgrade={billing?.onUpgrade ? onUpgradePlanHandler : null}
                />
            )}
        </>
    );
};

export default CarrierAccountManagerModals;
