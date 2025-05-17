import {Stack, Card, SkeletonThumbnail, SkeletonBodyText} from '@shopify/polaris';
import React from 'react';

import styles from './AddCarrierSkeleton.module.scss';

const CarrierItemSkeleton = () => (
    <div className={styles.card}>
        <Card sectioned>
            <Stack alignment="center" spacing="extraLoose">
                <SkeletonThumbnail size="small" />
                <Stack.Item fill>
                    <SkeletonBodyText lines={2} />
                </Stack.Item>
            </Stack>
        </Card>
    </div>
);

const AddCarrierSkeleton = () => {
    return (
        <Stack>
            {Array(9)
                .fill(0)
                .map((_, index) => (
                    <CarrierItemSkeleton key={index} />
                ))}
        </Stack>
    );
};

export default AddCarrierSkeleton;
