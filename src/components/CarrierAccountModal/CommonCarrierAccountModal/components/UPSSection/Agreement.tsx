import {Checkbox, Link, Stack, TextStyle} from '@shopify/polaris';
import React from 'react';
import {Trans} from 'react-i18next';

import {NAMESPACE} from '@/i18n';

interface IProps {
    checked: boolean;
    onChecked: (checked: boolean) => void;
}

const Agreement = ({checked, onChecked}: IProps) => {
    return (
        <Stack vertical>
            <Stack.Item />
            <Stack spacing="tight">
                <Checkbox label="" labelHidden checked={checked} onChange={onChecked} />
                <TextStyle>
                    <Trans i18nKey="common_modal.agreement" ns={NAMESPACE}>
                        By checking this box, you agree to the UPS Technology{' '}
                        <Link
                            removeUnderline
                            external
                            url="https://www.ups.com/assets/resources/media/en_GB/UTA.pdf"
                        >
                            <TextStyle>Agreement</TextStyle>
                        </Link>
                    </Trans>
                </TextStyle>
            </Stack>
        </Stack>
    );
};

export default Agreement;
