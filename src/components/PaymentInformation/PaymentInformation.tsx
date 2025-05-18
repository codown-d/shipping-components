import React, { useState } from 'react';
import {
	Card,
	Stack,
	TextStyle,
	Button,
	TextField,
	Select,
	Icon,
	FormLayout,
} from '@shopify/polaris';
import {
	CreditCardMajor,
} from '@shopify/polaris-icons';

import Divider from '@/components/Divider';

import styles from './PaymentInformation.module.scss';
import { currencyFormatUSDInstance } from '@/utils/intl';

export interface PaymentInformationProps {
	currentBalance: number;
	cardNumber?: string;
	balanceThreshold?: number;
	rechargeAmount?: number;
	onSave: (data: PaymentInformationData) => void;
	onRequestRefund?: () => void;
}

export interface PaymentInformationData {
	cardNumber?: string;
	cardExpiryDate?: string;
	cardSecurityCode?: string;
	country?: string;
	balanceThreshold: number;
	rechargeAmount: number;
}

const PaymentInformation: React.FC<PaymentInformationProps> = ({
	currentBalance,
	cardNumber = '',
	balanceThreshold: initialBalanceThreshold = 10,
	rechargeAmount: initialRechargeAmount = 20,
	onSave,
	onRequestRefund,
}) => {
	// 状态管理
	const [newCardNumber, setNewCardNumber] = useState('');
	const [cardExpiryDate, setCardExpiryDate] = useState('');
	const [cardSecurityCode, setCardSecurityCode] = useState('');
	const [country, setCountry] = useState('');
	const [balanceThreshold, setBalanceThreshold] = useState(initialBalanceThreshold);
	const [rechargeAmount, setRechargeAmount] = useState(initialRechargeAmount);

	// 国家/地区选项
	const countryOptions = [
		{ label: 'China', value: 'China' },
		{ label: 'United States', value: 'United States' },
		{ label: 'Canada', value: 'Canada' },
		{ label: 'Japan', value: 'Japan' },
		{ label: 'Australia', value: 'Australia' },
	];

	// 处理保存按钮点击
	const handleSaveClick = () => {
		onSave({
			cardNumber: newCardNumber,
			cardExpiryDate: cardExpiryDate,
			cardSecurityCode: cardSecurityCode,
			country: country,
			balanceThreshold,
			rechargeAmount,
		});
	};

	// 展示状态下的内容
	const renderViewMode = () => {
		return (
			<>
				<Card.Section>
					<div className={styles.header}>
						<div className={styles.title}>Payment information</div>
					</div>
				</Card.Section>
				<Card.Section>
					<div className={styles.balanceRow}>
						<div className={styles.balanceColumn}>
							<TextStyle>Current balance:</TextStyle>
							<TextStyle variation="strong"><span className={styles.balanceValue}>{currencyFormatUSDInstance.format(currentBalance)} USD</span></TextStyle>
						</div>
						<div className={styles.balanceAmount}>
							<Stack alignment="center" distribution="trailing">
								<Button onClick={onRequestRefund}>Request a Refund</Button>
							</Stack>
						</div>
					</div>
					<Divider />
					{renderCardMode()}
					{renderEditAutoRechargeMode()}
				</Card.Section>
			</>
		);
	};

	// 编辑信用卡状态下的内容
	const renderCardMode = () => {
		const [isEdit, setEdit] = useState(false);

		if (isEdit) {
			return (
				<>
					<div style={{ marginTop: '16px' }}>
						<div className={styles.sectionTitle} >Credit card</div>
						<div className={styles.formContainer}>
							<FormLayout>
								<TextField
									label=""labelHidden={true}
									value={newCardNumber}
									placeholder='Card number'
									onChange={setNewCardNumber}
									autoComplete="cc-number"
								/>
								<FormLayout.Group>
									<TextField	label=""labelHidden={true}
										value={cardExpiryDate}
										placeholder='Expiration date (MM / YY)'
										onChange={setCardExpiryDate}
										autoComplete="cc-exp"
									/>
									<TextField	label=""labelHidden={true}
										value={cardSecurityCode}
										placeholder='Security code'
										onChange={setCardSecurityCode}
										autoComplete="cc-csc"
										type="password"
									/>
								</FormLayout.Group>
								<Select	label=""labelHidden={true}
									placeholder='Country'
									options={countryOptions}
									value={country}
									onChange={setCountry}
								/>
							</FormLayout>
							<div className={styles.poweredByStripe}>
								Powered by <span className={styles.stripeBold}>stripe</span>
							</div>
						</div>
					</div>
					<div className={styles.cardFooter}>
						<div className={styles.footerButtons}>
							<Button onClick={() => setEdit(false)}>Cancel</Button>
							<Button primary onClick={handleSaveClick}>
								Save
							</Button>
						</div>
					</div>
					<div className={styles.margin16}>
						<Divider />
					</div>
				</>
			);
		}

		return (
			<>
				<div className={styles.paymentMethodRow}>
					<TextStyle>Payment Methods</TextStyle>
				</div>
				<div className={styles.paymentMethodCard}>
					<Stack alignment="center" spacing="tight">
						<Icon source={CreditCardMajor} color="base" />
						<TextStyle>{cardNumber || 'No payment method added'}</TextStyle>
					</Stack>
					<Button plain onClick={() => setEdit(true)}>
						Edit
					</Button>
				</div>
			</>
		);
	};

	// 编辑自动充值状态下的内容
	const renderEditAutoRechargeMode = () => {
		const [isEdit, setEdit] = useState(false);

		if (isEdit) {
			return (
				<>
					<div>
						<div className={styles.sectionTitle}>Auto-recharge</div>
						<div className={styles.formContainer}>
							<FormLayout>
								<FormLayout.Group>
									<div>
										<TextField
											label="Balance threshold"
											prefix="$"
											value={balanceThreshold?.toString() || '0'}
											onChange={(value) => setBalanceThreshold(Number(value) || 0)}
											autoComplete="off"
										/>
									</div>
									<div>
										<TextField
											label="Recharge amount"
											prefix="$"
											value={rechargeAmount?.toString() || '0'}
											onChange={(value) => setRechargeAmount(Number(value) || 0)}
											autoComplete="off"

										/>
									</div>
								</FormLayout.Group>
							</FormLayout>
							<div className={styles.autoRechargeDescription}>
								Your account will be auto-recharged when the balance drops below the balance threshold. An initial charge will occur when you generate the first label.
							</div>
						</div>
					</div>
					<div className={styles.cardFooter}>
						<div className={styles.footerButtons}>
							<Button onClick={() => setEdit(false)}>Cancel</Button>
							<Button primary onClick={handleSaveClick}>
								Save
							</Button>
						</div>
					</div>
				</>
			);
		}

		return (
			<>
				<div className={styles.autoRechargeRow}>
					<TextStyle>Automatic recharge</TextStyle>
				</div>
				<div className={styles.autoRechargeCard}>
					<div className={styles.autoRechargeInfo}>
						<TextStyle>Balance threshold: {currencyFormatUSDInstance.format(balanceThreshold || 0)}</TextStyle>
						<TextStyle>Recharge amount: {currencyFormatUSDInstance.format(rechargeAmount || 0)}</TextStyle>
					</div>
					<Button plain onClick={() => setEdit(true)}>
						Edit
					</Button>
				</div>
			</>
		);
	};

	return (
		<div style={{ background: "#FFFFFF" }}>
		<Card>
			{renderViewMode()}
		</Card>
		</div>
	);
};

export default PaymentInformation;
