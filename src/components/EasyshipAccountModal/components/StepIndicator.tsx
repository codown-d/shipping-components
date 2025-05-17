import React from 'react';
import { TextStyle } from '@shopify/polaris';
import classNames from 'classnames';

import { EasyshipAccountStep } from '../types';

import styles from './StepIndicator.module.scss';

interface StepIndicatorProps {
  currentStep: EasyshipAccountStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { key: EasyshipAccountStep.CONTACT_INFO, label: 'Contact info' },
    { key: EasyshipAccountStep.BILLING_ADDRESS, label: 'Billing address' },
    { key: EasyshipAccountStep.PAYMENT_INFO, label: 'Payment info' },
    { key: EasyshipAccountStep.AUTO_RECHARGE, label: 'Auto-recharge' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isCompleted = currentStep > step.key;

          return (
            <React.Fragment key={step.key}>
              <div className={styles.stepItem}>
                <div
                  className={classNames(
                    styles.stepCircle,
                    isActive || isCompleted ? styles.active : styles.inactive
                  )}
                >
                  <TextStyle variation={isActive ? "strong" : "subdued"}>
                    {index + 1}
                  </TextStyle>
                </div>
                <div
                  className={classNames(
                    styles.stepLabel,
                    isActive ? styles.active : styles.inactive
                  )}
                >
                  <TextStyle variation={isActive ? "strong" : "subdued"}>
                    {step.label}
                  </TextStyle>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={styles.connector} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
