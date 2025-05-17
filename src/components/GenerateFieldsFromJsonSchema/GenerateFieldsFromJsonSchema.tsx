import React, {FC} from 'react';

import CheckboxController from '@/components/FormFields/Checkbox';
import Select from '@/components/FormFields/Select';
import TextFieldController from '@/components/FormFields/TextField';
import {JsonSchemaField} from '@/types/form';
import {mapCountriesCodeToCountryOptions} from '@/utils/countries';

export interface Props {
    fields: JsonSchemaField[];
    wrapper?: React.NamedExoticComponent;
    isDisabled: boolean;
}

const GenerateFieldsFromJsonSchema: FC<Props> = ({
    fields,
    wrapper: Wrapper = React.Fragment,
    isDisabled,
}) => {
    return (
        <Wrapper>
            {fields.map(field => {
                if (field?.self === 'password') {
                    return (
                        <TextFieldController
                            placeholder={field?.placeholder}
                            key={field?.name}
                            name={field?.name}
                            label={field?.label}
                            type="password"
                            helpText={field?.helpText}
                            disabled={isDisabled}
                        />
                    );
                }

                if (field?.name === 'country') {
                    return (
                        <Select
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            options={mapCountriesCodeToCountryOptions(field.enum || [])}
                            defaultValue="USA"
                            disabled={isDisabled}
                        />
                    );
                }

                if (field?.type === 'boolean') {
                    return (
                        <CheckboxController
                            label={field?.label}
                            name={field?.name}
                            key={field?.name}
                            defaultValue={false}
                            disabled={isDisabled}
                        />
                    );
                }

                if (field?.type === 'string') {
                    return (
                        <TextFieldController
                            placeholder={field?.placeholder}
                            key={field?.name}
                            name={field?.name}
                            label={field?.label}
                            helpText={field?.helpText}
                            disabled={isDisabled}
                        />
                    );
                }

                return null;
            })}
        </Wrapper>
    );
};

export default GenerateFieldsFromJsonSchema;
