import React, { TableHTMLAttributes, useCallback, useMemo } from "react";
import { cva } from "class-variance-authority";
import { CheckboxProvider, useCheckboxContext } from "./CheckboxContext";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { sizes as avatarSizes } from "#src/components/Avatar";

const defaultClasses = ["table-auto", "w-full", "text-left"] as const;
const table = cva(defaultClasses);

type ColumnType =
  | "custom"
  | "string"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "link"
  | "avatar";

/**
 * `ColumnType` defines the available types for table columns.
 * You can add new column types here, such as "date", "time", etc.,
 * to extend the functionality of the Table component.
 */
export type Column<RowType extends { id: string }> = {
  id: string;
  keyPath: string;
  header: React.ReactNode | string;
  type: ColumnType;
  sortable?: boolean;
  align?: "start" | "center" | "end";
} & (
  | {
      type: "custom";
      render: (row: RowType) => React.ReactNode;
    }
  | {
      type: "link";
      target?: "_blank" | "_self" | "_parent" | "_top";
      label?: (row: RowType) => string;
    }
  | {
      type: "avatar";
      size?: keyof typeof avatarSizes;
    }
  | { type: Exclude<ColumnType, "custom" | "link" | "avatar"> }
);

export type TableProps<RowType extends { id: string }> =
  TableHTMLAttributes<HTMLTableElement> & {
    columns: Column<RowType>[];
    rows: RowType[];
    rowHeight?: "sm" | "lg";
    selectable?: boolean;
    withVerticalBorders?: boolean;
  };

/**
 * The Table component is used to render a flexible, customizable data table that displays rows and columns of information.
 * It allows different configurations such as selectable rows with checkboxes, different row heights, and vertical borders between cells.
 * @param props.className Classname to add to the table.
 * @param props.columns Array of column data.
 * @param props.rows Array of row data.
 * @param props.rowHeight Height of the row. Can be "sm" or "lg".
 * @param props.selectable Boolean to define if the table integrates with checkboxes.
 * @param props.withVerticalBorders Boolean to define if the table has vertical borders.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-table--docs
 */
const Table = <RowType extends { id: string }>({
  className,
  columns,
  rows,
  rowHeight = "sm",
  selectable = false,
  withVerticalBorders = false,
  ...props
}: TableProps<RowType>) => {
  const InnerTableComponent = selectable ? InnerTableWithContext : InnerTable;

  return (
    <CheckboxProvider>
      <InnerTableComponent
        columns={columns}
        rows={rows}
        rowHeight={rowHeight}
        selectable={selectable}
        withVerticalBorders={withVerticalBorders}
        className={className}
        {...props}
      />
    </CheckboxProvider>
  );
};

const InnerTableWithContext = <RowType extends { id: string }>({
  className,
  columns,
  rows,
  rowHeight = "sm",
  selectable,
  withVerticalBorders,
  ...props
}: TableProps<RowType>) => {
  const { selectedValues, toggleCheckbox, setSelectedValues } =
    useCheckboxContext();

  const areAllSelected = useMemo(
    () => rows.length > 0 && selectedValues.length === rows.length,
    [rows, selectedValues],
  );

  const areSomeSelected = useMemo(
    () => selectedValues.length > 0 && selectedValues.length < rows.length,
    [rows, selectedValues],
  );

  const handleSelectAllChange = useCallback(() => {
    setSelectedValues(
      areAllSelected || areSomeSelected ? [] : rows.map((row) => row.id),
    );
  }, [areAllSelected, areSomeSelected, rows, setSelectedValues]);

  const handleCheckboxChange = useCallback(
    (rowId: string) => toggleCheckbox(rowId),
    [toggleCheckbox],
  );

  return (
    <table
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
        rowHeight={rowHeight}
        withVerticalBorders={withVerticalBorders}
      />
      <tbody role="rowgroup">
        {rows.map((row) => (
          <TableRow
            key={row.id}
            row={row}
            rowId={row.id}
            columns={columns}
            selectable={selectable}
            handleCheckboxChange={handleCheckboxChange}
            selected={selectedValues.includes(row.id)}
            rowHeight={rowHeight}
            withVerticalBorders={withVerticalBorders}
          />
        ))}
      </tbody>
    </table>
  );
};

const InnerTable = <RowType extends { id: string }>({
  columns,
  rows,
  ...props
}: TableProps<RowType>) => (
  <InnerTableWithContext
    {...props}
    columns={columns}
    rows={rows}
    selectable={false}
  />
);

export default Table;
