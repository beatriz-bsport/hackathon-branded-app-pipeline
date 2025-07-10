import type React from "react";

import type { BodyColor } from "#src/components/Body";

/**
 * `ColumnType` defines the available types for table columns.
 * You can add new column types here, such as "date", "time", etc.,
 * to extend the functionality of the Table component.
 *
 * - type: "avatar" renders an Avatar component using the value at keyPath (string or object with src/alt), with optional size.
 * - type: "copy" renders a CopyToClipboard button for the value at keyPath. You can pass extra props for the button (e.g., tooltip, toastMessage, etc.).
 * - type: "custom" renders a custom React node using the render(row) function you provide.
 * - type: "date" renders a string value as a formatted date.
 * - type: "datetime" renders a string value as a formatted date and time.
 * - type: "link" renders a link using the value at keyPath, with optional target and label(row) function.
 * - type: "number" renders a number value from keyPath, formatted for the current locale.
 * - type: "price" renders a number value as a formatted price, with optional priceColoring for positive/negative values.
 * - type: "string" renders a string value from keyPath as plain text.
 * - type: "time" renders a string value as a formatted time.
 */
export type ColumnType =
  | "avatar"
  | "copy"
  | "custom"
  | "date"
  | "datetime"
  | "link"
  | "number"
  | "price"
  | "string"
  | "time";

export type BaseRow = {
  id: string | number;
  link?: string;
  color?: string;
  className?: string;
};

export type Column<RowType extends BaseRow> = {
  id: string;
  header: React.ReactNode | string;
  type: ColumnType;
  sortable?: boolean;
  align?: "start" | "center" | "end";
} & (
  | {
      /**
       * Renders an Avatar component using the value at keyPath (string or object with src/alt), with optional size.
       */
      type: "avatar";
      keyPath: string;
      size?: "sm" | "md" | "lg";
    }
  | {
      /**
       * Renders a CopyToClipboard button for the value at keyPath. You can pass extra props for the button (e.g., tooltip, toastMessage, etc.).
       */
      type: "copy";
      keyPath: string;
      tooltip?: string;
      toastMessage?: string;
    }
  | {
      /**
       * Renders a custom React node for each row using the render(row) function you provide.
       */
      type: "custom";
      keyPath?: string;
      render: (row: RowType) => React.ReactNode;
    }
  | {
      /**
       * Renders a string value as a formatted date.
       */
      type: "date";
      keyPath: string;
    }
  | {
      /**
       * Renders a string value as a formatted date and time.
       */
      type: "datetime";
      keyPath: string;
    }
  | {
      /**
       * Renders a link using the value at keyPath, with optional target and label(row) function.
       */
      type: "link";
      keyPath: string;
      target?: "_blank" | "_self" | "_parent" | "_top";
      label?: (row: RowType) => string;
    }
  | {
      /**
       * Renders a number value from keyPath, formatted for the current locale.
       */
      type: "number";
      keyPath: string;
    }
  | {
      /**
       * Renders a number value as a formatted price, with optional priceColoring for positive/negative values.
       */
      type: "price";
      keyPath: string;
      priceColoring?: {
        positive?: BodyColor;
        negative?: BodyColor;
      };
    }
  | {
      /**
       * Renders a string value from keyPath as plain text.
       */
      type: "string";
      keyPath: string;
    }
  | {
      /**
       * Renders a string value as a formatted time.
       */
      type: "time";
      keyPath: string;
    }
);

export type GenericTableColumn<RowType extends BaseRow> = Column<RowType>;
