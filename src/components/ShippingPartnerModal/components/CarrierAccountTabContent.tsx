import {Banner, Button, Spinner, Stack, TextStyle} from '@shopify/polaris';
import React from 'react';

import CarrierAccountList from '@/container/CarrierAccountList';
import {CourierAccount} from '@/queries/carrierAccounts';

import styles from '../ShippingPartnerModal.module.scss';

interface CarrierAccountTabContentProps {
    isError: boolean;
    setIsError: (value: boolean) => void;
    isLoadingAccounts: boolean;
    userCourierAccounts: CourierAccount[];
    filteredAccounts: CourierAccount[];
    carrierSearchValue: string;
    setCarrierSearchValue: (value: string) => void;
    openCarrierListModal: () => void;
}

const CarrierAccountTabContent: React.FC<CarrierAccountTabContentProps> = ({
    isError,
    setIsError,
    isLoadingAccounts,
    userCourierAccounts,
    filteredAccounts,
    carrierSearchValue,
    setCarrierSearchValue,
    openCarrierListModal,
}) => {
    return (
        <div className={styles.tab_content}>
            <Stack vertical spacing="loose">
                {isError && (
                    <Banner status="critical" onDismiss={() => setIsError(false)}>
                        Failed to load carrier accounts. Please try again.
                    </Banner>
                )}

                {isLoadingAccounts ? (
                    <div className={styles.loading_container}>
                        <Spinner size="large" />
                        <div className={styles.loading_text}>
                            Loading carrier accounts...
                        </div>
                    </div>
                ) : (
                    <>
                        {!userCourierAccounts || userCourierAccounts.length === 0 ? (
                            <div className={styles.empty_state}>
                                <Stack vertical spacing="tight" alignment="center">
                                    <TextStyle variation="subdued">
                                        Add your own accounts to ship using your negotiated rates.
                                    </TextStyle>
                                    <div className={styles.action_button}>
                                        <Button primary onClick={() => openCarrierListModal()}>
                                            Add carrier account
                                        </Button>
                                    </div>
                                </Stack>
                            </div>
                        ) : (
                            <div className={styles.carrier_account_container}>
                                <div className={styles.header_actions}>
                                    <Button onClick={() => openCarrierListModal()}>
                                        Add carrier
                                    </Button>
                                </div>

                                {filteredAccounts.length === 0 && carrierSearchValue ? (
                                    <div className={styles.filtered_message}>
                                        <Stack vertical spacing="tight" alignment="center">
                                            <TextStyle variation="subdued">
                                                No carrier accounts found matching "{carrierSearchValue}".
                                            </TextStyle>
                                            <Button plain onClick={() => setCarrierSearchValue('')}>
                                                Clear search
                                            </Button>
                                        </Stack>
                                    </div>
                                ) : (
                                    <CarrierAccountList />
                                )}
                            </div>
                        )}
                    </>
                )}
            </Stack>
        </div>
    );
};

export default CarrierAccountTabContent;
