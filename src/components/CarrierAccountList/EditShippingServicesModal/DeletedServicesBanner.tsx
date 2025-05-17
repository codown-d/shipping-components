import {Banner} from '@shopify/polaris';
import React from 'react';

import {getDeletedServicesBannerContent} from './utils';

import {ShippingServiceSetting} from '@/queries/carrierAccounts';
import {CourierFull} from '@/queries/couriers';

interface IProps {
    accountServices: ShippingServiceSetting[];
    courier?: CourierFull;
}

const DeletedServicesBanner = ({accountServices, courier}: IProps) => {
    const bannerContent = getDeletedServicesBannerContent(accountServices, courier);

    if (!bannerContent) return null;

    return <Banner status="warning">{bannerContent}</Banner>;
};

export default DeletedServicesBanner;
