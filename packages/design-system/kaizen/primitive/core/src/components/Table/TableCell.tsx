import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { ReactNode } from "react";

export type TableCellProps = {
  children: ReactNode;
  rowHeight?: "sm" | "lg";
  withVerticalBorders?: boolean;
  isHeader?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
};

const tableCell = cva(
  "table-cell align-middle whitespace-nowrap p-xs border-b-stroke-thin border-b-stroke-weak",
  {
    variants: {
      rowHeight: {
        sm: "h-component-list-item-min",
        lg: "h-2xl",
      },
      withVerticalBorders: {
        true: "border-r-stroke-thin border-r-stroke-weak",
        false: "",
      },
      isHeader: {
        true: "font-[700]",
        false: "",
      },
    },
    defaultVariants: {
      rowHeight: "sm",
      withVerticalBorders: false,
    },
  },
);

const TableCell: React.FC<TableCellProps> = ({
  children,
  rowHeight = "sm",
  withVerticalBorders = false,
  isHeader = false,
  align = "start",
  className,
}) => {
  return (
    <div className={tableCell({ rowHeight, withVerticalBorders, isHeader })}>
      <div
        className={classNames(
          "flex",
          {
            "justify-start": align === "start",
            "justify-center": align === "center",
            "justify-end": align === "end",
          },
          className ?? "",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default TableCell;
