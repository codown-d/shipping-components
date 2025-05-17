// https://usehooks-typescript.com/react-hook/use-timeout
import {useEffect, useRef} from 'react';

export function useTimeout(callback: () => void, depState: unknown[], delay?: number) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const timer = setTimeout(() => depState && savedCallback.current(), delay);

        return () => {
            clearTimeout(timer);
            callback();
        };
    }, depState);
}
