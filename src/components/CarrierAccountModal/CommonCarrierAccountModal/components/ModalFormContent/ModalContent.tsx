import {FormLayout, Modal, Spinner, Stack, Subheading} from '@shopify/polaris';
import React, {useMemo, useState} from 'react';

import {getFromCanadapost, useCanadaPostCarrierInfoInject} from '../../hooks/useCanadaPostCarrier';
import {useCanadaPostRegisterUrl} from '../../hooks/useCanadaPostRegisterUrl';
import {IDynamicFormInfo, UIField} from '../../hooks/useCarrierAccountFieldList';
import useInjectOauth2TokensToForm from '../../hooks/useInjectOauth2TokensToForm';
import {ModalMode} from '../../hooks/useModalInfoMap';
import useOauth2DataAfterLogin, {useOauth2LoginStatus} from '../../hooks/useOauth2DataAfterLogin';
import GenerateFields from '../GenerateFields';
import Oauth2Link from '../Oauth2Link/Oauth2Link';
import InvoiceFields from '../UPSSection/InvoiceFields';

import CourierCredentialsFieldBanner from '@/components/CourierCredentialsFieldBanner';
import Divider from '@/components/Divider';
import {CanadaPostSlug, showCredentialBannerCarrierSlugs} from '@/constants';
import {useI18next} from '@/i18n';
import {IGetOauthTokenStatus} from '@/queries/oauth2';
import {useGetOauthRedirectUrlBySlug} from '@/queries/oauth2/oauth2';

interface IModalFormContentProps {
    accountId: string;
    mode: ModalMode;
    showInvoice: boolean;
    showDivider: boolean;
    slug: string;
    onErrorMessage?: (message: string) => void;
    name: string;
    oauth2Enabled: boolean; // 是否支持 oauth2 登录
    dynamicFormInfo: Array<IDynamicFormInfo>;
}

const ModalFormContent = (props: IModalFormContentProps) => {
    const {
        accountId,
        dynamicFormInfo,
        mode,
        slug,
        name,
        oauth2Enabled,
        showInvoice,
        showDivider,
        onErrorMessage,
    } = props;

    const {isBeforeCanadapostLogin} = getFromCanadapost(slug, mode);

    const {isBeforeOauth2Login, isAfterOauth2Login} = useOauth2LoginStatus(oauth2Enabled, mode);

    const {isLoading: isOauth2Loading, data} = useGetOauthRedirectUrlBySlug(
        slug,
        isBeforeOauth2Login,
        accountId
    );

    const [isLoading, setLoading] = useState<boolean>(false);

    const {isLoading: injectLoading} = useCanadaPostCarrierInfoInject({
        onErrorMessage,
    });

    const {state} = useOauth2DataAfterLogin();

    const {
        isLoading: isInjectTokensLoading,
        status: getTokenStatus,
        reauthUrl,
    } = useInjectOauth2TokensToForm({
        slug,
        onErrorMessage,
        oauth_field_name: state?.oauth_field_name,
    });

    const {isLoading: isCanadaPostRegisterLoading, registerUrl: canadaPostRegisterUrl} =
        useCanadaPostRegisterUrl(isBeforeCanadapostLogin, slug);

    const showCommonLoginLink =
        isBeforeOauth2Login ||
        (isAfterOauth2Login && getTokenStatus === IGetOauthTokenStatus.FAILED); // oauth2 登录之前 || 登录后且失败

    const registerUrl = useMemo(() => {
        if (slug === CanadaPostSlug) return canadaPostRegisterUrl;

        if (isAfterOauth2Login) return reauthUrl;

        return data?.redirect_url;
    }, [slug, canadaPostRegisterUrl, data?.redirect_url, reauthUrl, isAfterOauth2Login]);

    const isModalLoading =
        injectLoading || // 注入 canada post credentials 字段
        isLoading || // 自定义 loading
        isCanadaPostRegisterLoading || // 获取 canada post register url loading
        isOauth2Loading || // 获取 oauth2 url loading
        isInjectTokensLoading; // 注入 oauth2 credential loading

    if (isModalLoading) {
        return (
            <Modal.Section>
                <Stack distribution="center">
                    <Spinner accessibilityLabel="Spinner example" size="large" />
                </Stack>
            </Modal.Section>
        );
    }

    return (
        <FormLayout>
            <Stack vertical>
                {isBeforeCanadapostLogin || showCommonLoginLink ? (
                    <Oauth2Link
                        onLoading={setLoading}
                        name={name}
                        slug={slug}
                        registerUrl={registerUrl || ''}
                    />
                ) : (
                    <Stack vertical spacing="tight">
                        {dynamicFormInfo.map((sectionFormInfo, sectionIndex, array) => {
                            const {title, fields, uiType, disabled} = sectionFormInfo;
                            return (
                                <Stack vertical>
                                    {!!title && <Subheading>{title}</Subheading>}
                                    <GenerateFields
                                        mode={mode}
                                        fields={fields}
                                        disabled={disabled}
                                    />
                                    {(showInvoice || sectionIndex !== array.length - 1) && (
                                        <Divider />
                                    )}
                                </Stack>
                            );
                        })}
                        {showInvoice && <InvoiceFields mode={mode} showDivider={showDivider} />}
                    </Stack>
                )}
            </Stack>
        </FormLayout>
    );
};

export default ModalFormContent;
