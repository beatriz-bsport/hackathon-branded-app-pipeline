import React, { ReactNode, useMemo } from "react";
import classNames from "classnames";

export type TableCellProps = {
  children: ReactNode;
  rowHeight?: "sm" | "lg";
  withVerticalBorders?: boolean;
  isHeader?: boolean;
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  rowHeight = "sm",
  withVerticalBorders = false,
  isHeader = false,
}) => {
  const cellClass = useMemo(
    () =>
      classNames("p-xs border-b-stroke-thin border-b-stroke-weak", {
        "border-r-stroke-thin border-r-stroke-weak": withVerticalBorders,
        "h-component-list-item-min": rowHeight === "sm",
        "h-2xl": rowHeight === "lg",
      }),
    [rowHeight, withVerticalBorders],
  );

  const Element = isHeader ? "th" : "td";

  return <Element className={cellClass}>{children}</Element>;
};

export default TableCell;
