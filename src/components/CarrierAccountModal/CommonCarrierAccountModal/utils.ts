import {
    UPSAddressRequiredField,
    addressRequiredField,
    royilMailRequiredField,
} from './components/AddressFormSection/constants';

import {UPSCarrierSlugs, RoyalMail} from '@/constants';

export const getaddressRequiredFields = (slug: string) => {
    if (UPSCarrierSlugs.includes(slug)) return UPSAddressRequiredField;
    if (slug === RoyalMail) return royilMailRequiredField;
    return addressRequiredField;
};
