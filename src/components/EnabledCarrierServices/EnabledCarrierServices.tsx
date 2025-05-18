import React, { useState } from 'react';
import {
	Card,
	Button,
	Select,
	Checkbox,
	// 移除未使用的导入
	// TextStyle,
} from '@shopify/polaris';

import CarrierServicesList from '../CarrierServicesList';
import SlugIcon from '../SlugIcon';
import styles from './EnabledCarrierServices.module.scss';

// 快递公司类型
export interface Carrier {
	slug: string;
	name: string;
	services: CarrierService[];
	labelDisplayOptions: LabelDisplayOption[];
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
	// 移除未使用的状态
	// const [expandedCarriers, setExpandedCarriers] = useState<Record<string, boolean>>({});

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
		console.log(newCarriers)
		setCarriers(newCarriers);
	};

	// 处理标签显示选项选择
	const handleLabelOptionToggle = (carrierIndex: number, serviceIndex: number) => {

		console.log(carrierIndex, serviceIndex)
		const newCarriers = [...carriers];
		newCarriers[carrierIndex].labelDisplayOptions[serviceIndex].enabled =
			!newCarriers[carrierIndex].labelDisplayOptions[serviceIndex].enabled;
		console.log(newCarriers)
		setCarriers(newCarriers);
	};

	// 移除未使用的函数和变量
	// 处理快递公司展开/折叠
	// const toggleCarrierExpand = (slug: string) => {
	// 	setExpandedCarriers(prev => ({
	// 		...prev,
	// 		[slug]: !prev[slug],
	// 	}));
	// };

	// 计算已启用的快递公司数量
	// const enabledCarriersCount = carriers.filter(carrier =>
	// 	carrier.services.some(service => service.enabled)
	// ).length;

	// 展示状态下的内容
	const renderViewMode = () => {
		// 获取已启用的快递公司
		const enabledCarriers = carriers.filter(carrier => carrier.services.some(service => service.enabled));

		// 移除未使用的变量
		// 获取已启用的标签选项
		// const enabledLabelOptions = carriers.filter(carrier => carrier.labelDisplayOptions.some(labelDisplayOption => labelDisplayOption.enabled));

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

				{/* 显示已启用的快递公司 */}
				{enabledCarriers.map(carrier => {
					const enabledServicesCount = carrier.services.filter(service => service.enabled).length;
					const labelDisplayOptionsCount = carrier.labelDisplayOptions.filter(labelDisplayOption => labelDisplayOption.enabled);
					return (
						<Card.Section key={carrier.slug}>
							<div className={styles.carrierRow}>
								<div className={styles.carrierInfo}>
									<div className={styles.carrierIcon}>
										<SlugIcon name={carrier.slug} size="40px" />
									</div>
									<div className={styles.carrierDetails}>
										<div className={styles.carrierName}>{carrier.name}</div>
										<div className={styles.servicesCount}>{enabledServicesCount} Services</div>
									</div>
								</div>
							</div>
							{labelDisplayOptionsCount?.length > 0 && (
								<div className={styles.noBorderSection}>
										<div className={styles.labelOptionsView}>
											<div className={styles.labelOptionsTitle}>Return label display options:</div>
											<div className={styles.labelOptionsList}>
												{labelDisplayOptionsCount.map(option => (
													<div key={option.id} className={styles.labelOptionItem}>
														<Checkbox
															label={`${option.name} ${option.supportedCountries ? `(Supports ${option.supportedCountries.join(', ')})` : ''}`}
															checked={true}
															disabled={true}
														/>
													</div>
												))}
											</div>
										</div>
								</div>
							)}
						</Card.Section>
					);
				})}


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
						<Button plain disabled>
							Manage
						</Button>
					</div>
				</Card.Section>

				<Card.Section>
					<div className={styles.carrierSelectorRow}>
						<div className={styles.selectCarrierText}>Select a carrier and service</div>
						{regionOptions && onRegionChange && (
							<div className={styles.regionSelector}>
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
						)}
					</div>

					<CarrierServicesList
						carriers={carriers}
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

	return <div style={{ background: "#FFFFFF" }}><Card>{isEditing ? renderEditMode() : renderViewMode()}</Card></div>;
};

export default EnabledCarrierServices;
