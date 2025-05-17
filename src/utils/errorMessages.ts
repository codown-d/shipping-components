import {t} from '@/i18n';

// generate the error message for invalid input in form fields
export const getRequiredMessage = (fieldName: string) => {
    return t('message.required', `${fieldName} is required.`, {name: fieldName});
};

export const getMinStringMessage = (len: number) => {
    return t('message.min_string', `Minimum length is ${String(len)} characters.`, {
        len: String(len),
    });
};

export const getMaxStringMessage = (len: number) => {
    return t('message.max_string', `Maximum length is ${String(len)} characters.`, {
        len: String(len),
    });
};

export const getTypeMessage = (fieldName: string) => {
    return t('message.type_string', `Please enter a valid ${fieldName}.`, {name: fieldName});
};

export const getMinNumberMessage = (fieldName: string, min: number) => {
    return t('message.min_number', `${fieldName} must be greater than ${min}.`, {
        name: fieldName,
        min,
    });
};

export const getMaxNumberMessage = (fieldName: string, max: number) => {
    return t('message.max_number', `${fieldName} must be less than ${max}.`, {
        name: fieldName,
        max,
    });
};

export const getGreaterOrEqualMessage = (fieldName: string, min = 0) => {
    return t('message.greator_or_equal', `${fieldName} must be greater than or equal to ${min}.`, {
        name: fieldName,
        min,
    });
};

export const getMatchMessage = (filedName: string, regex: string) =>
    t('message.match', `The ${filedName} not match the format ${regex}`, {name: filedName, regex});
