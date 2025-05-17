import {Choice} from '@/components/FormFields/ChoiceList';
import {t} from '@/i18n';
import {ShippingServiceSetting} from '@/queries/carrierAccounts/types';
import {CourierFull} from '@/queries/couriers';

const getCourierShippingServices = (courier: CourierFull) => {
    return (
        courier?.courier_service_types?.map(service => {
            return {
                service_type: service.service_type,
                name: (service.service_name || service['rates.service_name']) as string,
                from_country: service['ship_from.country'],
                enabled: false,
            };
        }) ?? []
    );
};

export const getCourierAccountShippingServicesOptions = (
    courier?: CourierFull,
    slug?: string,
    accountCountry?: string | null
) => {
    if (!courier) {
        return [];
    }

    const allShippingServices = getCourierShippingServices(courier);

    const fedexServiceFilterInfo = {
        country: 'CAN',
        slug: 'fedex',
        type: 'fedex_express_saver',
        name: 'FedEx Economy',
        otherCountryName: 'FedEx Express Saver®',
    };

    return allShippingServices
        .filter(item => {
            if (
                slug === fedexServiceFilterInfo.slug &&
                item.service_type === fedexServiceFilterInfo.type
            ) {
                return accountCountry === fedexServiceFilterInfo.country
                    ? item.name === fedexServiceFilterInfo.name
                    : item.name === fedexServiceFilterInfo.otherCountryName;
            }
            return true;
        })
        .map(item => ({
            value: item?.service_type,
            label: item?.name,
        }));
};

export const shippingServicesAdaptor = (
    selected: string[],
    allOptions: Choice[]
): ShippingServiceSetting[] => {
    return allOptions.map(item => ({
        name: item.label?.toString() ?? '',
        service_type: item?.value,
        enabled: selected ? Boolean(selected?.includes(item?.value)) : false,
    }));
};

// service 已删除的 banner 展示

// get shipping services which is now in enabled shipping services setting but can not find in all shipping services
export const getDeletedShippingServices = (
    accountServices: ShippingServiceSetting[], // 从 /v4/me/courier-accounts/${id}/shipping-services 拿的数据
    courier: CourierFull // 从 v4/me/couriers/${slug} 拿的数据
): string[] => {
    const allServices = getCourierShippingServices(courier);

    const allServicesTypes = allServices.map(service => service.service_type);

    return accountServices
        .filter(item => {
            return !allServicesTypes?.includes(item?.service_type);
        })
        .map(service => service.name);
};

// content for deletedShippingServices Banner
export const getDeletedServicesBannerContent = (
    accountServices: ShippingServiceSetting[],
    courier?: CourierFull
): string | null => {
    if (!courier) {
        return null;
    }

    const deletedServices = getDeletedShippingServices(accountServices, courier);

    if (deletedServices && deletedServices.length >= 1) {
        if (deletedServices.length === 1) {
            return t('service.not_available', `${deletedServices[0]} is not available anymore.`, {
                service: deletedServices[0],
            });
        }
        return t(
            'service.not_available.multiple',
            `${deletedServices[0]}, ${deletedServices[1]} are not available anymore.`,
            {
                service1: deletedServices[0],
                service2: deletedServices[1],
            }
        );
    }

    return null;
};
