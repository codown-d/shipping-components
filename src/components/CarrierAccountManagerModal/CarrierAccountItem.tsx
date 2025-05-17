import {ResourceItem, TextStyle} from '@shopify/polaris';
import React from 'react';

import {CarrierAccountItem} from './types';

import SlugIcon from '@/components/SlugIcon';

const renderItem = (item: CarrierAccountItem) => {
    const {id, name, slug, originSlugName} = item;

    return (
        <ResourceItem
            id={id}
            url=""
            media={<SlugIcon name={slug} />}
            accessibilityLabel={`add ${name} account`}
        >
            {name}
            <div>
                <TextStyle variation="subdued">{originSlugName}</TextStyle>
            </div>
        </ResourceItem>
    );
};

export default renderItem;
