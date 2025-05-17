import {Modal} from '@shopify/polaris';

import CarrierList from '../CarrierList';

import styles from './index.module.scss';
import {CarrierListModalProps} from './types';

import {useCustomPopupClassName} from '@/hooks/useCustomPopupClassName';
import {useI18next} from '@/i18n';

const CarrierListModal = ({open, onClick, onClose}: CarrierListModalProps) => {
    const {t} = useI18next();
    const modalRef = useCustomPopupClassName<HTMLDivElement>(styles['sdk_carrier_list_modal']);
    return (
        <Modal
            title={t('carrier_list_modal.title', {defaultValue: 'Choose carrier'})}
            open={open}
            onClose={onClose}
            large
        >
            <div ref={modalRef} />
            <Modal.Section>
                <CarrierList onClick={onClick} />
            </Modal.Section>
        </Modal>
    );
};

export default CarrierListModal;
