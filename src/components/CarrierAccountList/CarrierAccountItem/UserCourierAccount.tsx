import {TextStyle, Stack, Button, Popover, ActionList, Card} from '@shopify/polaris';
import {MobileHorizontalDotsMajor} from '@shopify/polaris-icons';
import dayjs from 'dayjs';
import pluralize from 'pluralize';
import React, {ReactNode, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {useToggle} from 'react-use';

import SlugIcon from '@/components/SlugIcon';
import {USPS_DISCOUNTED} from '@/constants';
import {useI18next} from '@/i18n';
import {CourierAccount} from '@/queries/carrierAccounts';
import {ICourierInfo} from '@/queries/couriers';
import {getIsInTestMode} from '@/utils/routes';

interface IUserCourierAccountProps {
    carrierAccount: CourierAccount;
    showTrackingNumberButton?: boolean;
    showUpgradeButton?: boolean;
    trackingNumberPagePathName?: string;
    upgradeDueDate?: string | null;
    editable?: boolean;
    children?: ReactNode;
    renderChildren?: () => ReactNode;
    onService: (courierInfo: ICourierInfo) => void;
    onRemove?: (accountId: string) => void;
    onDelete?: (accountId: string) => void;
    onEdit: (CourierAccount: CourierAccount) => void;
    onUpgrade?: (CourierAccount: CourierAccount) => void;
}

export default function UserCourierAccount({
    carrierAccount,
    showTrackingNumberButton,
    showUpgradeButton,
    trackingNumberPagePathName,
    upgradeDueDate,
    renderChildren,
    onService,
    onRemove,
    onDelete,
    onEdit,
    onUpgrade,
    children,
    editable,
}: IUserCourierAccountProps) {
    const {t} = useI18next();
    // 更多操作的按钮逻辑
    const popoverEnable = !(getIsInTestMode() && carrierAccount.type !== 'user'); // 非 user 即公用的测试账号，不能编辑
    const [activePopover, togglePopover] = useToggle(false);
    const activator = (
        <Button
            icon={MobileHorizontalDotsMajor}
            onClick={togglePopover}
            disabled={!editable}
            plain
            monochrome
        />
    );

    const handleEditButtonClick = () => {
        onEdit(carrierAccount);
    };

    const handleRemoveButtonClick = () => {
        onRemove?.(carrierAccount.id);
    };

    const handleDeleteButtonClick = () => {
        onDelete?.(carrierAccount.id);
    };

    const handleUpgradeButtonClick = () => {
        onUpgrade?.(carrierAccount);
    };

    // service 的按钮逻辑
    const count = carrierAccount.shipping_services?.filter(service => service.enabled).length ?? 0;
    const service = pluralize('service', count, false);
    const serviceCount = `${count} ${t(service, service)}`;

    const handleServiceButtonClick = () => {
        onService({slug: carrierAccount.slug, accountId: carrierAccount.id});
    };

    // tracking-number 的按钮逻辑
    const history = useHistory();

    const toTrackingNumberPage = () => {
        history.push({
            pathname: trackingNumberPagePathName,
            search: `?slug=${carrierAccount.slug}&id=${carrierAccount.id}`,
        });
    };

    // 如果是 USPS，展示 delete button，调用 delete 接口删除 carrier
    const showRemoveOrDeleteCarrierAction = useMemo(() => {
        if (carrierAccount.slug === USPS_DISCOUNTED) {
            return {
                content: t('action.content.delete', {defaultValue: 'Delete'}),
                destructive: true,
                onAction: handleDeleteButtonClick,
            };
        }
        return {
            content: t('action.content.remove', {defaultValue: 'Remove'}),
            destructive: true,
            onAction: handleRemoveButtonClick,
        };
    }, [carrierAccount.slug, t]);

    return (
        <Card.Section>
            <Stack key={carrierAccount.id} wrap={false}>
                <SlugIcon name={carrierAccount.slug} />
                <Stack.Item fill>
                    <Stack spacing="baseTight" vertical>
                        <Stack>
                            <Stack.Item fill>
                                <Stack vertical spacing="none">
                                    <Stack spacing="extraTight">
                                        <TextStyle variation="strong">
                                            {carrierAccount.description}
                                        </TextStyle>
                                        <TextStyle>({carrierAccount.originSlugName})</TextStyle>
                                    </Stack>

                                    <Stack spacing="extraTight">
                                        {showUpgradeButton && upgradeDueDate && (
                                            <div
                                                style={{
                                                    color: 'rgba(145, 106, 0, 1)',
                                                }}
                                            >
                                                {t('carrier.upgrade.dueDate', {
                                                    upgradeDueDate:
                                                        dayjs(upgradeDueDate).format(
                                                            'MMM DD, YYYY'
                                                        ),
                                                })}
                                            </div>
                                        )}
                                    </Stack>
                                    <Button
                                        plain
                                        onClick={handleServiceButtonClick}
                                        disabled={!editable}
                                    >
                                        {serviceCount}
                                    </Button>
                                </Stack>
                            </Stack.Item>
                            {editable && (
                                <Stack alignment="center">
                                    {showTrackingNumberButton && (
                                        <Button size="slim" onClick={toTrackingNumberPage}>
                                            {t('table.column.tracking_number', {
                                                defaultValue: 'Tracking number',
                                            })}
                                        </Button>
                                    )}
                                    {showUpgradeButton && (
                                        <Button
                                            size="slim"
                                            primary
                                            onClick={handleUpgradeButtonClick}
                                        >
                                            {t('action.content.upgrade', {
                                                defaultValue: 'Update',
                                            })}
                                        </Button>
                                    )}

                                    {popoverEnable && (
                                        <Popover
                                            active={activePopover}
                                            activator={activator}
                                            onClose={togglePopover}
                                        >
                                            <ActionList
                                                items={[
                                                    {
                                                        content: t('action.content.edit', {
                                                            defaultValue: 'Edit',
                                                        }),
                                                        onAction: handleEditButtonClick,
                                                    },
                                                    showRemoveOrDeleteCarrierAction,
                                                ]}
                                            />
                                        </Popover>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                        {children}

                        {renderChildren?.()}
                    </Stack>
                </Stack.Item>
            </Stack>
        </Card.Section>
    );
}
