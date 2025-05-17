import {useCallback, useEffect, useMemo, useState} from 'react';

const useQuery = <T>(request: () => Promise<T>, config = {enabled: true}) => {
    const [data, setData] = useState<T>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetch = useCallback(() => {
        if (!config.enabled) return;

        setIsLoading(true);
        request()
            .then(res => {
                setData(res);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [config.enabled, request.toString()]);

    useEffect(() => {
        if (config.enabled) {
            fetch();
        }
    }, [config.enabled]);

    return useMemo(() => {
        return {data, isLoading, refetch: fetch};
    }, [data, isLoading, fetch]);
};

export default useQuery;
