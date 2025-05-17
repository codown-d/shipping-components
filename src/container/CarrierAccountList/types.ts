import {Dispatch, SetStateAction} from 'react';

export interface IModalProps {
    open: boolean;
    slug?: string;
    accountId?: string;
    onClose: VoidFunction;
    onSave?: VoidFunction;
    setToast: Dispatch<SetStateAction<string>>;
    onBack?: VoidFunction;
    editable?: boolean;
    isBeforeUpgrade?: boolean;
    isAfterUpgrade?: boolean;
}
