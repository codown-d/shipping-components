import {Button, TextStyle} from '@shopify/polaris';
import dayjs from 'dayjs';
import {useMemo} from 'react';
import {useTable} from 'react-table';

import {useTrackingNumberContext} from '../../../hooks/useTrackingNumberContext';
import styles from '../TrackingNumberTable.module.scss';

import {makeColumns} from '@/components/Table';
import {useI18next} from '@/i18n';
import {ISlot} from '@/queries/trackingNumber';

export const useTrackingNumberTable = () => {
    const {t} = useI18next();
    const {slots, openDeleteModal, editable} = useTrackingNumberContext();

    const columns = useMemo(
        () =>
            makeColumns<ISlot>([
                {
                    key: 'method',
                    Header: t('table.column.method', {defaultValue: 'Method'}),
                    accessor: ({type}) => <div className={styles.badge}>{type}</div>,
                },
                {
                    key: 'description',
                    Header: t('table.column.description', {defaultValue: 'Description'}),
                    accessor: ({description}) => <TextStyle>{description}</TextStyle>,
                },
                {
                    key: 'tracking_number',
                    Header: t('table.column.tracking_number', {defaultValue: 'Tracking number'}),
                    accessor: ({data, type, min, max}) => {
                        let display = '';

                        if (type === 'range') {
                            display = [min, max].join(' - ');
                        } else {
                            display =
                                data.length > 2
                                    ? [data[0], data[data.length - 1]].join('...')
                                    : data.join(',');
                        }
                        return <TextStyle>{display}</TextStyle>;
                    },
                },
                {
                    key: 'available',
                    Header: t('table.column.available', {defaultValue: 'Available'}),
                    accessor: ({available_count, data, type, max}) => (
                        <TextStyle>
                            {[available_count, type === 'range' ? max : data.length].join('/')}
                        </TextStyle>
                    ),
                },
                {
                    key: 'created_at',
                    Header: t('table.column.created_at', {defaultValue: 'Created at'}),
                    accessor: ({created_at}) => (
                        <TextStyle>{dayjs(created_at).format('MMMM D, YYYY h:mm A')}</TextStyle>
                    ),
                },
                {
                    key: 'actions',
                    Header: t('table.column.actions', {defaultValue: 'Actions'}),
                    accessor: slot => (
                        <Button
                            disabled={!editable}
                            destructive
                            size="slim"
                            plain
                            onClick={() => openDeleteModal(slot)}
                        >
                            {t('action.content.delete', {defaultValue: 'Delete'})}
                        </Button>
                    ),
                },
            ]),
        [slots, editable, t]
    );

    const table = useTable<ISlot>({
        data: slots,
        columns: columns,
    });

    return table;
};
