export interface Pagination {
    page: number;
    limit: number;
    total: number;
    has_next_page: boolean;
}

export interface ErrorBody {
    code: number;
    details: ErrorDetail[];
    message: string;
    retryable: boolean;
}

export interface ResponseMetaError {
    path: string | null;
    info: ErrorBody | string;
}

interface ResponseMeta<Type extends string = string> {
    code: number;
    type: Type;
    errors?: Type extends 'OK' ? undefined : ResponseMetaError[];
    message: string;
}

interface PaginatedData {
    pagination: Pagination;
}
type ResponseData<T, Key extends string = '', Paginated extends boolean = false> = Key extends ''
    ? T
    : Paginated extends false
      ? {[key in Key]: T}
      : {[key in Key]: T} & PaginatedData;

interface BaseResponse<T, Key extends string = '', Paginated extends boolean = false> {
    meta: ResponseMeta;
    data?: ResponseData<T, Key, Paginated>;
}
interface SuccessResponse<T = unknown, Key extends string = '', Paginated extends boolean = false>
    extends BaseResponse<T, Key, Paginated> {
    meta: ResponseMeta<'OK'>;
    data: ResponseData<T, Key, Paginated>;
}
interface FailureResponse<T = unknown, Key extends string = '', Paginated extends boolean = false>
    extends BaseResponse<T, Key, Paginated> {
    meta: ResponseMeta;
    data?: undefined;
}
type ResponseBody<T = unknown, Key extends string = '', Paginated extends boolean = false> =
    | SuccessResponse<T, Key, Paginated>
    | FailureResponse<T, Key, Paginated>;

interface IDOnly {
    id: string;
}

export interface OpenShipmentBody {
    count: number;
    courier_account_id: string;
    ship_from_location_id: string;
}

interface ErrorDetail {
    path: string;
    info: string;
}

export interface ManifestBody {
    id: string;
    err: ErrorBody;
    files: {
        manifest: {
            url: string;
        };
    };
    status: ManifestStatus;
    label_ids: string[];
    created_at: string;
    updated_at: string;
    shipment_ids: string[];
    organization: IDOnly;
    courier_account: IDOnly;
    label_ship_date: string;
    ship_from_location: IDOnly;
}

export type OpenShipmentsResponse = ResponseBody<OpenShipmentBody[], 'summary'>;

export function isSuccessResponse<
    T = unknown,
    Key extends string = '',
    Paginated extends boolean = false,
>(response: ResponseBody<T, Key, Paginated>): response is SuccessResponse<T, Key, Paginated> {
    return !isEmpty(response.data);
}

export const isErrorBody = (error?: ErrorBody | ResponseMeta): error is ErrorBody =>
    !!error && 'details' in error && Array.isArray(error.details);
