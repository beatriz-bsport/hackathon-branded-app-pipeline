import React, { ReactNode } from "react";
import { cva } from "class-variance-authority";
import classNames from "classnames";

export type TableCellProps = {
  children: ReactNode;
  rowHeight?: "sm" | "lg";
  withVerticalBorders?: boolean;
  isHeader?: boolean;
  align?: "start" | "center" | "end";
};

const tableCell = cva("whitespace-nowrap p-xs border-b-stroke-thin border-b-stroke-weak", {
  variants: {
    rowHeight: {
      sm: "h-component-list-item-min",
      lg: "h-2xl",
    },
    withVerticalBorders: {
      true: "border-r-stroke-thin border-r-stroke-weak",
      false: "",
    },
  },
  defaultVariants: {
    rowHeight: "sm",
    withVerticalBorders: false,
  },
});

const TableCell: React.FC<TableCellProps> = ({
  children,
  rowHeight = "sm",
  withVerticalBorders = false,
  isHeader = false,
  align = "start",
}) => {
  const Element = isHeader ? "th" : "td";

  return (
    <Element className={tableCell({ rowHeight, withVerticalBorders })}>
      <div
        className={classNames("flex", {
          "justify-start": align === "start",
          "justify-center": align === "center",
          "justify-end": align === "end",
        })}
      >
        {children}
      </div>
    </Element>
  );
};

export default TableCell;
