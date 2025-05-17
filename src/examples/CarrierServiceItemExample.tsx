import React, { useState } from 'react';
import { Page, Layout, Card } from '@shopify/polaris';

import CarrierServiceItem from '../components/CarrierServiceItem';

const CarrierServiceItemExample: React.FC = () => {
  // 模拟数据
  const [services, setServices] = useState([
    { id: 'dhl-1', name: 'DHL Break Bulk Express', enabled: true },
    { id: 'dhl-2', name: 'DHL Express Domestic', enabled: true },
    { id: 'dhl-3', name: 'DHL Express Domestic 0900', enabled: true },
    { id: 'dhl-4', name: 'DHL Express 0900', enabled: true },
    { id: 'dhl-5', name: 'DHL Globalmail Business', enabled: true },
    { id: 'dhl-6', name: 'DHL Medical Express', enabled: false },
    { id: 'dhl-7', name: 'DHL Express Easy', enabled: false },
  ]);

  const [labelDisplayOptions, setLabelDisplayOptions] = useState([
    { id: 'shipping-label', name: 'Shipping label', enabled: false },
    { id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
  ]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  const handleCarrierToggle = () => {
    const allEnabled = services.every(service => service.enabled);
    setServices(services.map(service => ({
      ...service,
      enabled: !allEnabled,
    })));
  };

  const handleServiceToggle = (serviceIndex: number) => {
    const newServices = [...services];
    newServices[serviceIndex].enabled = !newServices[serviceIndex].enabled;
    setServices(newServices);
  };

  const handleLabelOptionToggle = (optionIndex: number) => {
    const newOptions = [...labelDisplayOptions];
    newOptions[optionIndex].enabled = !newOptions[optionIndex].enabled;
    setLabelDisplayOptions(newOptions);
  };

  return (
    <Page title="Carrier Service Item Example">
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <CarrierServiceItem
                slug="dhl"
                name="DHL Express"
                services={services}
                servicesCount={services.filter(service => service.enabled).length}
                labelDisplayOptions={labelDisplayOptions}
                isExpanded={isExpanded}
                isEditing={isEditing}
                onToggle={() => setIsExpanded(!isExpanded)}
                onCarrierToggle={handleCarrierToggle}
                onServiceToggle={handleServiceToggle}
                onLabelOptionToggle={handleLabelOptionToggle}
              />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CarrierServiceItemExample;
