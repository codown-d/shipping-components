import {Alpha3CountryCode} from '@/constants/Alpha3CountryCode';
import {CourierShippingAddress, CourierCredentials} from '@/queries/carrierAccounts';

export interface FedExCourierAccount {
    description: string;
    slug: string;
    credentials: CourierCredentials;
    account_country: string;
    shipping_address: CourierShippingAddress;
    settings: {
        preferred_currency: string | null;
    };
}

export enum METHOD {
    ADD = 'add',
    EDIT = 'edit',
}

export enum SuccessMessage {
    ADD = 'Carrier account set up successfully.',
    EDIT = 'Carrier account edit successfully.',
}

export interface FedExBannerInfo {
    url: string;
    title?: string;
    description?: string;
}

export type FedExBannerInfoType = Partial<Record<Alpha3CountryCode, FedExBannerInfo>> & {
    default: FedExBannerInfo;
};

export const countryFedExBannerInfoMap: FedExBannerInfoType = {
    default: {
        url: 'https://advantagemember.van.fedex.com/7996/index.php',
        title: 'Up to 78% off discount 🤑 offered by FedEx AMEA and AfterShip Shipping! 🎉',
        description: 'Sign up now to ship 0.5 kg from China to the U.S. for as low as RMB 97!',
    },
    CHN: {
        url: 'https://www.fedex.com/zh-cn/shipping/industry-solutions/ecommerce/alliances-postmen.html',
        title: 'Up to 78% off discount 🤑 offered by FedEx AMEA and AfterShip Shipping! 🎉',
        description: 'Sign up now to ship 0.5 kg from China to the U.S. for as low as RMB 97!',
    },
    HKG: {
        url: 'https://www.fedex.com/en-hk/shipping/industry-solutions/ecommerce/alliances-postmen.html',
        title: 'Up to 80% off discount 🤑 offered by FedEx AMEA and AfterShip Shipping! 🎉',
        description: 'Sign up now to ship 0.5 kg from HK to the U.S. for as low as HKD 107!',
    },
    USA: {
        url: 'https://advantagemember.van.fedex.com/7996/index.php',
    },
};

export const FedexAgreementUrl =
    'https://support.postmen.com/en/article/fedex-end-user-license-agreement-1l1s8bm/?bust=1630656672370';
