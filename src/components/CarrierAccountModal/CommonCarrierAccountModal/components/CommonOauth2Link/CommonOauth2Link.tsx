import {Link, Stack} from '@shopify/polaris';

import {useI18next} from '@/i18n';
import {Oauth2MultiplLinkType, Oauth2SingleLinkType} from '@/queries/oauth2';
import CourierCredentialsFieldBanner from '@/components/CourierCredentialsFieldBanner';
import { showCredentialBannerCarrierSlugs } from '@/constants';

interface Props {
    onLoading: (loading: boolean) => void;
    name: string;
    slug: string;
    url: Oauth2SingleLinkType | Oauth2MultiplLinkType;
}

const CommonOauth2Link = ({onLoading,slug, url, name}: Props) => {
    const {t} = useI18next();
    const isMultipleLink = url instanceof Array;
    const showBanner = showCredentialBannerCarrierSlugs.includes(slug)

    const handleLinkOnclick = (link: string) => {
        onLoading(true);
        location.href = link;
    };

    return (
        <Stack vertical spacing="baseTight">
            <p>
                {t('link.connect_account', {
                    name,
                    defaultValue: `Connect your own ${name} account with AfterShip. `,
                })}
            </p>
            {
                showBanner &&  <div style={{marginTop: '1rem'}}>
                <CourierCredentialsFieldBanner slug={slug} />
            </div>
            }
            {isMultipleLink ? (
                <Stack vertical spacing="baseTight">
                    {url.map(item => (
                        <Link
                            removeUnderline
                            onClick={() => {
                                handleLinkOnclick(item.url);
                            }}
                        >
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </Stack>
            ) : (
                <Link
                    removeUnderline
                    onClick={() => {
                        handleLinkOnclick(url);
                    }}
                >
                    <span>{t('link.login_with', {defaultValue: `Login with ${name}`, name})}</span>
                </Link>
            )}
        </Stack>
    );
};

export default CommonOauth2Link;
