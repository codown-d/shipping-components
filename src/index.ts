import {init} from './i18n';

export {default as CarrierManagerProvider} from './container';

export * from './container/CarrierManagerProvider/hooks/hooks';

export type {ICarrierManagerStaticContext} from './container/CarrierManagerProvider';

export {default as CarrierAccountList} from './container/CarrierAccountList';

export {default as TrackingNumberPage} from './container/TrackingNumber';

export {default as USPSDiscountedAccount} from './container/USPSDiscountedAccount';

export {
    useEditCarrierAccountPersonal,
    useEditCarrierAccountsPersonal,
    useEditCourierAccountsEnabled,
} from '@/queries/carrierAccounts';

export {useGetAllCouriers} from '@/queries/couriers';

export * from '@/queries/couriers/types';

export * from '@/queries/carrierAccounts/types';

export * from '@/types/locations';

export {default as Partners} from './components/Partners';

export {default as ShippingPartner} from './components/ShippingPartner';

export {default as ShippingPartnerModal} from './components/ShippingPartnerModal';

export {default as EasyshipAccountModal} from './components/EasyshipAccountModal';

export {useGetShippingPartners} from './queries/shippingPartners';

export {default as AccountInformation} from './components/AccountInformation';
export type {AccountInformationData} from './components/AccountInformation';

export {default as EnabledCarrierServices} from './components/EnabledCarrierServices';
export type {
  EnabledCarrierServicesData,
  Carrier,
  CarrierService,
  LabelDisplayOption
} from './components/EnabledCarrierServices';

init();
