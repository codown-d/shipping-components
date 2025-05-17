import {t} from '@/i18n';
import {ResponseMeta} from '@/queries/response';

const FALLBACK_ERROR_MESSAGE = t('message.network_error', 'Network error.');

export const getErrorMessageByMeta = (
    responseMeta: ResponseMeta,
    fallbackMessage = FALLBACK_ERROR_MESSAGE
) => {
    let errorInfo;

    if (responseMeta?.errors?.length) {
        errorInfo =
            typeof responseMeta.errors[0].info === 'string'
                ? responseMeta.errors[0].info
                : responseMeta.errors[0].info.message;
    }
    const message = responseMeta?.message;

    return errorInfo || message || fallbackMessage;
};
