import {Page} from '@shopify/polaris';
import React from 'react';

import CarrierList from '../CarrierList';

const CarrierListPage = ({onClick}: {onClick: (slug: string) => void}) => {
    return (
        <Page title="Add carrier accounts">
            <CarrierList onClick={onClick} />
        </Page>
    );
};

export default CarrierListPage;
