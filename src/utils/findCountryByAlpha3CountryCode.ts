import {countryPhoneData} from 'phone';

export function findCountryByAlpha3CountryCode(alpha3CountryCode: string) {
    const country = countryPhoneData.find(countryData => countryData.alpha3 === alpha3CountryCode);
    return country;
}
