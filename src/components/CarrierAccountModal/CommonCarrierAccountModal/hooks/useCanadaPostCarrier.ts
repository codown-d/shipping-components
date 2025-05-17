import qs from 'query-string';
import {useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';

import {ModalMode} from './useModalInfoMap';

import {t} from '@/i18n';
import {useGetCredentials} from '@/queries/carrierAccounts';
import {CredentialsResponse, RegistrationStatus} from '@/queries/couriers';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

export const getFromCanadapost = (slug?: string, mode?: ModalMode) => {
    const query = qs.parse(location.search);

    const tokenId = query['token-id'] as string;

    const registrationStatus = query['registration-status'] as unknown as RegistrationStatus;

    const isAfterCanadapostLogin = tokenId && registrationStatus;

    const isBeforeCanadapostLogin =
        slug === 'canada-post' && !isAfterCanadapostLogin && mode === ModalMode.ADD;

    return {isAfterCanadapostLogin, tokenId, registrationStatus, isBeforeCanadapostLogin};
};

interface ICanadaPostCarrierInfoParams {
    slug?: string;
    onErrorMessage?: (message: string) => void;
}

export const useCanadaPostCarrierInfoInject = ({
    slug,
    onErrorMessage,
}: ICanadaPostCarrierInfoParams) => {
    const form = useFormContext();

    const {mutate: getCredentials} = useGetCredentials();

    const {isAfterCanadapostLogin, tokenId, registrationStatus} = getFromCanadapost(slug);

    const [isLoading, setLoading] = useState<boolean>(false);

    const [infos, setInfos] = useState<CredentialsResponse | null>(null);

    useEffect(() => {
        infos && form.setValue('credentials', infos);
    }, [form, infos]);

    useEffect(() => {
        if (isAfterCanadapostLogin) {
            setLoading(true);

            getCredentials(
                {token_id: tokenId, registration_status: registrationStatus},
                {
                    onSuccess: ({
                        api_key,
                        contract_id,
                        customer_number,
                        method_of_payment,
                        ...rest
                    }: CredentialsResponse) => {
                        // Add dependency of form.setValue wouble be render alaways
                        // Therefore not to setValue directly here
                        setInfos({
                            api_key,
                            contract_id,
                            customer_number,
                            method_of_payment,
                            ...rest,
                        });
                    },
                    onError: error => {
                        const meta =
                            error.code === 42216
                                ? Object.assign({}, error, {
                                      errors: [
                                          {
                                              info: t(
                                                  'error.carrier_add_failed',
                                                  'Add carrier account failed. Please try again.'
                                              ),
                                          },
                                      ],
                                  })
                                : error;
                        onErrorMessage && onErrorMessage(getErrorMessageByMeta(meta));
                    },
                    onSettled: () => {
                        setLoading(false);
                    },
                }
            );
        }
    }, []);

    return {isLoading};
};
