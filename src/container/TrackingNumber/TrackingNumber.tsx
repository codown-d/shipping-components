import {Page} from '@shopify/polaris';
import React from 'react';

import DeleteTrackingNumberModal from './components/DeleteTrackingNumberModal';
import RangeMethodAddModal from './components/RangeMethodAddModal';
import TrackingNumberTable from './components/TrackingNumberTable';
import ValuesMethodAddModal from './components/ValuesMethodAddModal';
import {useAddModalState} from './hooks/useAddModalState';
import TrackingNumberProvider from './provider/TrackingNumberProvider';

import {useI18next} from '@/i18n';

export interface TrackingPageProps {
    editable?: boolean;
}

const TrackingNumberPage = ({editable = true}: TrackingPageProps) => {
    const {t} = useI18next();
    const {isValuesMethodModalActive, isRangeMethodModalActive, openAddModal, closeAddModal} =
        useAddModalState();
    return (
        <Page
            breadcrumbs={[
                {
                    content: t('action.content.carriers', {defaultValue: 'Carriers'}),
                    onAction: () => {
                        history.go(-1);
                    },
                },
            ]}
            title={t('tracking_number_page.title', {defaultValue: 'Manage tracking number'})}
            primaryAction={{
                content: t('action.content.add', {defaultValue: 'Add'}),
                onAction: openAddModal,
                disabled: !editable,
            }}
        >
            <TrackingNumberTable />
            {/* Add & Delete Modal 👇🏻 */}
            <ValuesMethodAddModal open={isValuesMethodModalActive} onClose={closeAddModal} />
            <RangeMethodAddModal open={isRangeMethodModalActive} onClose={closeAddModal} />
            <DeleteTrackingNumberModal />
        </Page>
    );
};

const TrackingNumber = ({editable = true}: TrackingPageProps) => {
    return (
        <TrackingNumberProvider editable={editable}>
            <TrackingNumberPage editable={editable} />
        </TrackingNumberProvider>
    );
};

export default TrackingNumber;
