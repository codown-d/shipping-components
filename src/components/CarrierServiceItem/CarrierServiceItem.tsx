import React, { useState } from 'react';
import {
	Checkbox,
	Icon,
	TextStyle,
} from '@shopify/polaris';
import { ChevronDownMinor, ChevronUpMinor } from '@shopify/polaris-icons';

import SlugIcon from '../SlugIcon';
import styles from './CarrierServiceItem.module.scss';

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

export interface CarrierServiceItemProps {
	slug: string;
	name: string;
	services: CarrierService[];
	servicesCount: number;
	labelDisplayOptions?: LabelDisplayOption[];
	isExpanded?: boolean;
	isEditing: boolean;
	onToggle?: () => void;
	onCarrierToggle?: () => void;
	onServiceToggle?: (serviceIndex: number) => void;
	onLabelOptionToggle?: (optionIndex: number) => void;
}

const CarrierServiceItem: React.FC<CarrierServiceItemProps> = ({
	slug,
	name,
	services,
	servicesCount,
	labelDisplayOptions = [],
	isExpanded = false,
	isEditing,
	onToggle,
	onCarrierToggle,
	onServiceToggle,
	onLabelOptionToggle,
}) => {
	const hasEnabledServices = services.some(service => service.enabled);
	// 渲染标签显示选项
	const renderLabelOptions = () => {
		return (
			<div className={styles.labelOptionsContainer} onClick={(e)=>e.stopPropagation()}>
				<div className={styles.labelOptionsHeader}>
					<TextStyle>Return label display options:</TextStyle>
				</div>
				<div className={styles.labelOptionsList}>
					{labelDisplayOptions.map((option, index) => (
						<div key={option.id} className={styles.labelOptionItem}>
							<Checkbox
								label={`${option.name} ${option.supportedCountries ? `(Supports ${option.supportedCountries.join(', ')})` : ''}`}
								checked={option.enabled}
								disabled={!isEditing}
								onChange={() => onLabelOptionToggle && onLabelOptionToggle(index)}
							/>
						</div>
					))}
				</div>
			</div>
		);
	};

	// 渲染服务列表
	const renderServices = () => {
		return services.map((service, index) => (
			<div key={service.id} className={styles.serviceItem}>
				<Checkbox
					label={service.name}
					checked={service.enabled}
					disabled={!isEditing}
					onChange={() => onServiceToggle && onServiceToggle(index)}
				/>
			</div>
		));
	};

	return (
		<div className={styles.carrierItem}>
			<div onClick={onToggle}>
				<div className={styles.carrierHeader} >
					<div className={styles.carrierCheckbox} onClick={(e) => {
						e.stopPropagation();
						if (isEditing && onCarrierToggle) onCarrierToggle();
					}}>
						<Checkbox
							label=""
							labelHidden
							checked={hasEnabledServices}
							disabled={!isEditing}
						/>
					</div>
					<div className={styles.carrierIcon}>
						<SlugIcon name={slug} size="24px" />
					</div>
					<div className={styles.carrierName}>
						<TextStyle variation="strong">{name}</TextStyle>
					</div>
					<div className={styles.servicesCount}>
						{servicesCount} Services
						{onToggle && (
							<span className={styles.expandIcon}>
								<Icon source={isExpanded ? ChevronUpMinor : ChevronDownMinor} color="base" />
							</span>
						)}

					</div>
				</div>
				{isExpanded && renderLabelOptions()}
			</div>

			{isExpanded && (
				<div className={styles.servicesList}>
					{renderServices()}
				</div>
			)}
		</div>
	);
};

export default CarrierServiceItem;
