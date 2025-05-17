import {useState, useRef, MutableRefObject} from 'react';

import {ResponseMeta} from '@/queries/response';

interface Config {
    retryDelay: number;
    retry: number;
}

export interface MutateOptions<T> {
    onSuccess?: (res: T) => void;
    onError?: (res: ResponseMeta) => void;
    onSettled?: VoidFunction;
}

interface IntervalData {
    handleRetry: (func: VoidFunction) => void;
    clearRetry: VoidFunction;
    intervalTimesRef: MutableRefObject<number>;
    retryIntervalRef: MutableRefObject<number | null>;
}

const DEFAULR_RETRY_DELAY = 1000;

const useInterval = (config?: Config): IntervalData => {
    const intervalTimesRef = useRef(0);
    const retryIntervalRef = useRef<number | null>(null);

    const countIntervalTime = () => {
        intervalTimesRef.current += 1;
    };

    const clearRetry = () => {
        if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
            retryIntervalRef.current = null;
        }
    };

    const handleRetry = (requestFunc: VoidFunction) => {
        if (!retryIntervalRef.current && config?.retry) {
            retryIntervalRef.current = window.setInterval(() => {
                if (intervalTimesRef.current <= (config?.retry ?? 0)) {
                    requestFunc();
                    countIntervalTime();
                } else {
                    clearRetry();
                }
            }, config?.retryDelay ?? DEFAULR_RETRY_DELAY);
        }
    };

    return {
        handleRetry,
        clearRetry,
        intervalTimesRef: intervalTimesRef, //直接 export intervalTimesRef.current 会是一个不更新的值
        retryIntervalRef: retryIntervalRef,
    };
};

const useMutation = <T, P>(request: (params: T) => Promise<P>, config?: Config) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ResponseMeta>();
    const {clearRetry, handleRetry, intervalTimesRef, retryIntervalRef} = useInterval(config);

    const mutate = (params: T, options?: MutateOptions<P>) => {
        setIsLoading(true);

        const requestFunc = () => {
            request(params)
                .then(res => {
                    clearRetry();
                    options?.onSuccess?.(res);
                })
                .catch(err => {
                    if (!config?.retry || intervalTimesRef.current === config.retry) {
                        setError(err);
                        options?.onError?.(err);
                        return;
                    }
                    handleRetry(requestFunc);
                })
                .finally(() => {
                    // 如果没有重试线程 || 到达最大重试次数，则走 finally 流程
                    if (intervalTimesRef.current === config?.retry || !retryIntervalRef.current) {
                        setIsLoading(false);
                        options?.onSettled?.();
                    }
                });
        };

        requestFunc();
    };

    return {mutate, isLoading, error};
};

export default useMutation;
