import {Banner} from '@shopify/polaris';

import {useI18next} from '@/i18n';

const EditCarrierAccountBanner = () => {
    const {t} = useI18next();
    return (
        <Banner status="info">
            {t('common_modal.banner', {
                defaultValue:
                    'The edits you make will apply to both AfterShip Returns and AfterShip Shipping.',
            })}
        </Banner>
    );
};

export default EditCarrierAccountBanner;
