import React from 'react';
import { Modal, Button, TextStyle, ButtonGroup } from '@shopify/polaris';

import { EasyshipAccountModalProps, EasyshipAccountStep, EasyshipAccountFormData } from './types';
import useEasyshipAccountModal from './hooks/useEasyshipAccountModal';
import StepIndicator from './components/StepIndicator';
import ContactInfoForm from './components/ContactInfoForm';

import EasyshipLogo from './assets/easyship-logo.svg';
import styles from './EasyshipAccountModal.module.scss';

const EasyshipAccountModal: React.FC<EasyshipAccountModalProps> = ({ open, onClose, onSubmit }) => {
  const {
    currentStep,
    formData,
    isSubmitting,
    handleSubmit,
    handleBack,
    handleCancel,
  } = useEasyshipAccountModal({ onClose, onSubmit });

  // 根据当前步骤渲染不同的表单内容
  const renderStepContent = () => {
    switch (currentStep) {
      case EasyshipAccountStep.CONTACT_INFO:
        return (
          <ContactInfoForm
            defaultValues={formData}
            onSubmit={handleSubmit as (data: EasyshipAccountFormData) => void}
          />
        );
      // 其他步骤将在后续实现
      default:
        return null;
    }
  };

  // 根据当前步骤确定按钮文本
  const getPrimaryButtonText = () => {
    if (currentStep === EasyshipAccountStep.AUTO_RECHARGE) {
      return 'Submit';
    }
    return 'Continue';
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Activate Easyship account"
    >
      <div className={styles.container}>
        <StepIndicator currentStep={currentStep} />

        <div className={styles.divider} />

        <div className={styles.content}>
          {renderStepContent()}
        </div>

        <div className={styles.footer}>
          <div className={styles.poweredBy}>
            <TextStyle variation="subdued">Powered by</TextStyle>
            <img src={EasyshipLogo} alt="Easyship" className={styles.logo} />
          </div>

          <ButtonGroup>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              primary
              onClick={() => {
                // 触发表单提交
                if (currentStep === EasyshipAccountStep.CONTACT_INFO) {
                  document.querySelector('form')?.dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                  );
                }
              }}
              loading={isSubmitting}
            >
              {getPrimaryButtonText()}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Modal>
  );
};

export default EasyshipAccountModal;
