import { useState, useCallback } from 'react';
import { EasyshipAccountStep, EasyshipAccountFormData } from '../types';

interface UseEasyshipAccountModalProps {
  onClose: () => void;
  onSubmit?: (data: EasyshipAccountFormData) => void;
}

export const useEasyshipAccountModal = ({ onClose, onSubmit }: UseEasyshipAccountModalProps) => {
  const [currentStep, setCurrentStep] = useState<EasyshipAccountStep>(EasyshipAccountStep.CONTACT_INFO);
  const [formData, setFormData] = useState<Partial<EasyshipAccountFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理表单提交
  const handleSubmit = useCallback((data: EasyshipAccountFormData) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    
    // 如果是最后一步，则调用onSubmit
    if (currentStep === EasyshipAccountStep.AUTO_RECHARGE) {
      if (onSubmit) {
        setIsSubmitting(true);
        // 这里可以添加API调用
        onSubmit({ ...formData, ...data } as EasyshipAccountFormData);
        setIsSubmitting(false);
      }
      onClose();
    } else {
      // 否则进入下一步
      setCurrentStep(prevStep => prevStep + 1);
    }
  }, [currentStep, formData, onSubmit, onClose]);

  // 处理返回上一步
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);

  // 处理取消
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    currentStep,
    formData,
    isSubmitting,
    handleSubmit,
    handleBack,
    handleCancel,
  };
};

export default useEasyshipAccountModal;
