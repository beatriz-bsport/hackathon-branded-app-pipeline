import classNames from "classnames";
import React, { useCallback, useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import Avatar from "#src/components/Avatar";
import Body, { BodyColor } from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";
import ColorIndicator from "#src/components/ColorIndicator";
import withLink from "#src/components/private/withLink";
import { useKaizenI18nInstance } from "#src/i18n";

import type { BaseRow, Column } from "./Table";
import TableCell from "./TableCell";

type TableRowProps<RowType extends BaseRow> = {
  row: RowType;
  rowId: string;
  columns: Column<RowType>[];
  selectable?: boolean;
  handleCheckboxChange?: (id: string) => void;
  selected?: boolean;
  rowHeight?: "sm" | "lg";
  withVerticalBorders?: boolean;
};

// Type-safe utility to resolve a deep path in an object
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
    selectable = false,
    handleCheckboxChange,
    selected = false,
    rowHeight = "sm",
    withVerticalBorders = false,
  }: TableRowProps<RowType>): React.ReactElement => {
    const i18nInstance = useKaizenI18nInstance();
    const intlLocale = useMemo(() => i18nInstance?.language, [i18nInstance]);

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
              <Body htmlVariant="span" size="md">
                {value as React.ReactNode}
              </Body>
            ) : col.type === "number" ? (
              <Body htmlVariant="span" size="md">
                {new Intl.NumberFormat(intlLocale).format(value as number)}
              </Body>
            ) : col.type === "price" ? (
              <Body
                htmlVariant="span"
                size="md"
                color={getPriceColor(value as number, col.priceColoring)}
              >
                {typeof value === "number" && !isNaN(value)
                  ? getCurrencyDisplayWithPrice(value as number)
                  : typeof value}
              </Body>
            ) : col.type === "date" ? (
              <Body htmlVariant="span" size="md">
                {new Intl.DateTimeFormat(intlLocale, {
                  dateStyle: "medium",
                }).format(new Date(value as string))}
              </Body>
            ) : col.type === "datetime" ? (
              <Body htmlVariant="span" size="md">
                {new Intl.DateTimeFormat(intlLocale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(value as string))}
              </Body>
            ) : col.type === "time" ? (
              <Body htmlVariant="span" size="md">
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
              />
            ) : null;

          return (
            <TableCell
              key={col.id}
              withVerticalBorders={withVerticalBorders}
              rowHeight={rowHeight}
              align={col.align}
            >
              {row.color && !selectable && index === 0 && (
                <ColorIndicator
                  color={row.color}
                  type="line"
                  className="absolute left-0 top-0"
                />
              )}
              {content}
            </TableCell>
          );
        }),
      [columns, intlLocale, row, rowHeight, selectable, withVerticalBorders],
    );

    return (
      <div
        className={classNames("relative table-row", {
          "bg-surface-default hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed":
            !selected,
          "bg-surface-action-main-selected-rest hover:bg-surface-action-main-selected-hovered active:bg-surface-action-main-selected-pressed":
            selected,
        })}
      >
        {selectable && (
          <TableCell
            withVerticalBorders={withVerticalBorders}
            rowHeight={rowHeight}
            align="center"
          >
            {row.color && (
              <ColorIndicator
                color={row.color}
                type="line"
                className="absolute left-0 top-0"
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
