import {Stack, TextStyle, Button, TextContainer, Toast} from '@shopify/polaris';
import {DuplicateMinor} from '@shopify/polaris-icons';
import React, {useState} from 'react';
import {Trans} from 'react-i18next';
import {useCopyToClipboard} from 'react-use';

import {useI18next, NAMESPACE} from '@/i18n';

interface IAccountIdCopySectionProps {
    accountId: string;
}

const AccountIdCopySection = (props: IAccountIdCopySectionProps) => {
    const {t} = useI18next();
    const {accountId} = props;
    const [, copyToClipboard] = useCopyToClipboard();
    const [toastMsg, setToast] = useState<string>('');

    const handleCopyToClipboard = () => {
        copyToClipboard(accountId);
        setToast(t('toast.account_copied', {defaultValue: 'Carrier account id copied.'}));
    };
    return (
        <Stack distribution="equalSpacing">
            <TextContainer>
                <Trans ns={NAMESPACE} i18nKey="common_modal.copy_section" values={{accountId}}>
                    Account Id : <TextStyle variation="subdued">{accountId}</TextStyle>
                </Trans>
            </TextContainer>
            <Button icon={DuplicateMinor} plain onClick={handleCopyToClipboard} />{' '}
            {toastMsg && <Toast content={toastMsg} onDismiss={() => {}} />}
        </Stack>
    );
};

export default AccountIdCopySection;
