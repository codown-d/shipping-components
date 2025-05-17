import qs from 'query-string';
import {useMemo} from 'react';

import {ModalMode} from './useModalInfoMap';

import {findMaxSchemaCourierAccount} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/hooks/useCarrierAccountFieldList';
import {useGetCourierBySlug} from '@/queries/couriers';
import {IStateDetailData} from '@/queries/oauth2';
import {useQueryOauthStateDetail} from '@/queries/oauth2/oauth2';

type QueryNormalType = {auth_code: string; state: string};
type QueryType = QueryNormalType & {[key: string]: string};

function isQueryIncludeNormalKey(key: string): key is keyof QueryNormalType {
    return ['auth_code', 'state'].includes(key as string);
}

export const getOauth2QueryState = () => {
    const query = qs.parse(location.search);
    return query['state'] as string;
};

export const getOauth2QueryData = (oauth_field_name?: IStateDetailData['oauth_field_name']) => {
    const query = qs.parse(location.search);
    let queryData: QueryType = {
        auth_code: query['authorization_code'] as string,
        state: query['state'] as string,
    };

    if (oauth_field_name) {
        queryData = Object.keys(oauth_field_name).reduce((acc: Record<string, string>, key) => {
            if (!isQueryIncludeNormalKey(key)) {
                return acc;
            }
            const queryKey = oauth_field_name[key];
            acc[key] = query[queryKey] as string;
            return acc;
        }, {}) as QueryType;
    }

    return queryData;
};

export const useOauth2LoginStatus = (oauth2Enabled: boolean, mode: ModalMode) => {
    const {state} = useOauth2DataAfterLogin();
    const {auth_code: authCode} = getOauth2QueryData(state?.oauth_field_name);

    return {
        isBeforeOauth2Login:
            oauth2Enabled && !authCode && (mode === ModalMode.ADD || mode === ModalMode.UPGRADE),
        isAfterOauth2Login:
            oauth2Enabled && !!authCode && (mode === ModalMode.ADD || mode === ModalMode.EDIT),
    };
};

// 登录之后拿到的相关数据
const useOauth2DataAfterLogin = () => {
    // 从 qs 中取出 state 后,调用接口获取 OAuth2 后的上下文
    const oauthState = getOauth2QueryState();
    const {data: stateDetail} = useQueryOauthStateDetail(oauthState);

    const {slug = ''} = stateDetail || {};

    const {data} = useGetCourierBySlug(slug);
    const isOauth2Enabled = findMaxSchemaCourierAccount(
        data?.courier_accounts ?? []
    )?.oauth_enabled;
    return useMemo(() => {
        return {
            isOauth2Enabled: isOauth2Enabled,
            state: stateDetail,
            slug,
        };
    }, [isOauth2Enabled, stateDetail, slug]);
};

export default useOauth2DataAfterLogin;
