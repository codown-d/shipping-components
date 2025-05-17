import {useContext} from 'react';

import {TrackingNumberContext} from '../provider/TrackingNumberProvider';

export const useTrackingNumberContext = () => {
    const context = useContext(TrackingNumberContext);

    return context;
};
