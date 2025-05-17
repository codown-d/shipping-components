import {useEffect, useState} from 'react';

import {useGetRegisterUrl} from '@/queries/carrierAccounts';

export const useCanadaPostRegisterUrl = (isBeforeCanadapostLogin: boolean, slug?: string) => {
    const [registerUrl, setRegisterUrl] = useState('');
    const {mutate: getRegisterUrl} = useGetRegisterUrl();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (slug === 'canada-post' && isBeforeCanadapostLogin) {
            setIsLoading(true);
            getRegisterUrl(
                {
                    return_url: `${location.origin}${location.pathname}`, // 不使用 href, 因为 rc 跳转过来会带上 utm_source, canada post 会拼接 token-id 等 params 时格式错误(postmen.com/?utm_source=returns?token-id=xxx)
                },
                {
                    onSuccess: res => setRegisterUrl(res.registration_url),
                    onSettled: () => {
                        setIsLoading(false);
                    },
                }
            );
        }
    }, [slug, isBeforeCanadapostLogin]);

    return {
        registerUrl,
        isLoading,
    };
};
