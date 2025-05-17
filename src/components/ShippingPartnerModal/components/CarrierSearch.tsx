import {TextField, Icon} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import React from 'react';

import styles from '../ShippingPartnerModal.module.scss';

interface CarrierSearchProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

const CarrierSearch: React.FC<CarrierSearchProps> = ({
    searchValue,
    onSearchChange,
}) => {
    return (
        <div className={styles.search_container}>
            <TextField
                label=""
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search by carrier name"
                prefix={<Icon source={SearchMinor} color="base" />}
                autoComplete="off"
            />
        </div>
    );
};

export default CarrierSearch;
