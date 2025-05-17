export interface IOauth2RedirectUrlPayload {
    courier_account_id?: string;
}

export type Oauth2MultiplLinkType = {
    name: string;
    url: string;
}[];

export type Oauth2SingleLinkType = string;

export interface IOauth2UrlResponse {
    redirect_url: Oauth2SingleLinkType | Oauth2MultiplLinkType;
}

export interface IStateDetailData {
    courier_account_id: string;
    slug: string;
    oauth_field_name: {
        auth_code: string;
        state: string;
    };
}

export interface IOauthTokensPayload {
    slug: string;
    auth_code: string;
    state: string; // 特殊字符串，根据 state 去发请求得到其中包含的 carrier 信息(account id, slug)
}

export type IDefaultOauthTokenValues = Record<string, any>;

export enum IGetOauthTokenStatus {
    SUCCEED = 'succeed',
    FAILED = 'failed',
}

export interface IOauthTokenValues extends IDefaultOauthTokenValues {
    status: IGetOauthTokenStatus;
    redirect_url: string;
}
