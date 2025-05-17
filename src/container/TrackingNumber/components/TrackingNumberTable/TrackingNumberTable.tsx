import {Card} from '@shopify/polaris';
import React from 'react';

import styles from './TrackingNumberTable.module.scss';
import {useTrackingNumberTable} from './hooks/useTrackingNumberTable';

import {Table} from '@/components/Table';

const TrackingNumberTable = () => {
    const table = useTrackingNumberTable();
    return (
        <Card>
            <div className={styles['table-wrapper']}>
                <Table table={table} />
            </div>
        </Card>
    );
};

export default TrackingNumberTable;
