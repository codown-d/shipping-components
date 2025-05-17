import {Button, Card, Stack, TextStyle} from '@shopify/polaris';
import {useTranslation} from 'react-i18next';

import SlugIcon from '../SlugIcon';

import {IPartnerOption} from './Partners';

export const PartnerItemLayout = ({option}: {option: Omit<IPartnerOption, 'component'>}) => {
    const {t} = useTranslation();
    const {slug, title, subtitle, primaryAction} = option;
    const showAction = primaryAction?.showAction ?? true;
    const primaryActionContent =
        primaryAction?.content ?? t('action.content.set_up', {defaultValue: 'Set up'});
    return (
        <Card.Section>
            <Stack wrap={false}>
                <Stack.Item>
                    <SlugIcon name={slug} />
                </Stack.Item>
                <Stack.Item fill>
                    <Stack vertical spacing="none">
                        <Stack>
                            <TextStyle variation="strong">{title}</TextStyle>
                        </Stack>
                        <TextStyle variation="subdued">{subtitle}</TextStyle>
                    </Stack>
                </Stack.Item>
                <Stack.Item>
                    {showAction &&
                        (primaryAction?.render?.(option) ?? (
                            <Button
                                icon={primaryAction?.icon}
                                disabled={!!primaryAction?.disabled}
                                onClick={() => primaryAction?.onAction?.(option)}
                            >
                                {primaryActionContent}
                            </Button>
                        ))}
                </Stack.Item>
            </Stack>
        </Card.Section>
    );
};

const PartnerItem = ({option}: {option: IPartnerOption}) => {
    const {component, ...rest} = option;
    if (component) return <>{option.component}</>;
    return <PartnerItemLayout option={rest} />;
};

export default PartnerItem;
