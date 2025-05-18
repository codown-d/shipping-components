import React, { useState } from 'react';
import { Page, Layout, Frame, Toast } from '@shopify/polaris';

import BillingCycle from '../components/BillingCycle';

const BillingCycleExample: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDownload = (id: string, type: string) => {
    setToastMessage(`Downloading ${type} with ID: ${id}`);
    setShowToast(true);
  };

  const toggleToast = () => setShowToast(false);

  return (
    <Frame>
      <Page title="Billing Cycle Example">
        <Layout>
          <Layout.Section>
            <BillingCycle onDownload={handleDownload} />
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast content={toastMessage} onDismiss={toggleToast} />
        )}
      </Page>
    </Frame>
  );
};

export default BillingCycleExample;
