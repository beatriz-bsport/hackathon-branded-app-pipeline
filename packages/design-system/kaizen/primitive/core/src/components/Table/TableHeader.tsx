import React, { useMemo } from "react";
import Body from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";
import { Column } from "./Table";
import TableCell from "./TableCell";

type TableHeaderProps<RowType extends { id: string }> = {
  columns: Column<RowType>[];
  selectable?: boolean;
  areAllSelected?: boolean;
  areSomeSelected?: boolean;
  handleSelectAllChange?: () => void;
  rowHeight?: "sm" | "lg";
  withVerticalBorders?: boolean;
};

const TableHeader = <RowType extends { id: string }>({
  columns,
  selectable = false,
  areAllSelected = false,
  areSomeSelected = false,
  handleSelectAllChange,
  rowHeight = "sm",
  withVerticalBorders = false,
}: TableHeaderProps<RowType>): React.ReactElement => {
  const selectAllValue = useMemo(
    () =>
      areAllSelected
        ? "checked"
        : areSomeSelected
          ? "indeterminate"
          : "unchecked",
    [areAllSelected, areSomeSelected],
  );

  return (
    <thead>
      <tr className="bg-surface-default-weaker">
        {selectable && (
          <TableCell
            isHeader
            withVerticalBorders={withVerticalBorders}
            rowHeight={rowHeight}
          >
            <Checkbox
              value={selectAllValue}
              id="select-all"
              onChange={handleSelectAllChange}
            />
          </TableCell>
        )}
        {columns.map((col) => (
          <TableCell
            key={col.id}
            isHeader
            withVerticalBorders={withVerticalBorders}
            rowHeight={rowHeight}
            align={col.align}
          >
            <Body htmlVariant="span">{col.header}</Body>
          </TableCell>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
