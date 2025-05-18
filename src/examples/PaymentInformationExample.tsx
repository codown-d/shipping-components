import React, { useState } from 'react';
import { Page, Layout, Frame, Toast } from '@shopify/polaris';

import PaymentInformation, { PaymentInformationData } from '../components/PaymentInformation';

const PaymentInformationExample: React.FC = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInformationData & { currentBalance: number }>({
    currentBalance: 15.00,
    cardNumber: '1111 xxxx xxxx 4444',
    balanceThreshold: 10.00,
    rechargeAmount: 185.00,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (data: PaymentInformationData) => {
    setPaymentInfo(prev => ({
      ...prev,
      ...data,
    }));
    setToastMessage('Payment information updated');
    setShowToast(true);
  };

  const handleRequestRefund = () => {
    setToastMessage('Refund request submitted');
    setShowToast(true);
  };

  const toggleToast = () => setShowToast(false);

  return (
    <Frame>
      <Page title="Payment Information Example">
        <Layout>
          <Layout.Section>
            <PaymentInformation
              currentBalance={paymentInfo.currentBalance}
              cardNumber={paymentInfo.cardNumber}
              balanceThreshold={paymentInfo.balanceThreshold}
              rechargeAmount={paymentInfo.rechargeAmount}
              onSave={handleSave}
              onRequestRefund={handleRequestRefund}
            />
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast content={toastMessage} onDismiss={toggleToast} />
        )}
      </Page>
    </Frame>
  );
};

export default PaymentInformationExample;
