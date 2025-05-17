import {logout} from '@aftership/automizely-product-auth';
import {Banner, Stack, TextStyle, BannerStatus} from '@shopify/polaris';
import React, {useState, useEffect} from 'react';

import styles from './ErrorBanner.module.scss';

import {t} from '@/i18n';
import {ResponseMeta} from '@/queries/response';
import {getErrorMessageByMeta} from '@/utils/getErrorMessageByMeta';

interface Props {
    error: ResponseMeta;
}

export interface BannerInfo {
    title: string;
    details: string[];
    status: BannerStatus;
}

export const tryAgainTips = t(
    'message.try_again_tips',
    "An error occurred fetching your data. Your data didn't load. Please try again later."
);

const errorAdapter = (error: ResponseMeta): BannerInfo => {
    if (!error) {
        return {
            title: t('message.network_error', 'Network error.'),
            details: [],
            status: 'critical',
        };
    }

    const {code, message, errors} = error;

    if (code === 40101) {
        // user Unauthorized
        if (process.env.CYPRESS !== 'true') {
            logout();
        }
    }

    const title = getErrorMessageByMeta(error);

    if (code === 40004 && title && title.toLowerCase().includes('user')) {
        // NOTE: new user, do nothing
    } else if (code <= 50000 && title) {
        let errorInfos;

        if (errors && errors.length > 0) {
            errorInfos = errors.map(err => {
                if (typeof err.info === 'string') {
                    return err.info;
                } else {
                    return err.info.details.map(({info}) => info);
                }
            });
        } else {
            errorInfos = message ? [message] : [];
        }

        return {
            title,
            details: errorInfos.flat(),
            status: 'critical',
        };
    } else if (code === 50001 && error.errors) {
        const details =
            typeof error.errors[0].info === 'string'
                ? []
                : error.errors[0].info?.details?.map(detail => detail.info);
        const errorMessage = getErrorMessageByMeta(error);
        return {
            title: errorMessage,
            details: details,
            status: 'critical',
        };
    }

    return {
        title: tryAgainTips,
        details: [],
        status: 'warning',
    };
};

const ErrorBanner = ({error}: Props) => {
    const [bannerTitle, setBannerTitle] = useState<string>();
    const [bannerDetails, setBannerDetails] = useState<string[]>([]);
    const [bannerStatus, setBannerStatus] = useState<BannerStatus>('critical');

    useEffect(() => {
        const {title, details, status} = errorAdapter(error);
        setBannerTitle(title);
        setBannerDetails(details);
        setBannerStatus(status);
    }, [error]);

    return (
        <div className={styles.banner}>
            <Banner title={bannerTitle} status={bannerStatus}>
                <Stack vertical spacing="extraTight">
                    {bannerDetails.map(detail => {
                        return <TextStyle key={detail}>{detail}</TextStyle>;
                    })}
                </Stack>
            </Banner>
        </div>
    );
};

export default ErrorBanner;
