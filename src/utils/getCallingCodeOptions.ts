import sortBy from 'lodash/sortBy';
import {countryPhoneData} from 'phone';

export const getCallingCodeOptions = () => {
    const callingCodeOptions = countryPhoneData.map(({country_name, country_code}) => ({
        value: JSON.stringify({
            name: country_name,
            callingCode: country_code,
        }),
        label: `${country_name} (+${country_code})`,
    }));

    return sortBy(callingCodeOptions, [item => item.label.toLowerCase()]);
};
