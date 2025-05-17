import {Stack, TextStyle} from '@shopify/polaris';
import React from 'react';

import styles from './CourierCard.module.scss';

import SlugIcon from '@/components/SlugIcon';
import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';

export interface Props {
    slug: string;
    name: string;
    onClick: (slug: string) => void;
}

export default function CourierCard({slug, name, onClick}: Props) {
    const {carrierListContentConfig} = useCarrierManagerContext();

    return (
        <div
            className={`${styles.card} ${
                carrierListContentConfig?.[slug]?.disabled ? styles.disabled : ''
            }`}
            onClick={() => onClick(slug)}
            id={slug}
        >
            <Stack alignment="center" wrap={false}>
                <Stack.Item fill>
                    <Stack alignment="center" wrap={false}>
                        <SlugIcon size="60px" name={slug} />
                        <Stack.Item fill>
                            <Stack vertical spacing="extraTight">
                                <TextStyle>{name}</TextStyle>
                                {carrierListContentConfig?.[slug]?.content && (
                                    <TextStyle variation="subdued">
                                        {carrierListContentConfig?.[slug]?.content}
                                    </TextStyle>
                                )}
                            </Stack>
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </div>
    );
}
