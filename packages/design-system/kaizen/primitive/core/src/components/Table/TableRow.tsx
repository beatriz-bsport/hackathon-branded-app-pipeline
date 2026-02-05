import classNames from "classnames";
import React, { useCallback, useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import Avatar from "#src/components/Avatar";
import Body, { BodyColor } from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";
import ColorIndicator from "#src/components/ColorIndicator";
import CopyToClipboard from "#src/components/CopyToClipboard";
import withLink from "#src/components/private/withLink";
import { useKaizenI18nInstance } from "#src/i18n";

import TableCell from "./TableCell";
import { BaseRow, Column } from "./types";

/**
 * Props for the TableRow component.
 *
 * @template RowType - The type of data objects in each table row, extending BaseRow
 */
type TableRowProps<RowType extends BaseRow> = {
  /** The data object for this row */
  row: RowType;
  /** Unique identifier for this row (stringified row.id) */
  rowId: string;
  /** Array of column configurations defining how to render each cell */
  columns: Column<RowType>[];
  /** Whether this table supports row selection */
  selectable: boolean;
  /** Callback function triggered when the row's checkbox state changes */
  handleCheckboxChange?: (id: string) => void;
  /** Whether this row is currently selected */
  selected?: boolean;
  /** Height variant for this row */
  rowHeight: "sm" | "lg";
  /** Whether to display an horizontal divider under the row */
  withHorizontalDivider: boolean;
  /** Whether to display vertical borders between cells */
  withVerticalBorders: boolean;
  /** Callback function triggered when the row is clicked */
  onRowClick?: () => void;
  /** Whether this row is in an active state (highlighted) */
  isActive?: boolean;
};

/**
 * Type-safe utility function to resolve deep object paths.
 *
 * Safely extracts values from nested object properties using dot notation.
 * For example, "user.profile.name" will resolve to obj.user.profile.name.
 *
 * @template T - The type of the source object
 * @param obj - The object to extract the value from
 * @param path - Dot-separated path to the desired property
 * @returns The resolved value or undefined if path doesn't exist
 */
const resolveDeepPath = <T,>(obj: T, path: string): unknown => {
  return path.split(".").reduce((acc, part) => {
    return acc && (acc as Record<string, unknown>)[part];
  }, obj as unknown);
};

const TableRow = withLink(
  <RowType extends BaseRow>({
    row,
    rowId,
    columns,
    selectable,
    handleCheckboxChange,
    selected = false,
    rowHeight,
    withVerticalBorders,
    withHorizontalDivider,
    onRowClick,
    isActive,
  }: TableRowProps<RowType>): React.ReactElement => {
    const i18nInstance = useKaizenI18nInstance();
    const intlLocale = i18nInstance?.language;

    const handleChange = useCallback(() => {
      handleCheckboxChange?.(rowId);
    }, [handleCheckboxChange, rowId]);

    const getPriceColor = (
      value: number,
      priceColoring?: { positive?: BodyColor; negative?: BodyColor },
    ) => {
      if (!priceColoring) return undefined;
      if (value > 0 && priceColoring.positive) return priceColoring.positive;
      if (value < 0 && priceColoring.negative) return priceColoring.negative;
    };

    const renderedCells = useMemo(
      () =>
        columns.map((col, index) => {
          const value =
            col.type !== "custom" && resolveDeepPath(row, col.keyPath);

          const content =
            col.type === "custom" && col.render ? (
              col.render(row)
            ) : col.type === "string" ? (
              <Body htmlVariant="span" size="md" className={col.cellsClassName}>
                {value as React.ReactNode}
              </Body>
            ) : col.type === "number" ? (
              <Body htmlVariant="span" size="md" className={col.cellsClassName}>
                {new Intl.NumberFormat(intlLocale).format(value as number)}
              </Body>
            ) : col.type === "price" ? (
              <Body
                htmlVariant="span"
                size="md"
                color={getPriceColor(value as number, col.priceColoring)}
                className={col.cellsClassName}
              >
                {typeof value === "number" && !isNaN(value)
                  ? getCurrencyDisplayWithPrice(value as number)
                  : typeof value}
              </Body>
            ) : col.type === "date" ? (
              <Body htmlVariant="span" size="md" className={col.cellsClassName}>
                {new Intl.DateTimeFormat(intlLocale, {
                  dateStyle: "medium",
                }).format(new Date(value as string))}
              </Body>
            ) : col.type === "datetime" ? (
              <Body htmlVariant="span" size="md" className={col.cellsClassName}>
                {new Intl.DateTimeFormat(intlLocale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(value as string))}
              </Body>
            ) : col.type === "time" ? (
              <Body htmlVariant="span" size="md" className={col.cellsClassName}>
                {new Intl.DateTimeFormat(intlLocale, {
                  timeStyle: "short",
                }).format(new Date(value as string))}
              </Body>
            ) : col.type === "avatar" ? (
              <Avatar
                src={
                  typeof value === "string"
                    ? value
                    : (value as { src: string | undefined })?.src
                }
                shape="squared"
                alt={
                  value &&
                  typeof value === "object" &&
                  "alt" in value &&
                  typeof value.alt === "string"
                    ? value.alt
                    : ""
                }
                size={col.size}
                className={col.cellsClassName}
              />
            ) : col.type === "copy" ? (
              <CopyToClipboard
                label={typeof value === "string" ? value : String(value ?? "")}
                color="default"
                intent="flat"
                size="md"
                className={col.cellsClassName}
              />
            ) : null;

          return (
            <TableCell
              key={col.id}
              withVerticalBorders={withVerticalBorders}
              withHorizontalDivider={withHorizontalDivider}
              rowHeight={rowHeight}
              align={col.align}
            >
              {row.color && !selectable && index === 0 && (
                <ColorIndicator
                  color={row.color}
                  size="2xs"
                  type="line"
                  className="absolute left-0 top-0"
                />
              )}
              {content}
            </TableCell>
          );
        }),
      [
        columns,
        intlLocale,
        row,
        rowHeight,
        selectable,
        withVerticalBorders,
        withHorizontalDivider,
      ],
    );

    const hasRowActions = Boolean(onRowClick || row.link);
    return (
      <div
        data-component="Kaizen-Table-Row"
        id={rowId}
        onClick={() => onRowClick?.()}
        className={classNames("relative table-row", {
          "bg-surface-action-main-selected-rest hover:bg-surface-action-main-selected-hovered active:bg-surface-action-main-selected-pressed":
            selected || (isActive && hasRowActions),
          "bg-surface-default hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed":
            !selected && !isActive && hasRowActions,
        })}
      >
        {selectable && (
          <TableCell
            withVerticalBorders={withVerticalBorders}
            withHorizontalDivider={withHorizontalDivider}
            rowHeight={rowHeight}
            align="center"
          >
            {row.color && (
              <ColorIndicator
                color={row.color}
                type="line"
                className="absolute left-0 top-0"
                size="2xs"
              />
            )}
            <Checkbox
              value={selected ? "checked" : "unchecked"}
              id={`checkbox-${rowId}`}
              onChange={handleChange}
            />
          </TableCell>
        )}
        {renderedCells}
      </div>
    );
  },
);

export default TableRow;
