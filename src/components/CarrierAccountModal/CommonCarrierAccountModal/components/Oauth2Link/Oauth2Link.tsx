import CanadaPostLinks from '../CanadaPostLinks/CanadaPostLinks';
import CommonOauth2Link from '../CommonOauth2Link';

import {CanadaPostSlug} from '@/constants';
import {Oauth2MultiplLinkType, Oauth2SingleLinkType} from '@/queries/oauth2';

interface Oauth2LinkProps {
    slug: string;
    onLoading: (loading: boolean) => void;
    registerUrl: Oauth2SingleLinkType | Oauth2MultiplLinkType;
    name: string;
}

const Oauth2Link = ({slug, onLoading, registerUrl, name}: Oauth2LinkProps) => {
    if (slug === CanadaPostSlug && typeof registerUrl === 'string') {
        return <CanadaPostLinks onLoading={onLoading} registerUrl={registerUrl} />;
    }

    return <CommonOauth2Link slug={slug} name={name} url={registerUrl} onLoading={onLoading} />;
};

export default Oauth2Link;
