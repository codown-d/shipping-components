import {countryFedExBannerInfoMap, FedExBannerInfo} from './typings';

import {Alpha3CountryCode} from '@/constants/Alpha3CountryCode';
import {t} from '@/i18n';

export const getFedExBannerInfo = (country: Alpha3CountryCode): FedExBannerInfo =>
    countryFedExBannerInfoMap[country] || countryFedExBannerInfoMap.default;

export const getIsFedexSmartPost = (slug: string) => slug === 'fedex-smartpost';

export const fedexNameMap: Record<string, string> = {
    fedex: t('fedex', 'FedEx®'),
    'fedex-smartpost': t('fedex_ground_economy', 'FedEx Ground® Economy'),
};
