import {Spinner, Stack, TextStyle} from '@shopify/polaris';
import React from 'react';

import ShippingPartnerList from '../../ShippingPartnerList';
import {ShippingPartnerOption} from '../hooks/useShippingPartnerModal';

import styles from '../ShippingPartnerModal.module.scss';

interface ShippingPartnerTabContentProps {
    isLoading: boolean;
    partnerOptions: ShippingPartnerOption[];
}

const ShippingPartnerTabContent: React.FC<ShippingPartnerTabContentProps> = ({
    isLoading,
    partnerOptions,
}) => {
    return (
        <Stack vertical>
            {isLoading ? (
                <div className={styles.loading_container}>
                    <Spinner size="large" />
                    <div className={styles.loading_text}>
                        Loading shipping partners...
                    </div>
                </div>
            ) : (
                <>
                    {partnerOptions.length > 0 ? (
                        <ShippingPartnerList options={partnerOptions} />
                    ) : (
                        <div className={styles.empty_state}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.empty_state_icon}>
                                <g clipPath="url(#clip0_3746_13749)">
                                    <path d="M4.8 19.2C4.8 11.2584 11.2584 4.8 19.2 4.8C27.1416 4.8 33.6 11.2584 33.6 19.2C33.6 27.1416 27.1416 33.6 19.2 33.6C11.2584 33.6 4.8 27.1416 4.8 19.2ZM47.2968 43.9032L34.3488 30.9528C36.974 27.5977 38.4002 23.4601 38.4 19.2C38.4 8.6136 29.7864 0 19.2 0C8.6136 0 0 8.6136 0 19.2C0 29.7864 8.6136 38.4 19.2 38.4C23.4599 38.3988 27.597 36.9727 30.9528 34.3488L43.9032 47.2968C44.1256 47.5204 44.39 47.6979 44.6812 47.819C44.9724 47.9401 45.2846 48.0025 45.6 48.0025C45.9154 48.0025 46.2276 47.9401 46.5188 47.819C46.81 47.6979 47.0744 47.5204 47.2968 47.2968C47.5199 47.0741 47.6968 46.8096 47.8176 46.5185C47.9383 46.2273 48.0005 45.9152 48.0005 45.6C48.0005 45.2848 47.9383 44.9727 47.8176 44.6815C47.6968 44.3904 47.5199 44.1259 47.2968 43.9032Z" fill="#5C5F62"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_3746_13749">
                                        <rect width="48" height="48" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={styles.empty_state_title}>
                                No carriers found
                            </div>
                            <TextStyle variation="subdued">
                                Try changing the search term
                            </TextStyle>
                        </div>
                    )}
                </>
            )}
        </Stack>
    );
};

export default ShippingPartnerTabContent;
