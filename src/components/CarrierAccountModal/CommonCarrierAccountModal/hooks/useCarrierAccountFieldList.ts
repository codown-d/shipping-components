import {useMemo} from 'react';

import {ModalMode} from './useModalInfoMap';

import {getAddressFields} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/components/AddressFormSection/constants';
import {getaddressRequiredFields} from '@/components/CarrierAccountModal/CommonCarrierAccountModal/utils';
import {labelToKeyMap, t, useI18next} from '@/i18n';
import {IField, IFieldType} from '@/queries/carrierAccounts';
import {CourierAccountsSchema} from '@/queries/couriers';

/**
 * 寻找 slug 最大版本号的 schema
 * @param schemas
 */
export const findMaxSchemaCourierAccount = (schemas: CourierAccountsSchema[]) => {
    return schemas.reduce<CourierAccountsSchema | undefined>((maxElement, currentElement) => {
        const currentVersionNumber = Number(currentElement.version);

        // 确保 version 能够成功转换为数值
        if (!isNaN(currentVersionNumber)) {
            const maxVersionNumber = Number(maxElement?.version);

            // 如果当前版本数值大于最大版本数值，则更新最大版本元素
            if (isNaN(maxVersionNumber) || currentVersionNumber > maxVersionNumber) {
                return currentElement;
            }
        }

        // 保持原有的最大版本元素
        return maxElement;
    }, undefined);
};

/**
 * 根据 mode 和 version 找到对应的 schema
 * @param mode 模式
 * @param version 版本
 * @param fields 表单字段
 */
const findMatchingSchemaCourierAccount = <TMode extends ModalMode = ModalMode>({
    mode,
    version,
    courierAccountsSchema: schemas,
    isAfterUpgrade,
}: Params<TMode>): CourierAccountsSchema | undefined => {
    if (mode === ModalMode.EDIT) {
        if (isAfterUpgrade) {
            return findMaxSchemaCourierAccount(schemas);
        }
        return schemas.find(schema => schema.version === version);
    }
    return findMaxSchemaCourierAccount(schemas);
};

export enum FieldTitle {
    CREDENTIALS = 'CREDENTIALS',
    SETTINGS = 'SETTINGS',
}

export interface ICarrierAccountFieldInfo {
    title: FieldTitle;
    fields: IField[];
    disabled?: boolean;
}

export interface Params<TMode extends ModalMode = ModalMode> {
    mode: TMode;
    slug: string;
    version: number | undefined;
    courierAccountsSchema: CourierAccountsSchema[];
    isAfterUpgrade?: boolean;
}

export enum UIField {
    CREDENTIALS,
    SETTINGS,
    OTHER,
}

// 声明动态表单接口类型, groupName,和 IField 数组
export interface IDynamicFormInfo {
    uiType: UIField;
    type: IFieldType;
    title?: string;
    fields: Array<IField | IField[]>;
    disabled?: boolean;
}

export interface CombinedSchemaAndDynamicFormInfo {
    courierAccountSchema?: CourierAccountsSchema;
    dynamicFormInfo: Array<IDynamicFormInfo>;
}

/**
 *  判断当前 section field 下的某一个 field 是是否需要添加 property 参数,如果需要,则创建返回
 *  subfields 为 true 时, 需要从 curSectionField.fields 中找到对应的 subfield ,然后组合为 property 参数
 * @param field 当前 section field 下的某一个 field
 * @param curSectionField 当前 section 的 field
 * @param prefixName 大部分情况等价于 curSectionField.name , 但当 curSectionField.name 为 settings 时, prefixName 为 credentials
 */
function generateProperty(field: IField, curSectionField: IField, prefixName: string) {
    let property: Record<string, IField | undefined> | undefined;

    if (field.subfields?.length) {
        property = field.subfields.reduce(
            (prev, subFieldName) => {
                // must be found
                const subField = curSectionField.fields?.find(
                    field => field.name === subFieldName
                ) as IField;
                return {
                    ...prev,
                    [`${prefixName}.${subFieldName}`]: {
                        ...subField,
                        name: `${prefixName}.${subFieldName}`,
                    },
                };
            },
            {} as Record<string, IField | undefined>
        );
    }
    return property;
}

