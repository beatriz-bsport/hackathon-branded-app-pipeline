import React, { useMemo } from "react";

import Body from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";

import TableCell from "./TableCell";
import type { BaseRow, Column } from "./types";

/**
 * Props for the TableHeader component.
 *
 * @template RowType - The type of data objects in each table row, extending BaseRow
 */
type TableHeaderProps<RowType extends BaseRow> = {
  /** Array of column configurations defining header content and alignment */
  columns: Column<RowType>[];
  /** Whether the table supports row selection with checkboxes */
  selectable: boolean;
  /** Whether all rows are currently selected */
  areAllSelected?: boolean;
  /** Whether some (but not all) rows are currently selected */
  areSomeSelected?: boolean;
  /** Callback function triggered when the "select all" checkbox is toggled */
  handleSelectAllChange?: () => void;
  /** Whether to display vertical borders between header cells */
  withVerticalBorders: boolean;
  withHorizontalDivider: boolean;
};

/**
 * Renders the header section of a table with column titles and optional selection controls.
 *
 * The TableHeader component creates a styled header row that displays column headers
 * and manages the "select all" checkbox functionality when selection is enabled.
 * It handles the visual state of the select-all checkbox (checked, unchecked, indeterminate)
 * based on the current selection state.
 *
 * ## Features
 * - **Column Headers**: Displays header text with proper typography and alignment
 * - **Select All**: Optional checkbox for selecting/deselecting all rows
 * - **Indeterminate State**: Shows partial selection state when some rows are selected
 * - **Accessibility**: Proper ARIA attributes and semantic HTML structure
 * - **Styling**: Consistent header styling with configurable borders
 *
 * ## Selection States
 * - **Unchecked**: No rows selected
 * - **Checked**: All rows selected
 * - **Indeterminate**: Some rows selected (mixed state)
 *
 * @template RowType - The type of data objects in each table row
 * @param props - TableHeader configuration and state
 * @returns Rendered table header component
 *
 * @see {@link Column} Column configuration options
 * @see {@link TableCell} Individual cell component
 */

const TableHeader = <RowType extends BaseRow>({
  columns,
  selectable,
  areAllSelected = false,
  areSomeSelected = false,
  handleSelectAllChange,
  withVerticalBorders,
  withHorizontalDivider,
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
            withHorizontalDivider={withHorizontalDivider}
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
            withHorizontalDivider={withHorizontalDivider}
            rowHeight="sm"
            align={col.align}
            className={col.type === "copy" ? "px-md" : ""}
          >
            <Body htmlVariant="span">{col.header}</Body>
          </TableCell>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;
