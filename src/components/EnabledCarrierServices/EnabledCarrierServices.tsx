import React, { useState } from 'react';
import {
	Card,
	Button,
	Select,
} from '@shopify/polaris';

import CarrierServicesList from '../CarrierServicesList';
import styles from './EnabledCarrierServices.module.scss';

// 快递公司类型
export interface Carrier {
	slug: string;
	name: string;
	services: CarrierService[];
}

// 快递服务类型
export interface CarrierService {
	id: string;
	name: string;
	enabled: boolean;
}

// 标签显示选项类型
export interface LabelDisplayOption {
	id: string;
	name: string;
	enabled: boolean;
	supportedCountries?: string[];
}

export interface EnabledCarrierServicesProps {
	carriers: Carrier[];
	labelDisplayOptions: LabelDisplayOption[];
	onSave: (data: EnabledCarrierServicesData) => void;
	regionOptions?: { label: string; value: string }[];
	selectedRegion?: string;
	onRegionChange?: (value: string) => void;
}

export interface EnabledCarrierServicesData {
	carriers: Carrier[];
	labelDisplayOptions: LabelDisplayOption[];
}

const EnabledCarrierServices: React.FC<EnabledCarrierServicesProps> = ({
	carriers: initialCarriers,
	labelDisplayOptions: initialLabelDisplayOptions,
	onSave,
	regionOptions,
	selectedRegion,
	onRegionChange,
}) => {
	// 状态管理
	const [isEditing, setIsEditing] = useState(false);
	const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);
	const [labelDisplayOptions, setLabelDisplayOptions] = useState<LabelDisplayOption[]>(
		initialLabelDisplayOptions
	);

	// 处理编辑按钮点击
	const handleEditClick = () => {
		setIsEditing(true);
	};

	// 处理取消按钮点击
	const handleCancelClick = () => {
		// 重置为初始值
		setCarriers(initialCarriers);
		setLabelDisplayOptions(initialLabelDisplayOptions);
		setIsEditing(false);
	};

	// 处理保存按钮点击
	const handleSaveClick = () => {
		onSave({
			carriers,
			labelDisplayOptions,
		});
		setIsEditing(false);
	};

	// 处理快递公司选择
	const handleCarrierToggle = (carrierIndex: number) => {
		const newCarriers = [...carriers];
		const carrier = newCarriers[carrierIndex];

		// 如果所有服务都启用，则禁用所有服务；否则启用所有服务
		const allEnabled = carrier.services.every(service => service.enabled);
		carrier.services = carrier.services.map(service => ({
			...service,
			enabled: !allEnabled,
		}));

		setCarriers(newCarriers);
	};

	// 处理服务选择
	const handleServiceToggle = (carrierIndex: number, serviceIndex: number) => {
		const newCarriers = [...carriers];
		newCarriers[carrierIndex].services[serviceIndex].enabled =
			!newCarriers[carrierIndex].services[serviceIndex].enabled;
		setCarriers(newCarriers);
	};

	// 处理标签显示选项选择
	const handleLabelOptionToggle = (optionIndex: number) => {
		const newOptions = [...labelDisplayOptions];
		newOptions[optionIndex].enabled = !newOptions[optionIndex].enabled;
		setLabelDisplayOptions(newOptions);
	};

	// 展示状态下的内容
	const renderViewMode = () => {
		return (
			<>
				<Card.Section>
					<div className={styles.header}>
						<div className={styles.title}>Enabled carrier:</div>
						<Button plain onClick={handleEditClick}>
							Manage
						</Button>
					</div>
				</Card.Section>

				<Card.Section>
					<CarrierServicesList
						carriers={carriers.filter(carrier => carrier.services.some(service => service.enabled))}
						labelDisplayOptions={labelDisplayOptions}
						onCarrierToggle={handleCarrierToggle}
						onServiceToggle={handleServiceToggle}
						onLabelOptionToggle={handleLabelOptionToggle}
						isEditing={false}
					/>
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
						<div className={styles.title}>Enabled carrier:</div>
					</div>
				</Card.Section>

				{regionOptions && onRegionChange && (
					<Card.Section>
						<div className={styles.regionSelector}>
							<div className={styles.regionLabel}>Select a region</div>
							<div className={styles.regionSelect}>
								<Select
									label=""
									labelHidden
									options={regionOptions}
									value={selectedRegion}
									onChange={onRegionChange}
								/>
							</div>
						</div>
					</Card.Section>
				)}

				<Card.Section>
					<CarrierServicesList
						carriers={carriers}
						labelDisplayOptions={labelDisplayOptions}
						onCarrierToggle={handleCarrierToggle}
						onServiceToggle={handleServiceToggle}
						onLabelOptionToggle={handleLabelOptionToggle}
						isEditing={true}
					/>
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

	return <Card>{isEditing ? renderEditMode() : renderViewMode()}</Card>;
};

export default EnabledCarrierServices;
