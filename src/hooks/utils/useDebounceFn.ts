import {debounce} from 'lodash';
import {useMemo} from 'react';
import {useLatest, useUnmount} from 'react-use';

type noop = (...args: any[]) => any;

export interface DebounceOptions {
    wait?: number;
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}

function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
    const fnRef = useLatest(fn);

    const wait = options?.wait ?? 1000;

    const debounced = useMemo(
        () =>
            debounce(
                (...args: Parameters<T>): ReturnType<T> => {
                    return fnRef.current(...args);
                },
                wait,
                options
            ),
        [fnRef, options, wait]
    );

    useUnmount(() => {
        debounced.cancel();
    });

    return {
        run: debounced,
        cancel: debounced.cancel,
        flush: debounced.flush,
    };
}

export default useDebounceFn;
