export enum EasyshipAccountStep {
    CONTACT_INFO = 0,
    BILLING_ADDRESS = 1,
    PAYMENT_INFO = 2,
    AUTO_RECHARGE = 3,
}

export interface EasyshipAccountFormData {
    // Contact Info
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
    country: string;
    
    // 其他步骤的字段将在后续实现
    // Billing Address
    // Payment Info
    // Auto-recharge
}

export interface EasyshipAccountModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: EasyshipAccountFormData) => void;
}
