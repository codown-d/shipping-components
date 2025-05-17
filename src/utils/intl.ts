import {StrictOption} from '@/components/FormFields/Select/Select';

export const currencyFormatUSDInstance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const getCurrencySelectOptions = (options: number[]): StrictOption[] => {
    return (
        options?.map(option => {
            return {
                value: String(option),
                label: currencyFormatUSDInstance.format(option),
            };
        }) ?? []
    );
};
