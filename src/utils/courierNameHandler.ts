import {t} from '@/i18n';

enum CourierName {
    'USPS' = 'USPS',
}

const courierNameHandler = (courierName?: CourierName | string) => {
    if (!courierName) return '';

    switch (courierName) {
        case CourierName.USPS:
            return t('courier.usps.name', 'USPS by Maersk');
        default:
            return courierName;
    }
};

export default courierNameHandler;
