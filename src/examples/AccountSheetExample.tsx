import React, { useState, useCallback } from 'react';
import { Card, Button, Page, Layout } from '@shopify/polaris';
import AccountSheet from '../components/AccountSheet/AccountSheet';

const AccountSheetExample: React.FC = () => {
  const [sheetActive, setSheetActive] = useState(false);

  const handleOpenSheet = useCallback(() => {
    setSheetActive(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetActive(false);
  }, []);

  return (
    <Page title="Account Sheet Example">
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <p>Click the button below to open the account sheet from the bottom of the screen.</p>
              <div style={{ marginTop: '20px' }}>
                <Button primary onClick={handleOpenSheet}>
                  Open Account Sheet
                </Button>
              </div>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>

      <AccountSheet
        open={sheetActive}
        onClose={handleCloseSheet}
      />
    </Page>
  );
};

export default AccountSheetExample;
