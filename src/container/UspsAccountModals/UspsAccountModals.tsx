import {USPSCourierAccountModal} from '@/components/CarrierAccountModal/SpecialCarrierAccountModal';
import RechargeModal from '@/components/EditAutoTopUpModal';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';

enum UspsAccountModalName {
    uspsAccountModal = 'uspsAccountModal',
    uspsRechargeModal = 'uspsRechargeModal',
}

export interface IProps {
    currentModalName: UspsAccountModalName | null;
    openUspsRechargeModal: VoidFunction;
    onCreatedAccount?: VoidFunction;
    onClose: VoidFunction;
    onSave?: VoidFunction;
    onNext?: (accountId: string) => void;
    accountId: string;
    setAccountId: (accountId: string) => void;
    onCreatedSuccess?: VoidFunction;
}

const UspsAccountModals = ({
    onClose,
    currentModalName,
    openUspsRechargeModal,
    onCreatedAccount,
    accountId,
    setAccountId,
    onCreatedSuccess,
}: IProps) => {
    const {
        setToast,
        carrierAccountsData: {refetch},
        uspsRechargeData: {refetch: refetchUspsRechargeData},
    } = useCarrierManagerContext();

    const closeModal = () => {
        onClose();
    };

    return (
        <>
            {currentModalName === UspsAccountModalName.uspsAccountModal && (
                <USPSCourierAccountModal
                    open={true}
                    onClose={closeModal}
                    onCreatedAccountSuccess={id => {
                        onCreatedAccount?.(); // usps 在这个步骤就已经创建 account 成功，回调暴露给业务侧去进行 onboarding
                        setAccountId(id); // 创建的时候， 需要拿到 account id 去保存 recharge 数据
                        openUspsRechargeModal();
                        refetch();
                        onCreatedSuccess?.();
                    }}
                    accountId={accountId}
                    openUspsRechargeModal={openUspsRechargeModal}
                    setToast={setToast}
                />
            )}

            {currentModalName === UspsAccountModalName.uspsRechargeModal && (
                <RechargeModal
                    open={currentModalName === UspsAccountModalName.uspsRechargeModal}
                    onClose={closeModal}
                    accountId={accountId}
                    setToast={setToast}
                    slug="usps-discounted"
                    onSave={refetchUspsRechargeData}
                />
            )}
        </>
    );
};

export default UspsAccountModals;
