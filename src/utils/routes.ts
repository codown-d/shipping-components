// use `prefix` incase deploy the project in a sub path
import {pathToRegexp, Key, Path} from 'path-to-regexp';
import queryString from 'query-string';
import {useLocation} from 'react-router-dom';

export const prefix = (process.env.SERVED_PATH || '').replace(/\/$/, '');

export function useQuery() {
    return queryString.parse(useLocation().search);
}

export const getRouteParams = (pathExp: Path, url: string) => {
    const keys: Key[] = [];
    const regexp = pathToRegexp(pathExp, keys);
    const match = regexp.exec(url);
    if (!match) return {};

    const [, ...values] = match;

    const params = keys.reduce<Record<Key['name'], any>>((acc, key, index) => {
        acc[key.name] = values[index];
        return acc;
    }, {});

    return params;
};

export const isUrlInTestMode = (url: string): boolean =>
    Boolean(getRouteParams('(/shipping)?/:mode(test)/(.*)', url)?.mode);

export const getIsInPathTestMode = (): boolean => {
    return isUrlInTestMode(window.location.pathname);
};

export const getIsInTestMode = (): boolean => {
    return getIsInPathTestMode() || localStorage.getItem('postmenSandboxEnabled') === 'true';
};

interface Options {
    withTestMode?: boolean;
}

export const path = (thePath: string, options?: Options): string => {
    if (options?.withTestMode) {
        return `${getIsInPathTestMode() ? '/test' : ''}${thePath}`;
    }

    return thePath;
};
