import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import Avatar from "#src/components/Avatar";
import Body from "#src/components/Body";
import Checkbox from "#src/components/Checkbox";
import { Column } from "./Table";
import Link from "#src/components/Link";
import TableCell from "./TableCell";

type TableRowProps<RowType extends { id: string }> = {
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

const TableRow = <RowType extends { id: string }>({
  row,
  rowId,
  columns,
  selectable = false,
  handleCheckboxChange,
  selected = false,
  rowHeight = "sm",
  withVerticalBorders = false,
}: TableRowProps<RowType>): React.ReactElement => {
  const handleChange = useCallback(() => {
    handleCheckboxChange?.(rowId);
  }, [handleCheckboxChange, rowId]);

  const renderedCells = useMemo(
    () =>
      columns.map((col) => {
        const value = resolveDeepPath(row, col.keyPath);

        const content =
          col.type === "custom" && col.render ? (
            col.render(row)
          ) : col.type === "string" ? (
            <Body htmlVariant="span" size="md">
              {value as React.ReactNode}
            </Body>
          ) : col.type === "number" ? (
            <Body htmlVariant="span" size="md">
              {new Intl.NumberFormat().format(value as number)}
            </Body>
          ) : col.type === "date" ? (
            <Body htmlVariant="span" size="md">
              {new Intl.DateTimeFormat("default", {
                dateStyle: "medium",
              }).format(new Date(value as string))}
            </Body>
          ) : col.type === "datetime" ? (
            <Body htmlVariant="span" size="md">
              {new Intl.DateTimeFormat("default", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(value as string))}
            </Body>
          ) : col.type === "time" ? (
            <Body htmlVariant="span" size="md">
              {new Intl.DateTimeFormat("default", {
                timeStyle: "short",
              }).format(new Date(value as string))}
            </Body>
          ) : col.type === "link" ? (
            <Link
              href={
                typeof value === "string"
                  ? value
                  : (value as { href: string })?.href
              }
              target={col.target}
              color="main"
              isUnderlined={true}
            >
              {col.label && col.label(row)}
            </Link>
          ) : col.type === "avatar" ? (
            <Avatar
              src={
                typeof value === "string"
                  ? value
                  : (value as { src: string | undefined })?.src
              }
              shape="squared"
              alt={
                typeof value !== "string" ? (value as { alt: string })?.alt : ""
              }
              size="sm"
            />
          ) : null;

        return (
          <TableCell
            key={col.id}
            withVerticalBorders={withVerticalBorders}
            rowHeight={rowHeight}
          >
            {content}
          </TableCell>
        );
      }),
    [columns, row, selected, rowHeight, withVerticalBorders],
  );

  return (
    <tr
      className={classNames({
        "bg-surface-default hover:bg-surface-action-default-weak-hovered":
          !selected,
        "bg-surface-action-main-selected-rest hover:bg-surface-action-main-selected-hovered":
          selected,
      })}
    >
      {selectable && (
        <TableCell
          withVerticalBorders={withVerticalBorders}
          rowHeight={rowHeight}
        >
          <Checkbox
            value={selected ? "checked" : "unchecked"}
            id={`checkbox-${rowId}`}
            onChange={handleChange}
          />
        </TableCell>
      )}
      {renderedCells}
    </tr>
  );
};

export default TableRow;
