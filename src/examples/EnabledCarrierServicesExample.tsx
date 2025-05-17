import React, { useState } from 'react';
import { Page, Layout, Frame, Toast } from '@shopify/polaris';

import EnabledCarrierServices, {
  EnabledCarrierServicesData,
  Carrier,
  LabelDisplayOption
} from '../components/EnabledCarrierServices';

const EnabledCarrierServicesExample: React.FC = () => {
  // 模拟数据
  let labelDisplayOptionsEmu=[
    { id: 'shipping-label', name: 'Shipping label', enabled: false },
    { id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
    { id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
  ]
  const [carriers, setCarriers] = useState<Carrier[]>([
    {
      slug: 'ups',
      name: 'UPS',
      services: [
        { id: 'ups-1', name: 'UPS Break Bulk Express', enabled: true },
        { id: 'ups-2', name: 'UPS Express Domestic', enabled: true },
        { id: 'ups-3', name: 'UPS Express Domestic 0900', enabled: true },
        { id: 'ups-4', name: 'UPS Express 0900', enabled: true },
        { id: 'ups-5', name: 'UPS Globalmail Business', enabled: true },
        { id: 'ups-6', name: 'UPS Medical Express', enabled: false },
        { id: 'ups-7', name: 'UPS Express Easy', enabled: false },
      ],
	  labelDisplayOptions:[
		{ id: 'shipping-label', name: 'Shipping label', enabled: false },
		{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
		{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
	  ]
    },
    {
      slug: 'dhl',
      name: 'DHL Express',
      services: [
        { id: 'dhl-1', name: 'DHL Break Bulk Express', enabled: true },
        { id: 'dhl-2', name: 'DHL Express Domestic', enabled: true },
        { id: 'dhl-3', name: 'DHL Express Domestic 0900', enabled: true },
        { id: 'dhl-4', name: 'DHL Express 0900', enabled: true },
        { id: 'dhl-5', name: 'DHL Globalmail Business', enabled: true },
        { id: 'dhl-6', name: 'DHL Medical Express', enabled: false },
        { id: 'dhl-7', name: 'DHL Express Easy', enabled: false },
      ],
	  labelDisplayOptions:[
		{ id: 'shipping-label', name: 'Shipping label', enabled: false },
		{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
		{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
	  ]
    },
    {
      slug: 'fedex',
      name: 'FedEx',
      services: [
        { id: 'fedex-1', name: 'FedEx Express', enabled: true },
        { id: 'fedex-2', name: 'FedEx Ground', enabled: true },
        { id: 'fedex-3', name: 'FedEx Home Delivery', enabled: false },
        { id: 'fedex-4', name: 'FedEx SmartPost', enabled: false },
      ],
	  labelDisplayOptions:[
		{ id: 'shipping-label', name: 'Shipping label', enabled: false },
		{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
		{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
	  ]
    },
    {
      slug: 'sf-express',
      name: 'S.F Express',
      services: [
        { id: 'sf-1', name: 'S.F Express Standard', enabled: true },
        { id: 'sf-2', name: 'S.F Express Economy', enabled: true },
        { id: 'sf-3', name: 'S.F Express Premium', enabled: false },
      ],
	  labelDisplayOptions:[
		{ id: 'shipping-label', name: 'Shipping label', enabled: false },
		{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
		{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
	  ]
    }
  ]);

  const [labelDisplayOptions, setLabelDisplayOptions] = useState<LabelDisplayOption[]>(labelDisplayOptionsEmu);

  const [showToast, setShowToast] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regionOptions = [
    { label: 'All regions', value: 'all' },
    { label: 'North America', value: 'na' },
    { label: 'Europe', value: 'eu' },
    { label: 'Asia', value: 'asia' },
  ];

  const handleSave = (data: EnabledCarrierServicesData) => {
    setCarriers(data.carriers);
    setLabelDisplayOptions(data.labelDisplayOptions);
    setShowToast(true);
  };

  const toggleToast = () => setShowToast(false);

  return (
    <Frame>
      <Page title="Enabled Carrier Services Example">
        <Layout>
          <Layout.Section>
            <EnabledCarrierServices
              carriers={carriers}
              labelDisplayOptions={labelDisplayOptions}
              onSave={handleSave}
              regionOptions={regionOptions}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
            />
          </Layout.Section>
        </Layout>
        {showToast && (
          <Toast content="Carrier services updated" onDismiss={toggleToast} />
        )}
      </Page>
    </Frame>
  );
};

export default EnabledCarrierServicesExample;
