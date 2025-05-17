import {OpenAPIV3} from 'openapi-types';
import {TestOptions} from 'yup';

export interface Field {
    name: string;
    type: string;
    label: string;
    enum: string[];
    max_length?: number | null;
    min_length?: number | null;
    required?: boolean;
    placeholder?: string;
    items?: string[] | null;
    helpText?: string;
    test?: TestOptions;
}

export interface JsonSchemaField
    extends Omit<OpenAPIV3.NonArraySchemaObject, 'type' | 'required' | 'enum'> {
    name: string;
    type?: OpenAPIV3.NonArraySchemaObjectType | 'array';
    label: string;
    enum?: string[];
    max_length?: number | null;
    min_length?: number | null;
    required?: boolean;
    placeholder?: string;
    items?: string[] | null;
    helpText?: string;
    test?: TestOptions;
    self?: string;
}
