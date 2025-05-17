import {ResourceList, Modal, Banner, Button, Stack} from '@shopify/polaris';
import React, {useState, useEffect, useMemo} from 'react';

import carrierAccountItem from './CarrierAccountItem';
import styles from './index.module.scss';
import {CarrierAccountManagerModalProps} from './types';

import {USPS_DISCOUNTED} from '@/constants';
import {useGetCourierAccounts} from '@/container/CarrierManagerProvider';
import useTestMode from '@/hooks/useTestMode';
import {useI18next} from '@/i18n';

const CarrierAccountManagerModal = ({
    open,
    productName,
    data,
    maxAccountNumber,
    avaiableAccountNumber,
    currentPlanName,
    onUpgrade,
    onAction,
    onClose,
    onClickAddNewAccount,
    isShowErrorMessage,
}: CarrierAccountManagerModalProps) => {
    const {t} = useI18next();
    const {data: carrierAccount} = useGetCourierAccounts();

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const {isTestMode} = useTestMode();

    useEffect(() => {
        data &&
            setSelectedItems(data.map(res => res.id).slice(0, avaiableAccountNumber || undefined));
    }, [data, avaiableAccountNumber]);

    const isCourierExceed = useMemo(() => {
        // plan 的 carrier 数量限制不包括 USPS

        const selectedUSPS =
            carrierAccount.some(item => item.slug === USPS_DISCOUNTED) ||
            selectedItems.includes(USPS_DISCOUNTED);

        const hasUSPSQuota = selectedUSPS ? 1 : 0;

        return maxAccountNumber && maxAccountNumber !== Infinity
            ? selectedItems.length > (avaiableAccountNumber || 0 + hasUSPSQuota)
            : false;
    }, [avaiableAccountNumber, carrierAccount, maxAccountNumber, selectedItems]);

    const isCourierExeedAndNotTestMode = isCourierExceed && !isTestMode; // test mode 模式不做 plan count 限制, 因为 test mode 模式会导入公共账号

    return (
        <Modal
            title={t('carrier_account_manager.add', {defaultValue: 'Add carrier accounts'})}
            open={open}
            onClose={onClose}
            primaryAction={{
                content: t('action.content.confirm', {defaultValue: 'Confirm'}),
                disabled: isCourierExeedAndNotTestMode,
                onAction: () => onAction?.(selectedItems),
            }}
            secondaryActions={[
                {
                    content: t('carrier_account_manager.add_other', {
                        defaultValue: 'Add other accounts',
                    }),
                    onAction: onClickAddNewAccount,
                },
            ]}
        >
            <div className={styles.modal_section}>
                <Stack spacing="loose" vertical>
                    {isShowErrorMessage && (
                        <Banner status="critical">
                            {t('carrier_account_manager.fail', {
                                defaultValue: 'Failed to save the setting, please try again.',
                            })}
                        </Banner>
                    )}
                    <Stack.Item>
                        {t('carrier_account_manager.info', {
                            productName,
                            defaultValue: `Your organization has connected to the following carrier accounts. Which do you want to add to ${productName}?`,
                        })}
                    </Stack.Item>
                    {isCourierExeedAndNotTestMode && (
                        <Stack.Item>
                            <Banner status="info">
                                {avaiableAccountNumber === 1
                                    ? t('carrier_account_manager.avaiabed', {
                                          avaiableAccountNumber,
                                          currentPlanName,
                                          defaultValue: `You can only add ${avaiableAccountNumber} more carrier account on ${currentPlanName}. `,
                                      })
                                    : t('carrier_account_manager.avaiabed_more', {
                                          avaiableAccountNumber,
                                          currentPlanName,
                                          defaultValue: `You can only add ${avaiableAccountNumber} more carrier accounts on ${currentPlanName}. `,
                                      })}
                                {onUpgrade ? (
                                    <Button onClick={onUpgrade} plain>
                                        {t('action.content.upgrade_now', {
                                            defaultValue: 'Upgrade now',
                                        })}
                                    </Button>
                                ) : null}
                            </Banner>
                        </Stack.Item>
                    )}
                </Stack>
            </div>
            <div className={styles.carrier_account_list}>
                <ResourceList
                    items={data}
                    renderItem={carrierAccountItem}
                    selectedItems={selectedItems}
                    onSelectionChange={(value: string[]) => {
                        setSelectedItems(value);
                    }}
                    selectable
                    showHeader={false}
                />
            </div>
        </Modal>
    );
};

export default CarrierAccountManagerModal;
