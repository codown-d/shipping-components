import classNames from 'clsx';
import {DependencyList, useEffect, useRef} from 'react';

export const useCustomPopupClassName = <T extends HTMLElement = HTMLElement>(
    className: string,
    deps?: DependencyList
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const curPopoverRef = ref.current?.closest('[data-portal-id]');

        if (curPopoverRef && !curPopoverRef.className?.includes(className)) {
            curPopoverRef.className = classNames(curPopoverRef.className, className);
        }
    }, deps);

    return ref;
};
