import {
    IOauth2UrlResponse,
    IOauthTokenValues,
    IOauthTokensPayload,
    IStateDetailData,
} from './types';

import useQuery from '@/hooks/useQuery';
import {request} from '@/utils/network';

export const useGetOauthRedirectUrlBySlug = (
    slug: string,
    enabled: boolean,
    accountId?: string
) => {
    return useQuery<IOauth2UrlResponse>(
        () =>
            request(
                `/v4/me/couriers/${slug}/oauth-redirect-url${accountId ? `?courier_account_id=${accountId}` : ''}`
            ),
        {
            enabled: Boolean(slug) && enabled,
        }
    );
};

// oauth2 流程中，redirect  回来的地址会带 state query param，根据 state 去拿详细信息，例如 carrier account id、slug
export const useQueryOauthStateDetail = (state: string) => {
    return useQuery<IStateDetailData>(() => request(`/v4/me/couriers/${state}/oauth-state`), {
        enabled: Boolean(state),
    });
};

// 该接口通过 state、auth_code 拿到 tokens，前端存储起来，在 create account 的时候将 tokens 信息(该接口的所有数据)发送到后端
export const useQueryOauthTokens = ({slug, auth_code, state}: IOauthTokensPayload) => {
    return useQuery<IOauthTokenValues>(
        () => request(`/v4/me/couriers/${slug}/oauth-tokens?auth_code=${auth_code}&state=${state}`),
        {
            enabled: Boolean(slug && auth_code && state),
        }
    );
};
