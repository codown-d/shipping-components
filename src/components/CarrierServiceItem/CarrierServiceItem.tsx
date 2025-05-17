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
    if (!labelDisplayOptions || labelDisplayOptions.length === 0) return null;

    return (
      <div className={styles.labelOptionsContainer}>
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
      <div className={styles.carrierHeader} onClick={onToggle}>
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
          <SlugIcon name={slug} size="40px" />
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

      {isExpanded && (
        <div className={styles.servicesList}>
          {slug === 'dhl' && labelDisplayOptions.length > 0 && renderLabelOptions()}
          {renderServices()}
        </div>
      )}

      {/* 在查看模式下，显示已启用的标签选项 */}
      {!isEditing && !isExpanded && labelDisplayOptions.filter(option => option.enabled).length > 0 && (
        <div className={styles.labelOptionsFooter}>
          <div className={styles.labelOptionsHeader}>
            <TextStyle>Return label display options:</TextStyle>
          </div>
          <div className={styles.labelOptionsList}>
            {labelDisplayOptions
              .filter(option => option.enabled)
              .map(option => (
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
      )}
    </div>
  );
};

export default CarrierServiceItem;