export const useCarrierAccountFieldList = <TMode extends ModalMode = ModalMode>(
    params: Params<TMode>
): CombinedSchemaAndDynamicFormInfo => {
    const {t: trans} = useI18next();
    return useMemo<CombinedSchemaAndDynamicFormInfo>((): CombinedSchemaAndDynamicFormInfo => {
        const {slug, mode, isAfterUpgrade} = params;
        const courierAccountSchema = findMatchingSchemaCourierAccount(params);
        const fields = isAfterUpgrade
            ? courierAccountSchema?.upgrade_fields
            : courierAccountSchema?.fields;
        const dynamicFormInfo =
            fields?.reduce<Array<IDynamicFormInfo>>((prev, curSectionField) => {
                const title = curSectionField.title
                    ? t(labelToKeyMap[curSectionField.title], curSectionField.title, {
                          interpolation: {escapeValue: false},
                      })
                    : undefined;

                if (curSectionField.type === 'object') {
                    // fixme: type 暂时没有返回 address 类型, 这里前端先转换一下
                    if (curSectionField.name === 'address') {
                        prev.push({
                            uiType: UIField.OTHER,
                            title: trans('label.address.upcase', {defaultValue: 'ADDRESS'}),
                            type: 'address',
                            disabled: mode === ModalMode.EDIT && !curSectionField.edit,
                            // fixme: address 的 fields 没有动态下发,这里先写死
                            fields: getAddressFields(getaddressRequiredFields(slug)),
                        });
                    } else {
                        let prefixName = curSectionField.name;

                        // fixme : settings 虽然 UI 上动态渲染为新的 section,理应 payload 也是 settings.xxx,但后端还未改完全,payload 还是作为 credentials 的子字段
                        if (prefixName === 'settings') {
                            prefixName = 'credentials';
                        }
                        const fields =
                            curSectionField.fields
                                ?.filter(field => !field.subfield) // 过滤掉 subfield 为 true 的字段,代表是子字段,需要放到父字段的 property 中
                                ?.map(field => {
                                    // 处理有 subfields 的情况, 需要从 curSectionField.fields 中找到对应的 subfields,然后组合为 property 参数
                                    const property = generateProperty(
                                        field,
                                        curSectionField,
                                        prefixName
                                    );
                                    return {
                                        ...field,
                                        name: `${prefixName}.${field.name}`,
                                        label: t(
                                            labelToKeyMap[field.label] || field.label,
                                            field.label,
                                            {
                                                interpolation: {escapeValue: false},
                                            }
                                        ),
                                        property,
                                    };
                                }) ?? [];
                        prev.push({
                            title: title,
                            uiType:
                                curSectionField.name === 'credentials'
                                    ? UIField.CREDENTIALS
                                    : curSectionField.name === 'settings'
                                      ? UIField.SETTINGS
                                      : UIField.OTHER,
                            type: curSectionField.type,
                            disabled: mode === ModalMode.EDIT && !curSectionField.edit,
                            fields,
                        });
                    }
                } else {
                    prev.push({
                        title: title,
                        uiType: UIField.OTHER,
                        type: curSectionField.type,
                        disabled: mode === ModalMode.EDIT && !curSectionField.edit,
                        fields: [
                            {
                                ...curSectionField,
                                label: t(
                                    labelToKeyMap[curSectionField.label],
                                    curSectionField.label,
                                    {
                                        interpolation: {escapeValue: false},
                                    }
                                ),

                                help_text: curSectionField.help_text
                                    ? t(
                                          labelToKeyMap[curSectionField.help_text],
                                          curSectionField.help_text,
                                          {
                                              interpolation: {escapeValue: false},
                                          }
                                      )
                                    : undefined,
                            },
                        ],
                    });
                }
                return prev;
            }, [] as Array<IDynamicFormInfo>) ?? [];
        return {
            courierAccountSchema,
            dynamicFormInfo,
        };
    }, [params, trans]);
};
