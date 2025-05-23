import React, { useState } from 'react';
import styles from './CarrierServicesList.module.scss';

import CarrierServiceItem from '../CarrierServiceItem';

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

export interface CarrierServicesListProps {
  carriers: Carrier[];
  onCarrierToggle: (carrierIndex: number) => void;
  onServiceToggle: (carrierIndex: number, serviceIndex: number) => void;
  onLabelOptionToggle: (carrierIndex: number, serviceIndex: number) => void;
  isEditing: boolean;
}

const CarrierServicesList: React.FC<CarrierServicesListProps> = ({
  carriers,
  onCarrierToggle,
  onServiceToggle,
  onLabelOptionToggle,
  isEditing,
}) => {
  // 状态管理
  const [expandedCarriers, setExpandedCarriers] = useState<Record<string, boolean>>({});

  // 处理快递公司展开/折叠
  const toggleCarrierExpand = (slug: string) => {
    setExpandedCarriers(prev => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // 渲染快递公司项
  const renderCarrierItem = (carrier: Carrier, carrierIndex: number) => {
    const isExpanded = expandedCarriers[carrier.slug];
    const enabledServicesCount = carrier.services.filter(service => service.enabled).length;

    // 在查看模式下，如果没有启用的服务，则不显示该快递公司
    if (!isEditing && enabledServicesCount === 0) {
      return null;
    }

    return (
      <CarrierServiceItem
        key={carrier.slug}
        slug={carrier.slug}
        name={carrier.name}
        services={carrier.services}
        servicesCount={enabledServicesCount}
        labelDisplayOptions={carrier.labelDisplayOptions}
        isExpanded={isExpanded}
        isEditing={isEditing}
        onToggle={() => toggleCarrierExpand(carrier.slug)}
        onCarrierToggle={() => onCarrierToggle(carrierIndex)}
        onServiceToggle={(serviceIndex) => onServiceToggle(carrierIndex, serviceIndex)}
        onLabelOptionToggle={(serviceIndex) => onLabelOptionToggle(carrierIndex, serviceIndex)}
      />
    );
  };

  return (
    <div className={styles.carrierServicesList}>
      {carriers.map((carrier, index) => renderCarrierItem(carrier, index))}
    </div>
  );
};

export default CarrierServicesList;
