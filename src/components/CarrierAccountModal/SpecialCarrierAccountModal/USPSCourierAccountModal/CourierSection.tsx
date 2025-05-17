import {Stack, TextStyle, Button} from '@shopify/polaris';
import React from 'react';
import {Trans} from 'react-i18next';

import CourierSection from '@/components/CourierSection';
import useTestMode from '@/hooks/useTestMode';
import {NAMESPACE, t} from '@/i18n';
import {useGetCourierBySlug} from '@/queries/couriers';

interface Props {
    slug: string;
}

interface CourierDescProps {
    isTestMode?: boolean;
}

export const courierDescriptions: Record<string, ({isTestMode}: CourierDescProps) => JSX.Element> =
    {
        'usps-discounted': ({isTestMode}: CourierDescProps) => (
            <Stack vertical spacing="none">
                {isTestMode ? (
                    <TextStyle variation="subdued">
                        {t(
                            'usps.discount.desc.test_mode',
                            'Enter sandbox credentials to try out in test mode.'
                        )}
                    </TextStyle>
                ) : (
                    <TextStyle variation="subdued">
                        <Trans ns={NAMESPACE} i18nKey="usps.discount.desc">
                            Enjoy up to 89% off{' '}
                            <Button
                                url="https://www.postmen.com/shipping-calculator"
                                external
                                plain
                            >
                                USPS shipping rates
                            </Button>
                            . Ship from US only.
                        </Trans>
                    </TextStyle>
                )}
            </Stack>
        ),
    };

export const defaultDescription = ({isTestMode}: CourierDescProps) => {
    return (
        <Stack vertical spacing="none">
            <TextStyle variation="subdued">
                {isTestMode
                    ? t(
                          'usps.default.desc.test_mode',
                          'Enter sandbox credentials to try out in test mode.'
                      )
                    : t(
                          'usps.default.desc',
                          'Enter production credentials to print labels in live mode.'
                      )}
            </TextStyle>
        </Stack>
    );
};

export default function CourierInfo({slug}: Props) {
    const {isTestMode} = useTestMode();
    const {data: courierInfo} = useGetCourierBySlug(slug);

    return (
        <CourierSection slug={slug} courierName={courierInfo?.name} guide={courierInfo?.guide}>
            {courierDescriptions?.[slug]?.({isTestMode}) || defaultDescription({isTestMode})}
        </CourierSection>
    );
}
