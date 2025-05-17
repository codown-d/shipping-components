import {Stack, TextStyle, Button, InlineError} from '@shopify/polaris';
import React, {FC} from 'react';

import {useCarrierManagerContext} from '@/container/CarrierManagerProvider';
import {useTestMode} from '@/hooks/useTestMode';
import {useI18next} from '@/i18n';
import {CourierAccount} from '@/queries/carrierAccounts';
import {currencyFormatUSDInstance} from '@/utils/intl';
import { isNumber } from 'lodash';

export interface Props {
    carrierAccount: CourierAccount;
    onEditRecharge: VoidFunction;
}

const AccountBalanceSection: FC<Props> = ({carrierAccount, onEditRecharge}) => {
    const {t} = useI18next();
    const {
        uspsRechargeData: {data: rechargeValues},
        editable,
    } = useCarrierManagerContext();
    const {isTestMode} = useTestMode();

    const isUspsDiscountedInProd = !isTestMode;

    const accountBalance = isTestMode ? null : carrierAccount.account_balance;

    // Only the production mode usps-discounted need this balance section
    if (!isUspsDiscountedInProd) {
        return null;
    }

    return (
        <Stack vertical spacing="loose">
            <>
                <Stack.Item fill>
                    <TextStyle>
                        {t('account_balance.title', {defaultValue: 'Account balance'})}
                    </TextStyle>
                </Stack.Item>
                {isNumber(accountBalance) ? (
                    <TextStyle variation="strong">
                        {currencyFormatUSDInstance.format(accountBalance)}
                    </TextStyle>
                ) : (
                    <InlineError
                        fieldID="usps_account_error"
                        message={t('account_balance.currency.error', {
                            defaultValue: 'Unable to get account info. Please try again later.',
                        })}
                    />
                )}
            </>
            {isUspsDiscountedInProd && (
                <>
                    <Stack wrap={false}>
                        <Stack.Item fill>
                            <TextStyle>
                                {t('account_balance.recharge', {defaultValue: 'Account-recharge'})}
                            </TextStyle>
                        </Stack.Item>
                        <Stack.Item>
                            <Button disabled={!editable} plain onClick={onEditRecharge}>
                                {t('action.content.edit', {defaultValue: 'Edit'})}
                            </Button>
                        </Stack.Item>
                    </Stack>
                    <TextStyle>
                        {t('account_balance.recharge.desc', {
                            amount: rechargeValues?.amount?.toFixed(2),
                            threshold: rechargeValues?.threshold?.toFixed(2),
                            defaultValue: `Recharge with $${rechargeValues?.amount?.toFixed(
                                2
                            )} when the balance drops below $${rechargeValues?.threshold?.toFixed(
                                2
                            )}.`,
                        })}
                    </TextStyle>
                </>
            )}
        </Stack>
    );
};

export default AccountBalanceSection;
