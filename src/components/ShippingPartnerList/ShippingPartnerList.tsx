import React from 'react';

import {IPartnerOption} from '../Partners/Partners';

import ShippingPartnerCard from './ShippingPartnerCard';
import styles from './ShippingPartnerList.module.scss';

// 扩展IPartnerOption接口，添加carriers和tags属性
interface ExtendedPartnerOption extends IPartnerOption {
    carriers?: string[];
    tags?: string[];
    isWide?: boolean; // 添加宽卡片标识
}

interface ShippingPartnerListProps {
    options: ExtendedPartnerOption[];
}

const ShippingPartnerList: React.FC<ShippingPartnerListProps> = ({options}) => {
    // 判断是否为宽卡片的函数
    const isWideCard = (option: ExtendedPartnerOption): boolean => {
        // 如果明确设置了isWide属性，则使用该属性
        if (option.isWide !== undefined) {
            return option.isWide;
        }

        // 根据标签判断，例如"popular"标签的卡片可能需要更宽的显示
        if (option.tags?.includes('popular')) {
            return true;
        }

        // 或者根据subtitle的长度判断
        const subtitle = option.subtitle as string;

        if (typeof subtitle === 'string' && subtitle.length > 70) {
            return true; // 如果描述文字超过70个字符，则使用宽卡片
        }

        return false;
    };

    return (
        <div className={styles.shipping_partner_list}>
            {options
                .filter(option => !option?.hidden)
                .map(option => (
                    <div
                        key={option.slug}
                        className={
                            isWideCard(option) ? styles.card_wrapper_wide : styles.card_wrapper
                        }
                    >
                        <ShippingPartnerCard
                            slug={option.slug}
                            title={option.title as string}
                            subtitle={option.subtitle as string}
                            tags={option.tags as string[]}
                            carriers={option.carriers || []}
                            onAction={() => option.primaryAction?.onAction?.(option)}
                        />
                    </div>
                ))}
        </div>
    );
};

export default ShippingPartnerList;
