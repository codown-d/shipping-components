import {Frame} from '@shopify/polaris';

import CarrierPage from './CarrierPage';

import CarrierManager from '@/container';

const config = {
    productName: 'AfterShip Shipping',
    trackingNumberPagePathName: '/tracking-number',
    text: {
        removeBanner: '',
    },
    billing: {
        currentPlanName: '',
        carrierAccountQuota: 3,
        onUpgrade: () => {},
    },
    carrierListContentConfig: {
        fedex: {
            content: 'Free poly mailer bags (12 x 15 in) offered for US shipments up to 5 lbs.',
        },
        usps: {
            content: 'comming soon',
            disabled: true,
        },
    },
};

const CarrierManagerProvider = () => {
    return (
        <Frame>
            <CarrierManager config={config}>
                <CarrierPage />
            </CarrierManager>
        </Frame>
    );
};

export default CarrierManagerProvider;
