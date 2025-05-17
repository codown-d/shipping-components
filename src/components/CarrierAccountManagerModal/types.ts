export interface CarrierAccountManagerProps {
    // 外部调用组件时传入
    open: boolean;
    onClose: VoidFunction;
    onClickAddNewAccount: VoidFunction;
    productName: string;
    onSave?: VoidFunction;
    currentPlanName?: string;
    maxAccountNumber?: number;
    onUpgrade?: VoidFunction | null; // 到达 maxAccountNumber 上限时会给予入口供调用 onUpgrade
}

export interface CarrierAccountManagerModalProps extends CarrierAccountManagerProps {
    //  内部 container 传入
    data: CarrierAccountItem[];
    avaiableAccountNumber?: number;
    onAction?: (ids: string[]) => void;
    isShowErrorMessage?: boolean;
}

export interface CarrierAccountItem {
    id: string;
    label: string;
    name: string;
    slug: string;
    enabled: boolean;
    originSlugName: string;
}
