import isoCountries from 'i18n-iso-countries';
// @ts-ignore
import en from 'i18n-iso-countries/langs/en.json';
import sortBy from 'lodash/sortBy';

import {countryList as countries} from './countriesMap';

export const countryOptionsGenerator = () => {
    const options = countries.map(country => ({
        value: country.code,
        label: country.name,
    }));

    return sortBy(options, [item => item.label.toLowerCase()]);
};

export const mapCountriesCodeToCountryOptions = (countriesCode: string[]) => {
    isoCountries.registerLocale(en);
    const result = countriesCode.map(alpha3 => {
        return {label: isoCountries.getName(alpha3, 'en'), value: alpha3};
    });
    return sortBy(result, ['label']);
};

export const CountryOptions = countryOptionsGenerator();
