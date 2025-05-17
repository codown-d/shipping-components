import {useState, useMemo} from 'react';

enum UspsAccountModalName {
    uspsAccountModal = 'uspsAccountModal',
    uspsRechargeModal = 'uspsRechargeModal',
}

export const useOpenUspsAccountModals = () => {
    const [currentModalName, setCurrentModalName] = useState<UspsAccountModalName | null>(null);
    const [accountId, setAccountId] = useState('');

    // 打开 recharge modal
    const openUspsRechargeModal = () => {
        setCurrentModalName(UspsAccountModalName.uspsRechargeModal);
    };

    const openUspsAccountModal = () => {
        setCurrentModalName(UspsAccountModalName.uspsAccountModal);
    };

    const closeUspsRelativeModal = () => {
        setCurrentModalName(null);
    };

    return useMemo(() => {
        return {
            accountId,
            setAccountId,
            currentModalName,
            closeUspsRelativeModal,
            openUspsRechargeModal,
            openUspsAccountModal,
        };
    }, [currentModalName, accountId]);
};
