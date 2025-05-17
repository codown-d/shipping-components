export interface IPreAssignedNumberConfig {
    input_method: 'RANGE' | 'VALUES';
    id: string;
    slug: string;
    enabled: boolean;
    shared: boolean;
    fields: string[];
    pool_template: {
        id: string;
        replace: string[];
    };
    tracking_number_regex: string;
    tracking_number_min_length: string;
    tracking_number_max_length: string;
    label: string;
    instruction: string;
}

// Only define the fields that will be used
export interface ICourierSlugData {
    pre_assigned_number_configs: IPreAssignedNumberConfig[];
}

export interface ISlot {
    id: string;
    pool: string;
    service_type: null;
    shipper_account_id: string;
    description: string;
    type: 'range' | 'values';
    min: string;
    max: string;
    available_count: number;
    state: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    slug: string;
    shared: null;
    data: string[];
}

export interface INumberPoolsData {
    count: null;
    slots: ISlot[];
}
