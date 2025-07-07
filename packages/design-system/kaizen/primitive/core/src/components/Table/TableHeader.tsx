import React, { useMemo } from "react";

import Body from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";

import TableCell from "./TableCell";
import type { BaseRow, Column } from "./types";

type TableHeaderProps<RowType extends BaseRow> = {
  columns: Column<RowType>[];
  selectable?: boolean;
  areAllSelected?: boolean;
  areSomeSelected?: boolean;
  handleSelectAllChange?: () => void;
  withVerticalBorders?: boolean;
};

const TableHeader = <RowType extends BaseRow>({
  columns,
  selectable = false,
  areAllSelected = false,
  areSomeSelected = false,
  handleSelectAllChange,
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
    <div className="table-header-group">
      <div className="table-row bg-surface-default-weaker">
        {selectable && (
          <TableCell
            isHeader
            withVerticalBorders={withVerticalBorders}
            rowHeight="sm"
            align="center"
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
            rowHeight="sm"
            align={col.align}
          >
            <Body htmlVariant="span">{col.header}</Body>
          </TableCell>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;
