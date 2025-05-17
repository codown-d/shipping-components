import {omit} from 'lodash';
import {useEffect} from 'react';
import {useFormContext} from 'react-hook-form';

import {getOauth2QueryData} from './useOauth2DataAfterLogin';

import {t} from '@/i18n';
import {IGetOauthTokenStatus, IStateDetailData} from '@/queries/oauth2';
import {useQueryOauthTokens} from '@/queries/oauth2/oauth2';

interface IProps {
    slug: string;
    oauth_field_name?: IStateDetailData['oauth_field_name'];
    onErrorMessage?: (message: string) => void;
}

// 将 oauth2 的信息注入到 hook form credentials 中，保存时走通用逻辑，handleSubmit 直接取值
const useInjectOauth2TokensToForm = ({slug, onErrorMessage, oauth_field_name}: IProps) => {
    const {setValue, register} = useFormContext();
    const {auth_code: authCode, state: state} = getOauth2QueryData(oauth_field_name);

    const {data, isLoading} = useQueryOauthTokens({slug, auth_code: authCode, state});

    useEffect(() => {
        if (data?.status === IGetOauthTokenStatus.FAILED) {
            onErrorMessage?.(t('error.login_failed', 'Login failed, please try again.'));
        }

        // 获取 token 成功后，注册 name 且 setValue，这样子 handleSubmit 的时候，能直接拿到数据。
        if (data?.status === IGetOauthTokenStatus.SUCCEED) {
            // oauth 场景下，submit 的时候需要剔除 redirect_url 和 status 字段
            Object.entries(omit(data, ['redirect_url', 'status'])).forEach(([name, value]) => {
                const hookFormName = `credentials.${name}`;
                register(hookFormName);
                setValue(hookFormName, value);
            });
        }
    }, [data]);

    return {
        isLoading, // 是否正在获取 token 数据
        status: data?.status,
        reauthUrl: data?.redirect_url,
    };
};

export default useInjectOauth2TokensToForm;
