import {Stack, Subheading, FormLayout} from '@shopify/polaris';
import React from 'react';

import {ModalMode} from '../../hooks/useModalInfoMap';
import {getaddressRequiredFields} from '../../utils';
import ModalFormFiledItem from '../GenerateFields';

import {getAddressFields} from './constants';

import Divider from '@/components/Divider';
import {disabledEditSlugs} from '@/constants';
import {useI18next} from '@/i18n';

interface IProps {
    mode: ModalMode;
    slug: string;
}

const AddressFormSection = ({mode, slug}: IProps) => {
    const {t} = useI18next();
    const fields = getAddressFields(getaddressRequiredFields(slug));

    return (
        <Stack vertical>
            <Stack.Item />
            <Divider />
            <FormLayout>
                <Subheading>{t('label.address.upcase', {defaultValue: 'ADDRESS'})}</Subheading>
                <ModalFormFiledItem
                    fields={fields}
                    disabled={disabledEditSlugs.includes(slug) && mode === ModalMode.EDIT}
                />
            </FormLayout>
        </Stack>
    );
};

export default AddressFormSection;
