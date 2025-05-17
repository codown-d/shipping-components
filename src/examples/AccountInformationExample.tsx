import React, { useState } from 'react';
import { Page, Layout, Frame, Toast } from '@shopify/polaris';

import AccountInformation, { AccountInformationData } from '../components/AccountInformation';

const AccountInformationExample: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInformationData>({
    firstName: 'Yucca',
    lastName: 'Chen',
    email: 'yucca1009@testemail.com',
    companyName: 'Ship',
    country: 'China',
  });

  const [showToast, setShowToast] = useState(false);

  const handleSave = (data: AccountInformationData) => {
    setAccountInfo(data);
    setShowToast(true);
  };

  const toggleToast = () => setShowToast(false);

  return (
    <Frame>
      <Page title="Account Information Example">
        <Layout>
          <Layout.Section>
            <AccountInformation
              firstName={accountInfo.firstName}
              lastName={accountInfo.lastName}
              email={accountInfo.email}
              companyName={accountInfo.companyName}
              country={accountInfo.country}
              onSave={handleSave}
            />
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast content="Account information updated" onDismiss={toggleToast} />
        )}
      </Page>
    </Frame>
  );
};

export default AccountInformationExample;
