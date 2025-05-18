import React, { useState } from 'react';
import {
	Card,
	Stack,
	TextStyle,
	Button,
	TextField,
	Select,
	Icon,
} from '@shopify/polaris';
import {
	CustomersMajor,
	EmailMajor,
	StoreMajor,
	LocationMajor,
} from '@shopify/polaris-icons';

import styles from './AccountInformation.module.scss';

export interface AccountInformationProps {
	firstName: string;
	lastName: string;
	email: string;
	companyName?: string;
	country: string;
	onSave: (data: AccountInformationData) => void;
}

export interface AccountInformationData {
	firstName: string;
	lastName: string;
	email: string;
	companyName?: string;
	country: string;
}

const AccountInformation: React.FC<AccountInformationProps> = ({
	firstName: initialFirstName,
	lastName: initialLastName,
	email: initialEmail,
	companyName: initialCompanyName = '',
	country: initialCountry,
	onSave,
}) => {
	// 状态管理
	const [isEditing, setIsEditing] = useState(false);
	const [firstName, setFirstName] = useState(initialFirstName);
	const [lastName, setLastName] = useState(initialLastName);
	const [email, setEmail] = useState(initialEmail);
	const [companyName, setCompanyName] = useState(initialCompanyName);
	const [country, setCountry] = useState(initialCountry);

	// 国家/地区选项
	const countryOptions = [
		{ label: 'China', value: 'China' },
		{ label: 'United States', value: 'United States' },
		{ label: 'Canada', value: 'Canada' },
		{ label: 'Japan', value: 'Japan' },
		{ label: 'Australia', value: 'Australia' },
		// 可以根据需要添加更多国家
	];

	// 处理编辑按钮点击
	const handleEditClick = () => {
		setIsEditing(true);
	};

	// 处理取消按钮点击
	const handleCancelClick = () => {
		// 重置为初始值
		setFirstName(initialFirstName);
		setLastName(initialLastName);
		setEmail(initialEmail);
		setCompanyName(initialCompanyName);
		setCountry(initialCountry);
		setIsEditing(false);
	};

	// 处理保存按钮点击
	const handleSaveClick = () => {
		onSave({
			firstName,
			lastName,
			email,
			companyName,
			country,
		});
		setIsEditing(false);
	};

	// 展示状态下的内容
	const renderViewMode = () => {
		return (
			<>
				<Card.Section>
					<div className={styles.header}>
						<div className={styles.title}>Account Information</div>
						<Button plain onClick={handleEditClick}>
							Edit
						</Button>
					</div>
				</Card.Section>
				<Card.Section>
					<Stack vertical spacing="loose">
						<Stack alignment="center" spacing="tight">
							<Icon source={CustomersMajor} color="base" />
							<TextStyle>{`${firstName} ${lastName}`}</TextStyle>
						</Stack>
						<Stack alignment="center" spacing="tight">
							<Icon source={EmailMajor} color="base" />
							<TextStyle>{email}</TextStyle>
						</Stack>
						{companyName && (
							<Stack alignment="center" spacing="tight">
								<Icon source={StoreMajor} color="base" />
								<TextStyle>{companyName}</TextStyle>
							</Stack>
						)}
						<Stack alignment="center" spacing="tight">
							<Icon source={LocationMajor} color="base" />
							<TextStyle>{country}</TextStyle>
						</Stack>
					</Stack>
				</Card.Section>
			</>
		);
	};

	// 编辑状态下的内容
	const renderEditMode = () => {
		return (
			<>
				<Card.Section>
					<div className={styles.header}>
						<div className={styles.title}>Account Information</div>
						<Button plain disabled>
							Edit
						</Button>
					</div>
				</Card.Section>
				<Card.Section>
					<Stack vertical spacing="loose">
						<Stack distribution="fillEvenly">
							<TextField
								label="First name"
								value={firstName}
								onChange={setFirstName}
								autoComplete="given-name"
							/>
							<TextField
								label="Last name"
								value={lastName}
								onChange={setLastName}
								autoComplete="family-name"
							/>
						</Stack>
						<TextField
							label="Email"
							value={email}
							onChange={setEmail}
							autoComplete="email"
						/>

						<Stack distribution="fillEvenly">
							<TextField
								label={<>Company Name<span className={styles.optionalLabel}>(optional)</span></>}
								value={companyName}
								onChange={setCompanyName}
								autoComplete="organization"
							/>
							<Select
								label="Country/region"
								options={countryOptions}
								value={country}
								onChange={setCountry}
							/>
						</Stack>
					</Stack>
				</Card.Section>
				<div className={styles.cardFooter}>
					<div className={styles.footerButtons}>
						<Button onClick={handleCancelClick}>Cancel</Button>
						<Button primary onClick={handleSaveClick}>
							Save
						</Button>
					</div>
				</div>
			</>
		);
	};

	return <div style={{ background: "#FFFFFF" }}><Card >{isEditing ? renderEditMode() : renderViewMode()}</Card></div>;
};

export default AccountInformation;
