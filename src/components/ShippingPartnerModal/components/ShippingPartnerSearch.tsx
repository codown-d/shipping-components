import {TextField, Icon, Stack, Select, Tooltip} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import React from 'react';

import styles from '../ShippingPartnerModal.module.scss';

interface RegionOption {
    label: string;
    value: string;
}

interface ShippingPartnerSearchProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    selectedRegion: string;
    onRegionChange: (value: string) => void;
    regionOptions: RegionOption[];
}

const ShippingPartnerSearch: React.FC<ShippingPartnerSearchProps> = ({
    searchValue,
    onSearchChange,
    selectedRegion,
    onRegionChange,
    regionOptions,
}) => {
    return (
        <div className={styles.search_container}>
            <Stack>
                <Stack.Item fill>
                    <TextField
                        label=""
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder="Search by carrier name and partner name"
                        prefix={<Icon source={SearchMinor} color="base" />}
                        autoComplete="off"
                    />
                </Stack.Item>
                <Stack.Item>
                    <div className={styles.region_selector}>
                        <Tooltip
                            content={
                                <div className={styles.tooltip_content}>
                                    {regionOptions.find(
                                        option => option.value === selectedRegion
                                    )?.label || 'All regions'}
                                </div>
                            }
                            preferredPosition="below"
                        >
                            <Select
                                label=""
                                labelHidden
                                options={regionOptions}
                                value={selectedRegion}
                                onChange={onRegionChange}
                            />
                        </Tooltip>
                    </div>
                </Stack.Item>
            </Stack>
        </div>
    );
};

export default ShippingPartnerSearch;
