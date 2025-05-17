import initMeerkat from '@aftership/meerkat-sdk';
import i18next from 'i18next';
import {getI18n, useTranslation} from 'react-i18next';

export const NAMESPACE = 'shipping-sdk';

// NOTICE: the init i18next or initMeerkat MUST be call at least once or the text will fallback to key
export const init = () => {
    if (!getI18n()) {
        initMeerkat({projectCode: NAMESPACE, disabledAccountDetect: true});
    }
};

export const useI18next = () => {
    return useTranslation(NAMESPACE);
};

export const t = (key: string, defaultValue: string, options?: Record<string, any>) => {
    // eslint-disable-next-line import/no-named-as-default-member
    return i18next.t(key, {
        ...options,
        interpolation: {escapeValue: false, ...options?.interpolation},
        defaultValue,
        ns: NAMESPACE,
    });
};

export * from './constants';
