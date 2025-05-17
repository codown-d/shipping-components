import {Banner, Button} from '@shopify/polaris';
import React from 'react';
import {Trans} from 'react-i18next';

import {NAMESPACE} from '@/i18n';

const courierBannerContent: Record<string, React.ReactNode> = {
    sendle: (
        <p>
            <Trans i18nKey="courier_banner.sign_up" ns={NAMESPACE}>
                Don't have a Sendle account? AfterShip Shipping users can enjoy Sendle Premium
                immediately without any minimum shipment quantities.{' '}
                <Button external url="https://try.sendle.com/en-us/partners/aftership" plain>
                    Sign up now
                </Button>
            </Trans>
        </p>
    ),
    ups: (
        <p>
            <Trans i18nKey="courier_banner.open_account" ns={NAMESPACE}>
                Don't have a UPS account? Enjoy <strong>up to 72% off</strong> with no minimum
                volume requirements.{' '}
                <Button
                    external
                    url="https://www.ups.com/get-discounted-rates?WT.mc_id=Ready_Postmen_100008"
                    plain
                >
                    Open account
                </Button>
            </Trans>
        </p>
    ),
};

export default function CourierCredentialsFieldBanner({slug}: {slug: string}) {
    if (!slug || !courierBannerContent?.[slug]) return null;

    return <Banner status="info">{courierBannerContent?.[slug]}</Banner>;
}
