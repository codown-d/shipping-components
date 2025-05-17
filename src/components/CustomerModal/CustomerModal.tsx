import {Modal, ModalProps as PModalProps, Stack, Icon, TextStyle} from '@shopify/polaris';
import {MobileChevronMajor} from '@shopify/polaris-icons';

export interface ModalProps extends PModalProps {
    withBackArrow?: boolean;
    onBack?: VoidFunction;
}

const CustomerModal = ({title, onBack, withBackArrow, ...rest}: ModalProps) => {
    const TitleWithBackArrow = (
        <Stack alignment="center" wrap={false}>
            <div
                role="button"
                style={{
                    cursor: 'pointer',
                }}
                onClick={onBack}
            >
                <Icon source={MobileChevronMajor} />
            </div>
            <Stack.Item fill>
                <TextStyle>{title}</TextStyle>
            </Stack.Item>
        </Stack>
    );
    return <Modal {...rest} title={withBackArrow ? TitleWithBackArrow : title} />;
};

export default CustomerModal;
