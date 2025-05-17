import {Stack, TextStyle, Button, Card} from '@shopify/polaris';
import {useState, useEffect, ReactNode} from 'react';
import {Trans} from 'react-i18next';

import {useCarrierManagerContext} from '../CarrierManagerProvider/CarrierManagerProvider';

import UserCourierAccount from '@/components/CarrierAccountList/CarrierAccountItem';
import AccountBalanceSection from '@/components/CarrierAccountModal/SpecialCarrierAccountModal/USPSCourierAccountModal/AccountBalanceSection';
import DeleteCourierAccountModal from '@/components/DeleteCourierAccountModal';
import SlugIcon from '@/components/SlugIcon';
import {USPS_DISCOUNTED} from '@/constants';
import UspsAccountModals from '@/container/UspsAccountModals';
import {useOpenUspsAccountModals} from '@/container/UspsAccountModals/useOpenUspsAccountModals';
import {NAMESPACE, useI18next} from '@/i18n';

interface IProps {
    onCreatedSuccess?: VoidFunction;
    renderSetUpButton?: ({onClick}: {onClick: VoidFunction}) => ReactNode;
}

const USPSDisccountedAccount = ({onCreatedSuccess, renderSetUpButton}: IProps) => {
    const {t} = useI18next();
    const {
        accountId,
        setAccountId,
        openUspsAccountModal,
        closeUspsRelativeModal,
        currentModalName,
        openUspsRechargeModal,
    } = useOpenUspsAccountModals();

    const {
        uspsDiscountedAccountData,
        editSingleCarrierRelativeModals: {openEditShippingServiceModal},
        setToast,
        carrierAccountsData: {refetch},
        editable = true,
    } = useCarrierManagerContext();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        setAccountId(uspsDiscountedAccountData?.id ?? '');
    }, [uspsDiscountedAccountData]);

    const openDeleteCarrierModal = () => {
        setOpenDeleteModal(true);
    };

    const onClose = () => {
        setOpenDeleteModal(false);
    };

    const openEditUspsAccountModal = () => {
        openUspsAccountModal();
    };

    const goToUspsPage = () => {
        window.open('https://www.aftership.com/tools/shipping-calculator/usps/usa-to-usa');
    };

    const renderUspsAccountContent = () => {
        if (!uspsDiscountedAccountData) return <></>;
        // TODO: 暂时紧急的关闭注册入口
        // return (
        //     <Card.Section>
        //         <Stack wrap={false}>
        //             <Stack.Item>
        //                 <SlugIcon name={USPS_DISCOUNTED} />
        //             </Stack.Item>
        //             <Stack.Item fill>
        //                 <Stack vertical spacing="none">
        //                     <Stack>
        //                         <TextStyle variation="strong">
        //                             {t('courier.usps.name', {defaultValue: 'USPS by Maersk'})}
        //                         </TextStyle>
        //                     </Stack>
        //                     <TextStyle variation="subdued">
        //                         <Trans i18nKey="usps.info" ns={NAMESPACE}>
        //                             Enjoy up to 89% off{' '}
        //                             <Button plain external onClick={goToUspsPage}>
        //                                 USPS shipping rates.
        //                             </Button>
        //                         </Trans>
        //                     </TextStyle>
        //                 </Stack>
        //             </Stack.Item>
        //             <Stack.Item>
        //                 {renderSetUpButton ? (
        //                     <>{renderSetUpButton({onClick: openUspsAccountModal})}</>
        //                 ) : (
        //                     <Button disabled={!editable} onClick={openUspsAccountModal}>
        //                         {t('action.content.set_up', {defaultValue: 'Set up'})}
        //                     </Button>
        //                 )}
        //             </Stack.Item>
        //         </Stack>
        //     </Card.Section>
        // );
        return (
            <UserCourierAccount
                carrierAccount={uspsDiscountedAccountData}
                onService={openEditShippingServiceModal}
                onDelete={openDeleteCarrierModal}
                onEdit={openEditUspsAccountModal}
                editable={editable}
            >
                <Card.Subsection>
                    <AccountBalanceSection
                        carrierAccount={uspsDiscountedAccountData}
                        onEditRecharge={openUspsRechargeModal}
                    />
                </Card.Subsection>
            </UserCourierAccount>
        );
    };

    return (
        <>
            {renderUspsAccountContent()}
            <DeleteCourierAccountModal
                open={openDeleteModal}
                onClose={onClose}
                setToast={setToast}
                accountId={uspsDiscountedAccountData?.id}
                onSave={refetch}
            />
            <UspsAccountModals
                onClose={closeUspsRelativeModal}
                currentModalName={currentModalName}
                openUspsRechargeModal={openUspsRechargeModal}
                accountId={accountId}
                setAccountId={setAccountId}
                onCreatedSuccess={onCreatedSuccess}
            />
        </>
    );
};

export default USPSDisccountedAccount;
