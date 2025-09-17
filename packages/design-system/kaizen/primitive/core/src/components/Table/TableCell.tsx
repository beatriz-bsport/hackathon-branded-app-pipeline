import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { ReactNode } from "react";

/**
 * Props for the TableCell component.
 */
export type TableCellProps = {
  /** The content to display within the cell */
  children: ReactNode;
  /** Height variant for the cell */
  rowHeight?: "sm" | "lg";
  /** Whether to display a vertical border on the right side */
  withVerticalBorders?: boolean;
  /** Whether this cell is a header cell (affects font weight) */
  isHeader?: boolean;
  /** Horizontal alignment of cell content */
  align?: "start" | "center" | "end";
  /** Additional CSS classes to apply to the cell */
  className?: string;
};

/**
 * A flexible table cell component that handles content alignment and styling.
 *
 * The TableCell component is the building block for both header and data cells in tables.
 * It provides consistent styling, proper alignment options, and configurable borders
 * while maintaining accessibility and responsive design principles.
 *
 * ## Features
 * - **Flexible Alignment**: Support for start, center, and end alignment
 * - **Header Support**: Special styling for header cells (bold font weight)
 * - **Border Control**: Optional vertical borders between cells
 * - **Height Variants**: Small and large height options for different use cases
 * - **Responsive Design**: Consistent spacing and layout across screen sizes
 * - **Accessibility**: Proper semantic structure and ARIA support
 *
 * ## Alignment Options
 * - **start**: Content aligned to the left (default)
 * - **center**: Content centered horizontally
 * - **end**: Content aligned to the right
 *
 * ## Height Variants
 * - **sm**: Compact cell height for dense data tables
 * - **lg**: Larger cell height for more comfortable reading
 * @param props - TableCell configuration and content
 * @returns Rendered table cell component
 *
 * @see {@link TableRow} Row component that contains cells
 * @see {@link TableHeader} Header component that uses header cells
 */

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
