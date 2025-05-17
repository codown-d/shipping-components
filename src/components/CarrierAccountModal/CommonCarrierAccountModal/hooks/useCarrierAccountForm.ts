import {yupResolver} from '@hookform/resolvers/yup';

import {ICarrierAccountModalFormValue, ModalMode} from '../hooks/useModalInfoMap';
import {getCommonSchema} from '../schema';

import {IDynamicFormInfo} from './useCarrierAccountFieldList';

import {useHookForm} from '@/hooks/useHookForm';
import {CourierAccount} from '@/queries/carrierAccounts';

interface Props {
    mode: ModalMode;
    slug: string;
    version?: number;
    dynamicFormInfo: IDynamicFormInfo[];
    carrierAccountData?: CourierAccount;
    showInvoice: boolean;
}

const useCarrierAccountForm = ({
    mode,
    slug,
    dynamicFormInfo,
    version,
    carrierAccountData,
    showInvoice,
}: Props) => {
    const methods = useHookForm<ICarrierAccountModalFormValue>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        resolver:
            mode === ModalMode.ADD || mode === ModalMode.UPGRADE
                ? yupResolver(
                      getCommonSchema({
                          slug,
                          dynamicFormInfo,
                          withInvoice: showInvoice,
                      })
                  )
                : undefined,
        defaultValues:
            mode === ModalMode.EDIT
                ? {
                      description: carrierAccountData?.description || '',
                      credentials: carrierAccountData?.credentials,
                      address: carrierAccountData?.address,
                      invoice: {
                          enabled: Boolean(carrierAccountData?.invoice?.invoice_number),
                      },
                  }
                : undefined,
    });

    const isEditFormDirty = mode === ModalMode.EDIT ? methods.formState.isDirty : true;

    return {methods, isEditFormDirty};
};

export default useCarrierAccountForm;
