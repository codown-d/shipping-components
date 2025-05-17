import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {phone} from 'phone';
import React, {useMemo, useEffect, useRef} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {useUpdateEffect} from 'react-use';

import CountryCallingCodeOptionList, {defaultSelected} from '@/components/CallingCodeOptionsList';
import ConnectedTextField from '@/components/FormFields/TextField';
import {findCountryByAlpha3CountryCode} from '@/utils/findCountryByAlpha3CountryCode';

interface Props {
    callingCodeName: string;
    phoneNumberName: string;
    label: string;
    callingCodeClassName?: string;
    disabled?: boolean;
}

export default function CallingCodeField({
    callingCodeName,
    phoneNumberName,
    label,
    callingCodeClassName,
    disabled = false,
}: Props) {
    const {getValues, watch, errors, trigger} = useFormContext();

    const defaultPhoneCallingCode = get(getValues(), callingCodeName, defaultSelected.callingCode);

    const callingCode = watch(callingCodeName) || '';
    const callingNumber = watch(phoneNumberName) || '';

    const values = useMemo(() => {
        if (!callingCode && !callingNumber) return null;
        const phoneNumber = `+${callingCode}${callingNumber}`;
        const alpha3CountryCode = phone(phoneNumber).countryIso3 || '';
        const country = findCountryByAlpha3CountryCode(alpha3CountryCode);
        return {
            name: country?.country_name as string,
            callingCode,
        };
    }, [callingCode, callingNumber]);

    const getError = (name: string) => {
        if (!isEmpty(errors) && get(errors, name, false)) {
            return get(errors, name, {})?.message || '';
        }
        return undefined;
    };

    useUpdateEffect(() => {
        trigger([callingCodeName, phoneNumberName]);
    }, [callingCode, callingNumber]);

    return (
        <ConnectedTextField
            name={phoneNumberName}
            label={label}
            error={getError(phoneNumberName)}
            disabled={disabled}
            connectedLeft={
                <Controller
                    name={callingCodeName}
                    render={({onChange}) => {
                        return (
                            <CountryCallingCodeOptionList
                                onChange={onChange}
                                defaultValue={values}
                                error={getError(callingCodeName)}
                                className={callingCodeClassName}
                                disabled={disabled}
                            />
                        );
                    }}
                    defaultValue={defaultPhoneCallingCode}
                />
            }
        />
    );
}
