import {Button, Stack} from '@shopify/polaris';
import React from 'react';
import {Link} from 'react-router-dom';

import CarrierAccountList from '@/container/CarrierAccountList';
import {
    useCarrierAccountManagerModal,
    useCarrierListModal,
} from '@/container/CarrierManagerProvider';
import USPSDisccountedAccount from '@/container/USPSDiscountedAccount';
import StartService from '@/components/StartService';

const CarrierPage = () => {
    const {open: openCarrierAccountManagerModal} = useCarrierAccountManagerModal({
        onSave: () => {},
    });

    const {open: openCarrierListModal} = useCarrierListModal({
        onClick: () => {},
        onCarrierItemSave: () => {},
    });

    return (
        <>
            <Stack vertical spacing="loose">
                <Stack>
                    <Button onClick={openCarrierAccountManagerModal}>open org accounts</Button>
                    <Button onClick={openCarrierListModal}>open carrier list</Button>
                    <Link to="/account-info">
                        <Button>Account Information Example</Button>
                    </Link>
                    <Link to="/carrier-services">
                        <Button>Enabled Carrier Services Example</Button>
                    </Link>
					<Link to="/payment-information">
                        <Button>Payment Information Example</Button>
                    </Link>
					<Link to="/billing-cycle">
                        <Button>billing cycle Example</Button>
                    </Link>
                    <Link to="/account-sheet">
                        <Button>Account Sheet Example</Button>
                    </Link>
                </Stack>
                <CarrierAccountList
                    renderChildren={() => {
                        return <p>show qrcode</p>;
                    }}
                />
                <USPSDisccountedAccount />
            </Stack>
        </>
    );
};

export default CarrierPage;
