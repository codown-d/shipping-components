import React, {createContext, useCallback, useState, useMemo} from 'react';
import {useParams} from 'react-router-dom';

import TrackingNumberSkeleton from '../components/TrackingNumberSkeleton';

import {useGetCourierBySlug} from '@/queries/couriers';
import {ISlot, IPreAssignedNumberConfig, useTrackingNumberQuery} from '@/queries/trackingNumber';

interface ITrackingNumberProviderProps {
    children: React.ReactNode;
    editable: boolean;
}

interface IDeleteModalInfo {
    active: boolean;
    info: ISlot;
}

export interface ITrackingNumberContext {
    slug: string;
    accountId: string;
    slots: ISlot[];
    method: IPreAssignedNumberConfig['input_method'];
    preAssignedNumberConfigs: IPreAssignedNumberConfig[];
    refetchTrackingNumber: VoidFunction;
    deleteModalInfo: IDeleteModalInfo;
    openDeleteModal: (info: ISlot) => void;
    closeDeleteModal: VoidFunction;
    editable: boolean;
}

interface ITrackingNumberRouterParams {
    slug: string;
    id: string;
}

export const TrackingNumberContext = createContext<ITrackingNumberContext>({
    slots: [],
    method: 'RANGE',
    preAssignedNumberConfigs: [],
    slug: '',
    accountId: '',
    refetchTrackingNumber: () => {},
    deleteModalInfo: {
        active: false,
        info: {} as ISlot,
    },
    openDeleteModal: () => {},
    closeDeleteModal: () => {},
    editable: true,
});

const TrackingNumberProvider = (props: ITrackingNumberProviderProps) => {
    const {children, editable} = props;
    const [deleteModalInfo, setDeleteModalInfo] = useState<IDeleteModalInfo>({
        active: false,
        info: {} as ISlot,
    });

    // 旧有逻辑是以 /tracking-number/:slug/:id 跳转
    const {slug: pathParamSlug, id: pathParamId} = useParams<ITrackingNumberRouterParams>();
    // 新逻辑为了灵活接入业务方，是以 /tracking-number?slug=xx&id=xx 跳转
    const searchParams = new URLSearchParams(location.search);
    // 同时兼容以上两种逻辑取值
    const slug = pathParamSlug || searchParams.get('slug') || '';
    const accountId = pathParamId || searchParams.get('id') || '';

    const {data: courierData, isLoading: couriersLoading} = useGetCourierBySlug(slug);

    const {
        data: trackingNumberData,
        refetch: refetchTrackingNumber,
        isLoading: trackingNumberLoading,
    } = useTrackingNumberQuery(accountId);

    const isLoading = couriersLoading || trackingNumberLoading;

    const openDeleteModal = useCallback((info: ISlot) => {
        setDeleteModalInfo({active: true, info});
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteModalInfo(info => ({...info, active: false}));
    }, []);

    const context = useMemo(
        () => ({
            slug,
            accountId,
            slots: trackingNumberData?.slots || [],
            method: courierData?.pre_assigned_number_configs?.[0]?.input_method || 'RANGE',
            preAssignedNumberConfigs: courierData?.pre_assigned_number_configs || [],
            refetchTrackingNumber,
            deleteModalInfo,
            openDeleteModal,
            closeDeleteModal,
            editable,
        }),
        [
            courierData?.pre_assigned_number_configs,
            trackingNumberData,
            refetchTrackingNumber,
            deleteModalInfo,
            openDeleteModal,
            closeDeleteModal,
            accountId,
            slug,
            editable,
        ]
    );

    if (!courierData || !trackingNumberData || isLoading) return <TrackingNumberSkeleton />;

    return (
        <TrackingNumberContext.Provider value={{...context}}>
            {children}
        </TrackingNumberContext.Provider>
    );
};

export default TrackingNumberProvider;
