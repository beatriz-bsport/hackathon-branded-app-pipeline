import { cva } from "class-variance-authority";
import React, { TableHTMLAttributes, useCallback } from "react";

import type { PaginationProps } from "#src/components/private/Pagination";
import {
  CheckboxProvider,
  useCheckboxContext,
} from "#src/contexts/CheckboxContext";
import useEmptyState, {
  type UseEmptyStateProps,
} from "#src/hooks/use-empty-state.hook";
import {
  type UseLoadingStateProps,
  useLoadingState,
} from "#src/hooks/use-loading-state";
import { usePagination } from "#src/hooks/use-pagination";

import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import type { BaseRow, Column } from "./types";

const defaultClasses = ["table", "table-auto", "w-full", "text-left"] as const;
const table = cva(defaultClasses);

/**
 * `ColumnType` defines the available types for table columns.
 * You can add new column types here, such as "date", "time", etc.,
 * to extend the functionality of the Table component.
 *
 * - type: "avatar" renders an Avatar component using the value at keyPath (string or object with src/alt), with optional size.
 * - type: "copy" renders a CopyToClipboard button for the value at keyPath. You can pass extra props for the button (e.g., tooltip, toastMessage, etc.).
 * - type: "custom" renders a custom React node using the render(row) function you provide.
 * - type: "date" renders a string value as a formatted date.
 * - type: "datetime" renders a string value as a formatted date and time.
 * - type: "link" renders a link using the value at keyPath, with optional target and label(row) function.
 * - type: "number" renders a number value from keyPath, formatted for the current locale.
 * - type: "price" renders a number value as a formatted price, with optional priceColoring for positive/negative values.
 * - type: "string" renders a string value from keyPath as plain text.
 * - type: "time" renders a string value as a formatted time.
 */
export type TableProps<RowType extends BaseRow> =
  TableHTMLAttributes<HTMLTableElement> & {
    columns: Column<RowType>[];
    rows: RowType[];
    rowHeight?: "sm" | "lg";
    selectable?: boolean;
    withVerticalBorders?: boolean;
    paginationProps?: PaginationProps;
    emptyStateProps?: UseEmptyStateProps;
    loadingProps?: UseLoadingStateProps;
  };

/**
 * The Table component is used to render a flexible, customizable data table that displays rows and columns of information.
 * It allows different configurations such as selectable rows with checkboxes, different row heights, and vertical borders between cells.
 * @param props.className Classname to add to the table.
 * @param props.columns Array of column data.
 * @param emptyStateProps [Optional] Dictionnary of props to manage the empty state rendering
 * - emptyConfig [Optional] Configuration to display the empty state UI when isEmpty is true;
 * - emptySearchConfig [Optional] Configuration to display the empty search UI when isEmptySearch is true;
 * - isEmpty [Optional] Whether the fetch return an empty list;
 * - isEmptySearch [Optional] Whether the filtering return an empty list;
 * @param props.rows Array of row data.
 * @param props.rowHeight Height of the row. Can be "sm" or "lg".
 * @param props.selectable Boolean to define if the table integrates with checkboxes.
 * @param props.withVerticalBorders Boolean to define if the table has vertical borders.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-table--docs
 */
const Table = <RowType extends BaseRow>({
  className,
  columns,
  rows,
  rowHeight = "sm",
  selectable = false,
  withVerticalBorders = false,
  paginationProps,
  emptyStateProps,
  loadingProps,
  ...props
}: TableProps<RowType>) => {
  const valueIds = rows?.map((row) => row.id.toString()) ?? [];

  const renderedPagination = usePagination(paginationProps);
  const { shouldRenderEmptyState, EmptyState } = useEmptyState(emptyStateProps);
  const { shouldRenderLoadingState, LoadingState } =
    useLoadingState(loadingProps);

  if (shouldRenderLoadingState) {
    return <LoadingState />;
  }

  if (shouldRenderEmptyState) {
    return <EmptyState />;
  }

  return (
    <CheckboxProvider valueIds={valueIds}>
      <InnerTableWithContext
        columns={columns}
        rows={rows}
        rowHeight={rowHeight}
        selectable={selectable}
        withVerticalBorders={withVerticalBorders}
        className={className}
        {...props}
      />
      {renderedPagination}
    </CheckboxProvider>
  );
};

const InnerTableWithContext = <RowType extends BaseRow>({
  className,
  columns,
  rows,
  rowHeight = "sm",
  selectable,
  withVerticalBorders,
  ...props
}: TableProps<RowType>) => {
  const {
    areAllSelected,
    areSomeSelected,
    selectedValues,
    toggleCheckbox,
    setSelectedValues,
  } = useCheckboxContext();

  const handleSelectAllChange = useCallback(() => {
    setSelectedValues(
      areAllSelected || areSomeSelected
        ? []
        : rows.map((row) => row.id.toString()),
    );
  }, [areAllSelected, areSomeSelected, rows, setSelectedValues]);

  const handleCheckboxChange = useCallback(
    (rowId: string) => toggleCheckbox(rowId),
    [toggleCheckbox],
  );

  return (
    <div
      className={table({ className })}
      {...props}
      aria-labelledby="table"
      role="table"
    >
      <TableHeader
        columns={columns}
        selectable={selectable}
        areAllSelected={areAllSelected}
        areSomeSelected={areSomeSelected}
        handleSelectAllChange={handleSelectAllChange}
        withVerticalBorders={withVerticalBorders}
      />
      <div className="table-row-group" role="rowgroup">
        {rows.map((row) => (
          <TableRow
            key={row.id}
            row={row}
            rowId={row.id.toString()}
            columns={columns as Column<BaseRow>[]}
            selectable={selectable}
            handleCheckboxChange={handleCheckboxChange}
            selected={selectedValues.includes(row.id.toString())}
            rowHeight={rowHeight}
            withVerticalBorders={withVerticalBorders}
            link={row.link}
            color={row.color}
            className="contents"
            onRowClick={() => row.onRowClick?.()}
          />
        ))}
      </div>
    </div>
  );
};

Table.displayName = "KaizenTable";

export default Table;
