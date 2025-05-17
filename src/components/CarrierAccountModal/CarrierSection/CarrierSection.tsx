import {Link, Stack, TextStyle, Badge} from '@shopify/polaris';
import React from 'react';
import {Trans} from 'react-i18next';

import SlugIcon from '@/components/SlugIcon';
import useTestMode from '@/hooks/useTestMode';
import {NAMESPACE, useI18next} from '@/i18n';

interface ICarrierSectionProps {
    slug: string;
    name: string;
    guideUrl: string;
}

const LIVE_MODE_TEXT = 'Enter production credentials to print labels in live mode.';
const TEST_MODE_TEXT = 'Enter sandbox credentials to try out in test mode.';

const CarrierSection = (props: ICarrierSectionProps) => {
    const {t} = useI18next();
    const {slug, name, guideUrl = ''} = props;
    const {isTestMode} = useTestMode();

    return (
        <Stack>
            <Stack.Item>
                <SlugIcon name={slug} />
            </Stack.Item>
            <Stack.Item fill>
                <Stack vertical spacing="none">
                    <Stack alignment="center" spacing="tight">
                        <TextStyle variation="strong">{name}</TextStyle>
                        {isTestMode ? (
                            <Badge>
                                {t('carrier_section.test_mode', {defaultValue: 'Test mode'})}
                            </Badge>
                        ) : null}
                    </Stack>
                    <TextStyle variation="subdued">
                        <Trans
                            ns={NAMESPACE}
                            i18nKey="fed_ex_modal.courier_section"
                            values={{courierName: name}}
                        >
                            Learn more about{' '}
                            <Link external url={guideUrl}>
                                setting up {name} account
                            </Link>
                            .
                        </Trans>
                    </TextStyle>
                </Stack>
            </Stack.Item>
        </Stack>
    );
};

export default CarrierSection;
