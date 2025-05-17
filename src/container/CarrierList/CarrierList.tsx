import {Icon, Stack, TextField, TextStyle} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import React, {useMemo, useState, useEffect} from 'react';

import styles from './index.module.scss';

import {getFromCanadapost} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/hooks/useCanadaPostCarrier';
import CarrierCard from '@/components/CarrierCard';
import Loader from '@/components/Loader';
import {USPS_DISCOUNTED} from '@/constants';
import {useGetCourierAccounts} from '@/container/CarrierManagerProvider';
import {useCountryCode} from '@/hooks/useCountryCode';
import {useI18next} from '@/i18n';
import {ICourier, useGetAllCouriers} from '@/queries/couriers';
import {courierComparator} from '@/utils/courierComparator';

interface IProps {
    onClick: (slug: string) => void;
}

const CarrierList = ({onClick}: IProps) => {
    const {t} = useI18next();
    const {
        data: {all},
        isLoading,
    } = useGetAllCouriers();

    // 搜索框相关
    const [carrierQuery, setCarrierQuery] = useState<string>('');

    const getLowerCaseString = (value: string) =>
        value.replace(/[- | ' ']/g, '').toLocaleLowerCase();

    const countryCode = useCountryCode();

    const allCarriers = useMemo(() => {
        const allCarriers = (all || [])
            .sort((courier1, courier2) =>
                courierComparator(
                    courier1,
                    courier2,
                    all
                        .filter(item => (item as ICourier).market.includes(countryCode))
                        .map(item => item.slug)
                )
            )
            .filter(({slug, name}) =>
                [getLowerCaseString(slug), getLowerCaseString(name)].some(i =>
                    i.includes(getLowerCaseString(carrierQuery))
                )
            );

        // 把 usps 过滤掉
        return allCarriers.filter(item => item.slug !== USPS_DISCOUNTED);
    }, [all, carrierQuery, countryCode]);

    // 针对 canada-post 的特殊处理
    useEffect(() => {
        const {isAfterCanadapostLogin} = getFromCanadapost();

        if (isAfterCanadapostLogin) {
            onClick('canada-post');
        }
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Stack spacing="none" vertical>
            <TextField
                label=""
                autoComplete="off"
                value={carrierQuery}
                onChange={setCarrierQuery}
                type="text"
                prefix={<Icon source={SearchMinor} color="critical" />}
                placeholder={t('carrier_list.input.placeholder', {
                    defaultValue: 'Search by carrier name',
                })}
            />
            <div className={styles.wrap}>
                {allCarriers.map(({slug, name}) => (
                    <CarrierCard key={slug} slug={slug} name={name} onClick={() => onClick(slug)} />
                ))}
            </div>
            {!allCarriers.length && (
                <Stack.Item fill>
                    <div style={{margin: '3.6rem auto 5.4rem'}}>
                        <Stack alignment="center" vertical spacing="extraTight">
                            <TextStyle variation="subdued">
                                {t('carrier_list.empty', {defaultValue: 'No carriers found'})}
                            </TextStyle>
                            <TextStyle variation="subdued">
                                {t('carrier_list.retry', {
                                    defaultValue: 'Try changing the search term',
                                })}
                            </TextStyle>
                        </Stack>
                    </div>
                </Stack.Item>
            )}
        </Stack>
    );
};

export default CarrierList;
