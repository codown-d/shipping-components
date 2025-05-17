import {useState, RefObject, Dispatch, SetStateAction} from 'react';
import {FieldError, DeepMap, UseFormMethods} from 'react-hook-form';

import {CourierAccount, METHOD, SuccessMessage} from './typings';

import {useTimeout} from '@/hooks/useTimeout';
import {useAddCarrierAccountMutate, useEditCarrierAccountCommon} from '@/queries/carrierAccounts';

export const useScrollToError = ({
    hasError,
    invalidErrors,
    modalContainer,
}: {
    hasError: boolean;
    invalidErrors: DeepMap<any, FieldError>;
    modalContainer: RefObject<HTMLDivElement>;
}) => {
    // 校验不通过时滚动到错误项
    useTimeout(() => {
        const invalidControl = modalContainer.current?.querySelector(
            '.Polaris-Labelled__Error'
        )?.parentElement;

        invalidControl && (invalidControl as HTMLElement).scrollIntoView();
    }, [invalidErrors]);

    // submit 出错时滚动到提示 banner
    useTimeout(() => {
        if (hasError) {
            const scrollableContainer = modalContainer?.current?.closest('.Polaris-Modal__Body');
            scrollableContainer && (scrollableContainer as HTMLElement).scrollTo(0, 0);
        }
    }, [hasError]);
};

export const useSubmit = ({
    slug,
    version,
    mode,
    onSave,
    onClose,
    setToast,
    modalContainer,
    accountId,
    handleSubmit,
}: {
    slug: string;
    version?: number;
    mode: METHOD;
    onClose: VoidFunction;
    onSave?: VoidFunction;
    setToast: Dispatch<SetStateAction<string>>;
    modalContainer: RefObject<HTMLDivElement>;
    accountId: string;
    handleSubmit: UseFormMethods['handleSubmit'];
}) => {
    const {
        mutate: addCourierMutate,
        error: addCourierError,
        isLoading: isAddCourierLoading,
    } = useAddCarrierAccountMutate();
    const isAddCourierError = Boolean(addCourierError);

    const {
        mutate: updateCourierMutate,
        error: updateCourierError,
        isLoading: isUpdateCourierLoading,
    } = useEditCarrierAccountCommon(accountId);
    const isUpdateCourierError = Boolean(updateCourierError);

    const [invalidErrors, setInvalidErrors] = useState({});

    const validSubmit = (data: CourierAccount) => {
        const payload = {
            ...data,
            slug,
            version,
        };

        if (mode === METHOD.ADD) {
            addCourierMutate(payload, {
                onSuccess: () => {
                    setToast(SuccessMessage.ADD);
                    onSave?.();
                    onClose();
                },
            });
        } else if (mode === METHOD.EDIT) {
            const updatePayload = payload;

            if (['fedex', 'fedex-smartpost'].includes(slug)) {
                if (!payload.credentials.password) {
                    updatePayload.credentials.password = '';
                }
            }

            updateCourierMutate(updatePayload, {
                onSuccess: () => {
                    setToast(SuccessMessage.EDIT);
                    onSave?.();
                    onClose();
                },
            });
        }
    };
    const submit = handleSubmit(validSubmit, setInvalidErrors);

    const isSubmitting = isAddCourierLoading || isUpdateCourierLoading;
    const errorInfo = addCourierError || updateCourierError;

    const hasError = isAddCourierError || isUpdateCourierError;
    useScrollToError({hasError, invalidErrors, modalContainer});

    return {
        submit,
        isSubmitting,
        errorInfo,
    };
};
