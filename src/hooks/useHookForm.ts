import {useForm} from 'react-hook-form';
import {useDeepCompareEffect} from 'react-use';

export const useHookForm: typeof useForm = options => {
    const methods = useForm(options);

    // if default values is from async flow
    // we should reinitialize it with reset
    useDeepCompareEffect(() => {
        if (options?.defaultValues) {
            // TODO: fix this type error later
            methods?.reset(options?.defaultValues as any);
        }
    }, [options?.defaultValues]);

    return methods;
};
