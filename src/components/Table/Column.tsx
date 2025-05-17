import classNames from 'classnames';
import get from 'lodash/get';
import React, {ComponentType} from 'react';
import {Column, Renderer, Accessor, CellProps, HeaderProps} from 'react-table';
import {sentenceCase} from 'sentence-case';

import styles from './Column.module.scss';

export enum ColumnAlignment {
    End = 'end',
    Start = 'start',
    Center = 'center',
}

interface ColumnCellProps<T extends {}> extends CellProps<T> {
    alignment?: ColumnAlignment;
}

const Cell = <T extends {}>({value, alignment}: ColumnCellProps<T>) => {
    return alignment ? (
        <div
            className={classNames(styles.cell, {
                [styles.cellEnd]: alignment === ColumnAlignment.End,
                [styles.cellStart]: alignment === ColumnAlignment.Start,
                [styles.cellCenter]: alignment === ColumnAlignment.Center,
            })}
        >
            {value}
        </div>
    ) : (
        value
    );
};

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
    T extends object
        ? {
              [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
          }[Exclude<keyof T, symbol>]
        : ''
) extends infer D
    ? Extract<D, string>
    : never;

interface ObjectColumnBaseConfig<T extends {}> {
    key: string;
    Cell?: ComponentType<CellProps<T>>;
    width?: number | string;
    Header?: Renderer<HeaderProps<T>>;
    accessor?: Accessor<T>;
    alignment?: ColumnAlignment;
}

interface ObjectColumnCellConfig<T extends {}> extends ObjectColumnBaseConfig<T> {
    Cell: ComponentType<CellProps<T>>;
}

interface ObjectColumnKeyedConfig<T extends {}> extends ObjectColumnBaseConfig<T> {
    key: DotNestedKeys<T>;
}

interface ObjectColumnAccessorConfig<T extends {}> extends ObjectColumnBaseConfig<T> {
    accessor: Accessor<T>;
}

export type ColumnConfig<T extends {}> =
    | DotNestedKeys<T>
    | ObjectColumnCellConfig<T>
    | ObjectColumnKeyedConfig<T>
    | ObjectColumnAccessorConfig<T>;

export const defaultCellRenderer = <T extends {}>({value}: CellProps<T>) => value;

export function makeColumns<T extends {}>(configs: ColumnConfig<T>[]): Column<T>[] {
    return configs.map<Column<T>>(config =>
        typeof config === 'string'
            ? {
                  id: config,
                  Header: sentenceCase(config),
                  accessor: item => get(item, config),
              }
            : {
                  id: config.key,
                  Cell: config.alignment
                      ? ({value, ...props}: CellProps<T>) => (
                            <Cell
                                {...props}
                                value={
                                    config.Cell ? <config.Cell {...props} value={value} /> : value
                                }
                                alignment={config.alignment}
                            />
                        )
                      : defaultCellRenderer,
                  width: config.width,
                  Header: config.Header || sentenceCase(config.key),
                  accessor: config.accessor || (item => get(item, config.key)),
              }
    );
}
