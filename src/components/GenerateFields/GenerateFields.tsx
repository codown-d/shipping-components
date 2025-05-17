import React, {FC} from 'react';

import TextFieldController from '@/components/FormFields/TextField';
import {Field} from '@/types/form';

export interface Props {
    fields: Field[];
    wrapper?: React.NamedExoticComponent;
}

const GenerateFields: FC<Props> = ({fields, wrapper: Wrapper = React.Fragment}) => {
    return (
        <Wrapper>
            {(fields as Field[]).map(field => {
                if (field?.type === 'string') {
                    return (
                        <TextFieldController
                            placeholder={field?.placeholder}
                            key={field?.name}
                            name={field?.name}
                            label={field?.label}
                            helpText={field?.helpText}
                        />
                    );
                }
                return null;
            })}
        </Wrapper>
    );
};

export default GenerateFields;
