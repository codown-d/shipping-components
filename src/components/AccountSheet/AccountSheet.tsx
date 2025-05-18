import React, { useState } from 'react';
// 移除未使用的导入
// import { Tabs } from '@shopify/polaris';
import Drawer from '../Drawer';

import styles from './AccountSheet.module.scss';
import AccountInformation, { AccountInformationData } from '../AccountInformation';
import EnabledCarrierServices, { Carrier, EnabledCarrierServicesData, LabelDisplayOption } from '../EnabledCarrierServices';
import PaymentInformation, { PaymentInformationData } from '../PaymentInformation';
import BillingCycle from '../BillingCycle';

export interface AccountSheetProps {
	open: boolean;
	onClose: () => void;
}

export interface CarrierInfo {
	name: string;
	logo: string;
	services: number;
}

export interface PaymentMethod {
	cardNumber: string;
	cardType: string;
}

const AccountSheet: React.FC<AccountSheetProps> = ({
	open,
	onClose
}) => {	let labelDisplayOptionsEmu = [
		{ id: 'shipping-label', name: 'Shipping label', enabled: false },
		{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
		{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
	]
	const tabs = ['information','billing'];
	const [selected, setSelected] = useState('information');

	const [accountInfo, setAccountInfo] = useState<AccountInformationData>({
		firstName: 'Yucca',
		lastName: 'Chen',
		email: 'yucca1009@testemail.com',
		companyName: 'Ship',
		country: 'China',
	});
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
			labelDisplayOptions: [
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
			labelDisplayOptions: [
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
			labelDisplayOptions: [
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
			labelDisplayOptions: [
				{ id: 'shipping-label', name: 'Shipping label', enabled: false },
				{ id: 'qr-code-usa', name: 'QR code', enabled: true, supportedCountries: ['USA'] },
				{ id: 'qr-code-gbr', name: 'QR code', enabled: false, supportedCountries: ['GBR'] },
			]
		}
	]);
	const [paymentInfo, setPaymentInfo] = useState<PaymentInformationData & { currentBalance: number }>({
		currentBalance: 15.00,
		cardNumber: '1111 xxxx xxxx 4444',
		balanceThreshold: 10.00,
		rechargeAmount: 185.00,
	});
	const [labelDisplayOptions, setLabelDisplayOptions] = useState<LabelDisplayOption[]>(labelDisplayOptionsEmu);

	const [selectedRegion, setSelectedRegion] = useState('all');

	const regionOptions = [
		{ label: 'All regions', value: 'all' },
		{ label: 'North America', value: 'na' },
		{ label: 'Europe', value: 'eu' },
		{ label: 'Asia', value: 'asia' },
	];
	const handleSave = (data: AccountInformationData) => {
		setAccountInfo(data);
	};
	const handleCarrierSave = (data: EnabledCarrierServicesData) => {
		setCarriers(data.carriers);
		setLabelDisplayOptions(data.labelDisplayOptions);
	};
	const handlePaymentSave = (data: PaymentInformationData) => {
		setPaymentInfo(prev => ({
			...prev,
			...data,
		}));
	};
	const handleRequestRefund = () => {
	};

	return (
		<Drawer
			open={open}
			onClose={onClose}
			title="Edit Easyship account"
			position="bottom"
		>
			<div style={{ background: '#F6F6F7',display:'flex', justifyContent: 'center', minHeight:'calc(100vh - 200px )',paddingBottom:'60px' }}>
					<div style={{width:'728px'}}>
					<div className={styles.customTabs}>
						{tabs.map(item=>{
							return (
								<div
									key={item}
									className={	`${styles.tabItem} ${selected === item ? styles.tabItemactive : ''}`}
									onClick={() =>setSelected(item)}
								>{item}
								</div>
							);
						})}
					</div>
					<div className={styles.drawerContent}>
						{selected === 'information' ? (
							<div className={styles.informationTab}>
								<>
									<AccountInformation
										firstName={accountInfo.firstName}
										lastName={accountInfo.lastName}
										email={accountInfo.email}
										companyName={accountInfo.companyName}
										country={accountInfo.country}
										onSave={handleSave}
									/>
									<EnabledCarrierServices
										carriers={carriers}
										labelDisplayOptions={labelDisplayOptions}
										onSave={handleCarrierSave}
										regionOptions={regionOptions}
										selectedRegion={selectedRegion}
										onRegionChange={setSelectedRegion}
									/>
									<PaymentInformation
										currentBalance={paymentInfo.currentBalance}
										cardNumber={paymentInfo.cardNumber}
										balanceThreshold={paymentInfo.balanceThreshold}
										rechargeAmount={paymentInfo.rechargeAmount}
										onSave={handlePaymentSave}
										onRequestRefund={handleRequestRefund}
									/>
								</>
							</div>
						) : (
							<div className={styles.billingTab}>
								<BillingCycle />
							</div>
						)}
					</div></div>
			</div>

		</Drawer>
	);
};

export default AccountSheet;
