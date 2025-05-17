import {Select, SelectProps, SelectGroup, SelectOption} from '@shopify/polaris';
import get from 'lodash/get';
import React, {FC} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

export interface StrictOption {
    /** Machine value of the option; this is the value passed to `onChange` */
    value: string;
    /** Human-readable text for the option */
    label: string;
    /** Option will be visible, but not selectable */
    disabled?: boolean;
}

interface HideableStrictOption extends StrictOption {
    hidden?: boolean;
}

interface StrictGroup {
    /** Title for the group */
    title: string;
    /** List of options */
    options: StrictOption[];
}

function isGroup(option: SelectOption | SelectGroup): option is SelectGroup {
    return typeof option === 'object' && 'options' in option && option.options != null;
}

function normalizeStringOption(option: string): StrictOption {
    return {
        label: option,
        value: option,
    };
}

function isString(option: SelectOption | SelectGroup): option is string {
    return typeof option === 'string';
}

function getSelectedOption(
    options: (HideableStrictOption | StrictGroup)[],
    value: string
): boolean {
    const flatOptions = flattenOptions(options);
    const selectedOption = flatOptions.find(option => value === option.value);

    return Boolean(selectedOption);
}

/**
 * Ungroups an options array
 */
function flattenOptions(options: (HideableStrictOption | StrictGroup)[]): HideableStrictOption[] {
    let flatOptions: HideableStrictOption[] = [];

    options.forEach(optionOrGroup => {
        if (isGroup(optionOrGroup)) {
            flatOptions = flatOptions.concat((optionOrGroup as StrictGroup).options);
        } else {
            flatOptions.push(optionOrGroup as StrictOption);
        }
    });

    return flatOptions;
}

/**
 * Converts a string option (and each string option in a Group) into
 * an Option object.
 */
function normalizeOption(option: SelectOption | SelectGroup): HideableStrictOption | StrictGroup {
    if (isString(option)) {
        return normalizeStringOption(option);
    }

    if (isGroup(option)) {
        const {title, options} = option;
        return {
            title,
            options: options.map(op => {
                return isString(op) ? normalizeStringOption(op) : op;
            }),
        };
    }

    return option;
}

export type Props = SelectProps & {
    name: string;
    watchForOptions?: {
        watchName: string;
        watchAdaptor: (watchValue: any) => SelectProps['options'];
    };
    defaultValue?: string | null;
};

const WrappedSelect: FC<Props> = ({name = '', label, watchForOptions, defaultValue, ...rest}) => {
    const methods = useFormContext();
    const watchValue = methods.watch(watchForOptions?.watchName ?? '');

    const watchedOptionProps = watchForOptions
        ? {
              options: watchForOptions?.watchAdaptor(watchValue),
          }
        : undefined;

    const currentValue = methods.watch(name);

    const isValueFoundInOptions = getSelectedOption(
        ({...rest}.options ?? watchForOptions?.watchAdaptor(watchValue))?.map(normalizeOption) ??
            [],
        currentValue
    );

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            render={({onChange, value}) => {
                return (
                    <Select
                        value={isValueFoundInOptions ? value : ''}
                        label={label}
                        {...watchedOptionProps}
                        {...rest}
                        error={get(methods?.errors, name, {})?.message}
                        onChange={(value, id) => {
                            onChange(value, id);
                            rest.onChange && rest.onChange(value, id);
                        }}
                    />
                );
            }}
            // NOTICE: polaris Select only select placeholder when value is empty string
            // we transform undefined and null to empty string here
            onChange={(v: any) => {
                return v;
            }}
            control={methods.control}
        />
    );
};

export default WrappedSelect;
