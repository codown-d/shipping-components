import {useState, useRef, useMemo} from 'react';

enum CurrentModalName {
    CarrierListModal = 'CarrierListModal',
    AddCarrierModal = 'AddCarrierModal',
    CarrierAccountManagerModal = 'CarrierAccountManagerModal',
}

const useCarrierListModal = () => {
    const onClickHandlerRef = useRef<null | VoidFunction>(null);

    const onCarrierItemSaveRef = useRef<null | VoidFunction>(null);

    const bindClickHandler = (onClick: VoidFunction) => {
        onClickHandlerRef.current = onClick;
    };

    const bindCarrierItemSaveHandler = (onCarrierItemSave: VoidFunction) => {
        onCarrierItemSaveRef.current = onCarrierItemSave;
    };

    return {
        onClickHandler: onClickHandlerRef.current,
        onCarrierItemSaveHandler: onCarrierItemSaveRef.current,
        bindClickHandler,
        bindCarrierItemSaveHandler,
    };
};

const useAddCarrierModal = () => {
    const onSaveHandlerRef = useRef<null | VoidFunction>(null);

    const bindSaveHandler = (onSave: VoidFunction) => {
        onSaveHandlerRef.current = onSave;
    };

    return {onSaveHandler: onSaveHandlerRef.current, bindSaveHandler};
};

const useCarrierAccountManagerModal = () => {
    const onSaveHandlerRef = useRef<null | VoidFunction>(null);

    const onClickAddNewAccountHandlerRef = useRef<null | VoidFunction>(null);

    const bindSaveHandler = (onSave: VoidFunction) => {
        onSaveHandlerRef.current = onSave;
    };

    const bindClickAddNewAccountSaveHandler = (onSave: VoidFunction) => {
        onSaveHandlerRef.current = onSave;
    };

    return {
        onSaveHandler: onSaveHandlerRef.current,
        bindSaveHandler,
        onClickAddNewAccountHandler: onClickAddNewAccountHandlerRef.current,
        bindClickAddNewAccountSaveHandler,
    };
};

export interface IOpenCarrierAccountManagerModals {
    // 所有支持的 carrier 列表
    carrierListModal: {
        isOpen: boolean;
        setOpen: (isOpen: boolean) => void;
        // 选择某个 carrier 时的回调
        onClickHandler: VoidFunction | null;
        bindClickHandler: (handler: VoidFunction) => void;
        // 创建成功 carrier account 的回调 (eg. 业务侧需要调用 onboarding 接口)
        onCarrierItemSaveHandler: VoidFunction | null;
        bindCarrierItemSaveHandler: (handler: VoidFunction) => void;
    };
    // 创建 carrier account
    addCarrierModal: {
        isOpen: boolean;
        setOpen: (isOpen: boolean) => void;
        // 创建成功 carrier account 的回调 (eg. 业务侧需要调用 onboarding 接口)
        onSaveHandler: VoidFunction | null;
        bindSaveHandler: (handler: VoidFunction) => void;
    };
    // org 中已有的但未添加到业务侧的 carrier account
    carrierAccountManagerModal: {
        isOpen: boolean;
        setOpen: (isOpen: boolean) => void;
        // 添加成功 carrier account 的回调 (eg. 业务侧需要调用 onboarding 接口)
        onSaveHandler: VoidFunction | null;
        bindSaveHandler: (handler: VoidFunction) => void;
        onClickAddNewAccountHandler: VoidFunction | null;
        bindClickAddNewAccountSaveHandler: (handler: VoidFunction) => void;
    };
    currentOnAddedSlug: string;
    setCurrentOnAddedSlug: (slug: string) => void;
}

const useOpenCarrierManagerModals = (): IOpenCarrierAccountManagerModals => {
    const [currentOnAddedSlug, setCurrentOnAddedSlug] = useState('');

    const [currentModalName, setCurrentModalName] = useState<CurrentModalName | null>(null);
    const carrierListModalHook = useCarrierListModal();
    const addCarrierModalHook = useAddCarrierModal();
    const carrierAccountManagerModalHook = useCarrierAccountManagerModal();

    return useMemo(
        () => ({
            carrierListModal: {
                isOpen: currentModalName === CurrentModalName.CarrierListModal,
                setOpen: (isOpen: boolean) =>
                    setCurrentModalName(isOpen ? CurrentModalName.CarrierListModal : null),
                ...carrierListModalHook,
            },
            addCarrierModal: {
                isOpen: currentModalName === CurrentModalName.AddCarrierModal,
                setOpen: (isOpen: boolean) =>
                    setCurrentModalName(isOpen ? CurrentModalName.AddCarrierModal : null),
                ...addCarrierModalHook,
            },
            carrierAccountManagerModal: {
                isOpen: currentModalName === CurrentModalName.CarrierAccountManagerModal,
                setOpen: (isOpen: boolean) =>
                    setCurrentModalName(
                        isOpen ? CurrentModalName.CarrierAccountManagerModal : null
                    ),
                ...carrierAccountManagerModalHook,
            },
            currentOnAddedSlug,
            setCurrentOnAddedSlug,
        }),
        [
            addCarrierModalHook,
            carrierAccountManagerModalHook,
            carrierListModalHook,
            currentModalName,
            currentOnAddedSlug,
        ]
    );
};

export default useOpenCarrierManagerModals;
