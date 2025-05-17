import {useHistory} from 'react-router-dom';

import {getIsInTestMode} from '@/utils/routes';

// FIXME: this test mode can not use outside Route component
// fix this later
export function useTestMode() {
    useHistory();
    const isTestMode = getIsInTestMode();

    const urlAdapter = (url: string) => {
        return `${isTestMode ? '/test' : ''}${url}`;
    };

    return {urlAdapter, isTestMode};
}

export default useTestMode;
