import {useMemo, useState} from 'react';

import CarrierAccountManagerModal from '@/components/CarrierAccountManagerModal';
import {
    CarrierAccountItem,
    CarrierAccountManagerProps,
} from '@/components/CarrierAccountManagerModal/types';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';
import {useI18next} from '@/i18n';
import {
    useEditCourierAccountsEnabled,
    CourierAccount,
    CourierAccountType,
} from '@/queries/carrierAccounts';

const CarrierAccountManager = (props: CarrierAccountManagerProps) => {
    const {t} = useI18next();
    const {
        carrierAccountsData: {data},
        setToast,
    } = useCarrierManagerContext();

    const {maxAccountNumber, onSave, onClose} = props;

    const {importedAccount, pendingImportedAccount} = useMemo<
        Record<string, CourierAccount[]>
    >(() => {
        return {
            importedAccount: data?.filter(item => item.enabled) ?? [],
            pendingImportedAccount:
                // 已经 enable || 公共账号 不允许操作 enable
                data?.filter(item => !item.enabled && item.type === CourierAccountType.user) ?? [],
        };
    }, [data]);

    const items = useMemo<CarrierAccountItem[]>(() => {
        return (
            pendingImportedAccount?.map(item => ({
                id: item.id,
                label: item.description,
                name: item.description,
                slug: item.slug,
                enabled: item.enabled,
                originSlugName: item.originSlugName,
            })) ?? []
        );
    }, [pendingImportedAccount]);

    const avaiableAccountNumber = useMemo(() => {
        if (!maxAccountNumber || maxAccountNumber === Infinity) {
            return Infinity;
        }
        const importedAccountNumber = importedAccount.length;
        return maxAccountNumber - importedAccountNumber;
    }, [maxAccountNumber, importedAccount]);

    const {mutate} = useEditCourierAccountsEnabled();

    const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);

    const onUpdateAccounts = (accountIds: string[]) => {
        mutate(
            accountIds.map(id => ({id, enabled: true})),
            {
                onSuccess: () => {
                    setToast(
                        t('toast.courier_account_updated', {
                            defaultValue: 'Courier account updated.',
                        })
                    );
                    onSave?.();
                    onClose();
                },
                onError: () => {
                    setIsShowErrorMessage(true);
                },
            }
        );
    };

    return (
        <CarrierAccountManagerModal
            {...props}
            data={items}
            avaiableAccountNumber={avaiableAccountNumber}
            onAction={onUpdateAccounts}
            isShowErrorMessage={isShowErrorMessage}
        />
    );
};

export default CarrierAccountManager;
