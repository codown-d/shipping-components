import {countryPhoneData} from 'phone';

export const getCountryNameByCallingCode = (callingCode: string) => {
    const country = countryPhoneData.find(({country_code}) => country_code === callingCode);
    return country?.country_name || '';
};
