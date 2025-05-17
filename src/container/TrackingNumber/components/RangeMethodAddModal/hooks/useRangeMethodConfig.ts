import {useMemo} from 'react';

import {useTrackingNumberContext} from '../../../hooks/useTrackingNumberContext';

export const useRangeMethodConfig = (label: string) => {
    const {preAssignedNumberConfigs} = useTrackingNumberContext();

    const labelOptions = useMemo(
        () =>
            preAssignedNumberConfigs.map((i, index) => ({
                label: i.label,
                value: String(index),
            })),

        [preAssignedNumberConfigs]
    );

    const trackingNumberRegex = useMemo(
        // 如果 tracking_number_regex 字段为空字符串，则匹配所有字符
        () => preAssignedNumberConfigs[Number(label)]?.tracking_number_regex || '[\\s\\S]*',
        [label, preAssignedNumberConfigs]
    );

    return {
        labelOptions,
        trackingNumberRegex,
    };
};
