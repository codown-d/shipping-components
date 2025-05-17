import countries from 'i18n-iso-countries';
import {useMemo} from 'react';

import {Alpha3CountryCode} from '@/constants/Alpha3CountryCode';
import {BrowserLanMapCountry} from '@/constants/CountryCode';
import useQuery from '@/hooks/useQuery';

export const useQueryCountryCode = () => {
    const uri = 'https://www.cloudflare.com/cdn-cgi/trace';
    // const {data, isSuccess} = useQuery(() => {
    const {data} = useQuery(() => {
        const result = fetch(uri).then(response => {
            return response.text() || Promise.reject(response);
        });
        return result;
    });
    const countryCode = useMemo(() => {
        // if (isSuccess && data) {
        if (data) {
            return data.substr(data.indexOf('loc=') + 4, 2);
        }
        return undefined;
        // }, [data, isSuccess]);
    }, [data]);
    return countryCode;
};

// return the user's alpha3 country code
export const useCountryCode = (): Alpha3CountryCode => {
    const countryCode = useQueryCountryCode();

    // Plan B：if useQueryCountryCode api invalid, can use browser language map country
    const {language} = window.navigator;

    const browserLanMapCountryCode = useMemo(() => {
        return BrowserLanMapCountry[language.toLowerCase()];
    }, [language]);
    return (
        countryCode ? countries.alpha2ToAlpha3(countryCode) : browserLanMapCountryCode
    ) as Alpha3CountryCode;
};
