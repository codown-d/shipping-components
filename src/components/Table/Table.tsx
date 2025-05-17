import {Checkbox, Pagination} from '@shopify/polaris';
import classNames from 'classnames';
import React, {useCallback} from 'react';
import {
    Row,
    Hooks,
    useTable,
    CellProps,
    TableState,
    HeaderProps,
    useRowSelect,
    TableOptions,
    TableInstance,
    usePagination,
    ColumnInstance,
    UseRowSelectState,
    UsePaginationState,
    UseRowSelectOptions,
    UsePaginationOptions,
    UseRowSelectRowProps,
    TableToggleCommonProps,
    UseRowSelectInstanceProps,
    UsePaginationInstanceProps,
    Cell,
} from 'react-table';

import styles from './Table.module.scss';

type TableToggleSelectedProps = Omit<TableToggleCommonProps, 'onChange'> & {
    disabled: boolean;
    onChange: (checked: boolean) => void;
};
type TableCellProps<T extends Record<string, any>> = CellProps<T> & {
    row: Row<T> &
        Omit<UseRowSelectRowProps<T>, 'getToggleRowSelectedProps'> & {
            getToggleRowSelectedProps: (
                props?: Partial<TableToggleSelectedProps>
            ) => TableToggleSelectedProps;
        };
};
type TableHeaderProps<T extends Record<string, any>> = HeaderProps<T> &
    Omit<UseRowSelectInstanceProps<T>, 'getToggleAllRowsSelectedProps'> & {
        getToggleAllRowsSelectedProps: (
            props?: Partial<TableToggleSelectedProps>
        ) => TableToggleSelectedProps;
    };

function IndeterminateCheckbox({
    title,
    checked,
    disabled,
    onChange: onChangeProp,
    indeterminate,
}: TableToggleSelectedProps) {
    const onChange = (checked: boolean) => {
        if (typeof onChangeProp === 'function') {
            onChangeProp(checked);
        }
    };

    return (
        <Checkbox
            label={title}
            checked={indeterminate ? 'indeterminate' : checked}
            disabled={disabled}
            onChange={onChange}
            labelHidden
        />
    );
}

const noop = () => {};

let disabledRowIdList: string[] = [];

const getRowSelectCheckboxHook =
    (checkable = false, disabledList: string[] = []) =>
    <T extends Record<string, any>>({visibleColumns}: Hooks<T>) => {
        disabledRowIdList = disabledList;
        visibleColumns.push(columns => [
            {
                id: 'selection',
                Cell: ({row}: TableCellProps<T>) => {
                    const disabled = disabledRowIdList.length
                        ? disabledRowIdList.includes(row.id)
                        : false;
                    const props = {
                        ...row.getToggleRowSelectedProps({
                            onChange: checkable
                                ? checked => {
                                      row.toggleRowSelected(checked);
                                  }
                                : noop,
                            disabled,
                        }),
                    };

                    return <IndeterminateCheckbox {...props} />;
                },
                width: '1%',
                Header: ({
                    toggleAllRowsSelected,
                    getToggleAllRowsSelectedProps,
                }: TableHeaderProps<T>) => {
                    const props = getToggleAllRowsSelectedProps({
                        onChange: checked => {
                            toggleAllRowsSelected(checked);
                        },
                    });

                    return <IndeterminateCheckbox {...props} />;
                },
            } as ColumnInstance<T>,
            ...columns,
        ]);
    };

export const useRowSelectCheckbox = getRowSelectCheckboxHook();

export const useRowSelectCheckable = (disabledList: string[]) =>
    getRowSelectCheckboxHook(true, disabledList);

interface BaseTableProps {
    isHeaderSticky?: boolean;
    isFooterSticky?: boolean;
}

interface TableProps<T extends Record<string, any>> extends BaseTableProps {
    table: TableInstance<T>;
    onRowClick?: (row: Row<T>) => void;
    onCellClick?: (cell: Cell<T>) => void;
    rowClassName?: string | ((row: Row<T>) => string);
}

export function Table<T extends Record<string, any>>({
    table,
    onRowClick,
    onCellClick,
    isHeaderSticky,
    rowClassName,
}: TableProps<T>) {
    const {rows, prepareRow, headerGroups, getTableProps, getTableBodyProps} = table;

    return (
        <table {...getTableProps()} className={styles.table}>
            <thead>
                {headerGroups.map(({headers, getHeaderGroupProps}) => (
                    <tr {...getHeaderGroupProps()}>
                        {headers.map(({width, render, getHeaderProps}) => {
                            const {style, className, ...headerProps} = getHeaderProps();

                            return (
                                <th
                                    {...headerProps}
                                    style={{...style, width}}
                                    className={classNames(
                                        className,
                                        styles.header,
                                        isHeaderSticky ? styles.isSticky : undefined
                                    )}
                                >
                                    {render('Header')}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>

            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    const {cells, getRowProps} = row;
                    const {className, ...rowProps} = getRowProps();
                    const onClick = () =>
                        typeof onRowClick === 'function' ? onRowClick(row) : undefined;

                    const trClassName =
                        typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

                    return (
                        <tr
                            {...rowProps}
                            onClick={onClick}
                            className={classNames(className, styles.row, trClassName, {
                                [styles.isClickable]: typeof onRowClick === 'function',
                            })}
                        >
                            {cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    onClick={() => {
                                        onCellClick?.(cell);
                                    }}
                                    className={classNames(styles.cell, {
                                        [styles.isClickable]: typeof onCellClick === 'function',
                                    })}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export type SelectableTableState<T extends Record<string, any>> = TableState<T> &
    UseRowSelectState<T>;

export type SelectableTableInstance<T extends Record<string, any>> = TableInstance<T> &
    UseRowSelectInstanceProps<T> & {
        state: SelectableTableState<T>;
    };

export function useSelectableTable<T extends Record<string, any>>(
    options: TableOptions<T> &
        UseRowSelectOptions<T> & {
            initialState?: TableState<T> & Partial<UseRowSelectState<T>>;
        }
) {
    return useTable<T>(options, useRowSelect, useRowSelectCheckbox) as SelectableTableInstance<T>;
}

interface SelectableTableProps<T extends Record<string, any>> extends TableProps<T> {
    table: SelectableTableInstance<T>;
}

export function SelectableTable<T extends Record<string, any>>(props: SelectableTableProps<T>) {
    const onRowClick = useCallback(
        ({id}: Row<T>) => {
            props.table.toggleRowSelected(id);
        },
        [props.table]
    );

    return <Table {...props} onRowClick={onRowClick} />;
}

export type PaginatedTableState<T extends Record<string, any>> = TableState<T> &
    UsePaginationState<T>;

export type PaginatedTableInstance<T extends Record<string, any>> = TableInstance<T> &
    UsePaginationInstanceProps<T> & {
        state: PaginatedTableState<T>;
    };

interface PaginatedTableProps<T extends Record<string, any>> extends TableProps<T> {
    table: PaginatedTableInstance<T>;
    onNext?: () => void;
    onPrevious?: () => void;
}

export function usePaginatedTable<T extends Record<string, any>>(
    options: TableOptions<T> &
        UsePaginationOptions<T> & {
            initialState?: Partial<PaginatedTableState<T>>;
        }
) {
    return useTable<T>(options, usePagination) as PaginatedTableInstance<T>;
}
