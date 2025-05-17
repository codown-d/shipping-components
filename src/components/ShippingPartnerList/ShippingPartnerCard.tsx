import {Stack, TextStyle} from '@shopify/polaris';
import React, {useState} from 'react';

import SlugIcon from '../SlugIcon';

import PopularBadgeSVG from './assets/popular-badge.svg';
import AddNowButtonSVG from './assets/add-now-button.svg';

import styles from './ShippingPartnerCard.module.scss';

interface ShippingPartnerCardProps {
    slug: string;
    title: string;
    subtitle: string;
    tags?: string[];
    carriers?: string[];
    onAction?: () => void;
}

const ShippingPartnerCard: React.FC<ShippingPartnerCardProps> = ({
    slug,
    title,
    subtitle,
    tags = [],
    carriers = [],
    onAction,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPopular = tags.includes('popular');

    // 处理鼠标悬停事件
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // 处理卡片点击事件
    const handleCardClick = () => {
        // 只有非popular卡片才响应整体点击
        if (!isPopular && onAction) {
            onAction();
        }
    };

    // 限制显示的carriers数量，避免过多
    // 当鼠标悬停时显示所有carriers，否则只显示前3个
    const displayCarriers = isHovered ? carriers : carriers.slice(0, 3);
    const hasMoreCarriers = !isHovered && carriers.length > 3;

    return (
        <div
            className={`${styles.card_container} ${isPopular ? styles.popular : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.card_content} onClick={handleCardClick}>
                {/* 卡片头部 */}
                <Stack spacing="tight" alignment="center">
                    <SlugIcon name={slug} size="40px" />
                    <Stack.Item fill>
                        <Stack alignment="center">
                            <TextStyle variation="strong">{title}</TextStyle>
                            {/* Popular 标签 */}
                            {isPopular && <img src={PopularBadgeSVG} alt="Popular" className={styles.popular_badge} />}
                        </Stack>
                    </Stack.Item>
                </Stack>

                {/* 如果是popular卡片，显示carriers在标题下方 */}
                {isPopular && displayCarriers.length > 0 && (
                    <Stack spacing="tight" alignment="center" wrap={false}>
                        <Stack spacing="none" alignment="center">
                            {displayCarriers.map((carrier, index) => (
                                <div
                                    key={`${slug}-${carrier}-${index}`}
                                    className={styles.carrier_icon}
                                >
                                    <SlugIcon name={carrier} size="20px" />
                                </div>
                            ))}
                        </Stack>
                        {hasMoreCarriers && (
                            <div className={styles.more_carriers}>+{carriers.length - 3}</div>
                        )}
                        {carriers.length > 0 && (
                            <TextStyle variation="subdued">+{carriers.length}</TextStyle>
                        )}
                        <TextStyle variation="subdued">|</TextStyle>
                    </Stack>
                )}

                {/* 描述文本 */}
                <TextStyle variation="subdued">{subtitle}</TextStyle>

                {/* 弹性空间 */}
                <div className={styles.spacer}></div>

                {/* 非popular卡片的carriers显示在底部 */}
                {!isPopular && displayCarriers.length > 0 && (
                    <Stack spacing="tight" alignment="center" wrap={false}>
                        <Stack spacing="none" alignment="center">
                            {displayCarriers.map((carrier, index) => (
                                <div
                                    key={`${slug}-${carrier}-${index}`}
                                    className={styles.carrier_icon}
                                >
                                    <SlugIcon name={carrier} size="20px" />
                                </div>
                            ))}
                        </Stack>
                    </Stack>
                )}

                {/* 只有popular卡片才显示Add now按钮 */}
                {isPopular && (
                    <img
                        src={AddNowButtonSVG}
                        alt="Add now"
                        className={styles.add_button}
                        onClick={onAction}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            </div>
        </div>
    );
};

export default ShippingPartnerCard;
