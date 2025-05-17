import {Stack, TextStyle, Button} from '@shopify/polaris';
import React, {FC} from 'react';
import {Trans} from 'react-i18next';

import SlugIcon from '@/components/SlugIcon';
import {NAMESPACE} from '@/i18n';
import courierNameHandler from '@/utils/courierNameHandler';

export interface Props {
    slug: string;
    courierName?: string;
    guide?: string;
    defaultText?: boolean;
}

const CourierSection: FC<Props> = ({slug, children, guide, courierName, defaultText = true}) => {
    return (
        <Stack wrap={false}>
            <Stack.Item>
                <SlugIcon name={slug} />
            </Stack.Item>
            <Stack.Item fill>
                <Stack vertical spacing="none">
                    <Stack>
                        <TextStyle variation="strong">
                            {courierNameHandler(courierName) || ''}
                        </TextStyle>
                    </Stack>
                    {children}
                    {defaultText && (
                        <TextStyle variation="subdued">
                            <Trans
                                i18nKey="fed_ex_modal.courier_section"
                                ns={NAMESPACE}
                                values={{courierName: courierName || ''}}
                            >
                                Learn more about{' '}
                                <Button plain url={guide} external>
                                    setting up {courierName || ''} account
                                </Button>
                                .
                            </Trans>
                        </TextStyle>
                    )}
                </Stack>
            </Stack.Item>
        </Stack>
    );
};

export default CourierSection;
