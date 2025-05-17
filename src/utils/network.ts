import {getAuthorization, getOrganization, getAuth} from '@aftership/automizely-product-auth';
import omit from 'lodash/omit';
import {v4 as uuid} from 'uuid';

import host from './host';

import {getIsInTestMode} from '@/utils/routes';

const BASE_URL = host.postmenAPI;

const getRequestHeader = async () => {
    const authToken = await getAuthorization();
    const isTestMode = getIsInTestMode();

    const org = await getOrganization();
    const testModeHeader = isTestMode ? {'AM-MODE': 'test'} : {'AM-MODE': 'live'};

    const source = await getAuth();

    const sourceId = source?.getConfig().clientId;

    return {
        'Content-Type': 'application/json',
        Authorization: authToken || '',
        'am-trace-id': uuid(),
        'AM-ORGANIZATION-ID': org.id || '',
        'am-source': sourceId === 'postmen' ? 'shipping' : sourceId,
        ...testModeHeader,
    };
};

export const request = async <T>(
    path: string,
    init?: Omit<RequestInit, 'body'> & {body?: Record<string, any>}
): Promise<T> => {
    const config: RequestInit = {
        headers: await getRequestHeader(),
        ...omit(init, 'body'),
        ...(init?.body && {body: JSON.stringify(init.body)}),
    };
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + path, config)
            .then(res => res.json())
            .then(res => {
                if (res.meta.code < 40000) {
                    resolve(res.data);
                } else {
                    reject(res.meta);
                }
            })
            .catch(error =>
                reject({
                    code: error?.code,
                    message: 'Something went wrong, please try again.',
                })
            );
    });
};
