import {useState, useCallback} from 'react';

import {useTrackingNumberContext} from './useTrackingNumberContext';

export const useAddModalState = () => {
    const [addModalActive, setAddModalActive] = useState<boolean>(false);
    const {method} = useTrackingNumberContext();

    const openAddModal = useCallback(() => {
        setAddModalActive(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setAddModalActive(false);
    }, []);

    const isValuesMethodModalActive = addModalActive && method === 'VALUES';

    const isRangeMethodModalActive = addModalActive && method === 'RANGE';

    return {
        isValuesMethodModalActive,
        isRangeMethodModalActive,
        openAddModal,
        closeAddModal,
    };
};
