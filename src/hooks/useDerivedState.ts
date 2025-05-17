import {Dispatch, SetStateAction, useEffect, useState} from 'react';

const useDerivedState = <T>(newState: T): [T, Dispatch<SetStateAction<T>>] => {
    const [state, setState] = useState<T>(newState);

    useEffect(() => {
        setState(newState);
    }, [newState]);

    return [state, setState];
};

export default useDerivedState;
