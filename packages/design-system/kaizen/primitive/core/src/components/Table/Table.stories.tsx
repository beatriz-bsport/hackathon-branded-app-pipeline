import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";
import Button from "#src/components/Button";
import Chip from "#src/components/Chip";

import Table from "./Table";
import type { BaseRow, Column } from "./types";

/**
 *
 * The Table component is a flexible, accessible data table that displays structured information
 * with support for various column types, selection, pagination, and state management.
 *
 * ## Key Features
 *
 * ### Column Types
 * - **String**: Plain text display with consistent typography
 * - **Number**: Locale-formatted numbers for international users
 * - **Price**: Currency formatting with optional color coding
 * - **Date/DateTime/Time**: Internationalized date and time formatting
 * - **Avatar**: User profile images with fallback support
 * - **Copy**: Copy-to-clipboard functionality with user feedback
 * - **Custom**: Fully customizable content via render functions
 *
 * ### Selection & Interaction
 * - **Row Selection**: Checkbox-based selection with "select all" functionality
 * - **Row Links**: Transform entire rows into clickable links
 * - **Click Handlers**: Custom click events with proper event propagation
 * - **Active States**: Visual feedback for selected or active rows
 *
 * ### Visual Customization
 * - **Row Heights**: Compact (sm) or comfortable (lg) spacing
 * - **Vertical Borders**: Optional column separators
 * - **Color Indicators**: Row-level color coding for categorization
 * - **Responsive Design**: Automatic layout adjustments
 *
 * ### State Management
 * - **Loading States**: Built-in loading indicators
 * - **Empty States**: Customizable empty and no-results displays
 * - **Pagination**: Optional pagination with configurable settings
 * - **Error Handling**: Graceful degradation for missing data
 *
 * ## Usage Guidelines
 *
 * ### When to Use
 * - Displaying structured data with multiple columns
 * - Comparing information across rows
 * - Enabling bulk operations through selection
 * - Presenting large datasets with pagination
 *
 * ### Best Practices
 * - Keep column headers concise and descriptive
 * - Use appropriate column types for data format
 * - Implement proper loading and empty states
 * - Consider mobile responsiveness for wide tables
 * - Use color indicators sparingly for important categorization
 *
 * ### Accessibility
 * - Full keyboard navigation support
 * - Screen reader compatibility with proper ARIA labels
 * - High contrast support for visual elements
 * - Focus management for interactive elements
 *
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2023-14889" target="_blank">View Design Specs</a>
 */
const meta: Meta<typeof Table> = {
  component: Table,
  argTypes: {
    columns: {
      control: "object",
      description:
        "Array of column configurations that define how data should be displayed and formatted.",
      table: {
        type: { summary: "Column<RowType>[]" },
        category: "Required",
      },
    },
    rows: {
      control: "object",
      description:
        "Array of data objects to display in table rows. Each object must have an 'id' property.",
      table: {
        type: { summary: "RowType[]" },
        category: "Required",
      },
    },
    rowHeight: {
      control: { type: "radio", options: ["sm", "lg"] },
      description:
        "Height variant for table rows. 'sm' provides compact spacing, 'lg' offers more comfortable reading.",
      table: {
        type: { summary: "'sm' | 'lg'" },
        defaultValue: { summary: "'sm'" },
        category: "Layout",
      },
    },
    selectable: {
      control: { type: "boolean" },
      description:
        "Enable row selection with checkboxes. Includes 'select all' functionality in the header.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Selection",
      },
    },
    withVerticalBorders: {
      control: { type: "boolean" },
      description:
        "Display vertical borders between columns for better visual separation.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
        category: "Styling",
      },
    },
    paginationProps: {
      control: "object",
      description:
        "Configuration for pagination functionality including page size, current page, and navigation callbacks.",
      table: {
        type: { summary: "PaginationProps" },
        category: "Pagination",
      },
    },
    emptyStateProps: {
      control: "object",
      description:
        "Configuration for empty state display when no data or search results are available.",
      table: {
        type: {
          summary: "UseEmptyStateProps",
          detail:
            "{\n  isEmpty?: boolean;\n  emptyConfig?: {\n    title?: string;\n    subtitle?: string;\n    className?: string;\n    ctaButtonConfig?: ButtonProps;\n    secondaryButtonConfig?: ButtonProps;\n  };\n  isEmptySearch?: boolean;\n  emptySearchConfig?: EmptyConfig;\n}",
        },
        category: "State Management",
      },
    },
    loadingProps: {
      control: "object",
      description:
        "Configuration for loading state display during data fetching operations.",
      table: {
        type: {
          summary: "UseLoadingStateProps",
          detail:
            "{\n  isLoading: boolean;\n  message?: string;\n  className?: string;\n}",
        },
        category: "State Management",
      },
    },
    className: {
      control: "text",
      description:
        "Additional CSS classes to apply to the table container element.",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
  },
};

export default meta;

type DataRow = {
  id: string;
  link?: string;
  color?: string;
  avatar: { src: string; alt: string } | string;
  name: string;
  email?: string;
  registeredDate: Date;
  lastLogin?: Date;
  sessionTime?: Date;
  credits?: number;
  status: Array<{ label: string; color: "positive" | "critical" | "warning" }>;
  amount: number;
  quantity?: number;
  balance?: number;
  actions: string[];
  isActive?: boolean;
};

const rows: DataRow[] = Array.from({ length: 100 }, (_, index) => ({
  id: `row-${index}`,
  avatar: {
    src: AvatarImage,
    alt: `Avatar ${index}`,
  },
  name: `Name ${index}`,
  registeredDate: new Date("2022-12-18T15:00:00Z"),
  status: [
    {
      label: `Status ${index % 3}`,
      color:
        index % 3 === 0 ? "positive" : index % 3 === 1 ? "warning" : "critical",
    },
  ],
  quantity: Math.floor(Math.random() * 20) - 10,
  amount: Math.floor(Math.random() * 2001) - 1000,
  actions: ["Edit", "Delete"],
}));

const columns: Column<DataRow>[] = [
  {
    id: "avatar",
    keyPath: "avatar",
    header: "Avatar",
    type: "avatar",
    size: "sm",
  },
  {
    id: "name",
    keyPath: "name",
    header: "Name",
    type: "copy",
    tooltip: "Copy the name to clipboard",
    toastMessage: "Name copied!",
  },
  {
    id: "registeredDate",
    keyPath: "registeredDate",
    header: "Registered Date",
    type: "datetime",
  },
  {
    id: "status",
    keyPath: "status",
    header: "Status",
    type: "custom",
    render: (row: DataRow) => (
      <div className="flex gap-sm">
        {row.status.map((status, index) => (
          <Chip
            key={index}
            label={status.label}
            color={status.color}
            size="sm"
            type="weak"
          />
        ))}
      </div>
    ),
  },
  {
    id: "quantity",
    keyPath: "quantity",
    header: "Qty.",
    type: "number",
    align: "center",
  },
  {
    id: "amount",
    keyPath: "amount",
    header: "Amount",
    type: "price",
    align: "center",
  },
  {
    id: "actions",
    keyPath: "actions",
    header: "Actions",
    type: "custom",
    align: "end",
    render: (row: DataRow) => (
      <div className="flex gap-sm">
        {row.actions.map((action, index) => (
          <Button
            key={index}
            intent="call-to-action"
            color="main"
            size="sm"
            onClick={(e) => {
              // Prevent the row from being selected when clicking the button
              e.stopPropagation();
              e.preventDefault();
              console.log(`${action} clicked for ${row.name}`);
            }}
            label={action}
          />
        ))}
      </div>
    ),
  },
];

const emptyConfig = {
  title: "No email templates yet",
  subtitle: "Create email templates to easily contact your members",
  className: "max-w-[320px]",
  ctaButtonConfig: {
    iconLeft: "award-03" as const,
    label: "Create template",
    onClick: () => console.log("Create email template"),
  },
  secondaryButtonConfig: {
    iconLeft: "bank-note-03" as const,
    label: "Add category",
    onClick: () => console.log("Create a new category"),
  },
};

const emptySearchConfig = {
  title: "No results found",
  subtitle:
    "No members match your filters.\nTry clearing them to see more results",
  className: "max-w-[320px]",
  secondaryButtonConfig: {
    iconLeft: "x" as const,
    label: "Clear filters",
    onClick: () => console.log("Clear the filters"),
  },
};

const loadingConfig = {
  isLoading: false,
  message: "Loading smth ...",
};

export const Primary: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<BaseRow>[],
    rows: rows.slice(0, 5),
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
    loadingProps: loadingConfig,
  },
};

const updateRows = (page: number, nbRows: number) => {
  const start = (page - 1) * nbRows;
  const end = start + nbRows;
  return rows.slice(start, end);
};

/**
 * The Table component can be paginated by providing the `paginationProps` prop.
 */
export const WithPagination: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<BaseRow>[],
    rows,
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
    paginationProps: {
      currentPage: 1,
      rowsPerPage: 10,
      totalItems: 100,
      showRowsPerPageSelector: true,
    },
  },
  render: (args) => {
    const { paginationProps } = args;
    const [tableRows, setTableRows] = useState(
      updateRows(1, paginationProps?.rowsPerPage || 10),
    );

    const handlePaginationSettingsChange = (page: number, rows: number) => {
      setTableRows(updateRows(page, rows));
    };

    return (
      <Table
        {...args}
        rows={tableRows}
        paginationProps={{
          ...paginationProps,
          currentPage: paginationProps?.currentPage || 1,
          rowsPerPage: paginationProps?.rowsPerPage || 10,
          totalItems: paginationProps?.totalItems || 100,
          onPageSettingsChange: handlePaginationSettingsChange,
        }}
      />
    );
  },
};

/**
 * When a link is provided on a row-level, the row wrapped inside a <a> tag.<br>
 * This allows the user to click anywhere on the row to navigate to the link.
 */
export const WithRowLink: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<BaseRow>[],
    rows: rows.slice(0, 3).map((row) => ({
      ...row,
      link: "https://example.com",
    })),
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
  },
};

/**
 * When a color is provided on a row-level, the row will have a color indicator as a line.
 */
export const WithRowColor: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<BaseRow>[],
    rows: rows.slice(0, 3).map((row, index) => ({
      ...row,
      color: index === 0 ? "#2563eb" : index === 2 ? "red" : undefined,
    })),
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
  },
};

export const EmptyTable: StoryObj<typeof Table> = {
  args: {
    columns: [],
    rows: [],
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
    emptyStateProps: {
      isEmpty: true,
      emptyConfig: emptyConfig,
    },
  },
};

export const EmptySearchTable: StoryObj<typeof Table> = {
  args: {
    columns: [],
    rows: [],
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
    emptyStateProps: {
      isEmptySearch: true,
      emptySearchConfig: emptySearchConfig,
      isEmpty: true, // Check that empty search prevails over empty
      emptyConfig: emptyConfig,
    },
  },
};

export const LoadingTable: StoryObj<typeof Table> = {
  args: {
    columns: [],
    rows: [],
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
    loadingProps: {
      isLoading: true,
      message: loadingConfig.message,
    },
  },
};

/**
 * Demonstrates various column types and their formatting capabilities.
 * This story shows how different data types are automatically formatted
 * according to locale settings and column configurations.
 */
export const ColumnTypes: StoryObj<typeof Table> = {
  render: () => {
    const columnTypesColumns: Column<DataRow>[] = [
      {
        id: "avatar",
        keyPath: "avatar",
        header: "User",
        type: "avatar",
        size: "md",
      },
      {
        id: "name",
        keyPath: "name",
        header: "Name",
        type: "string",
      },
      {
        id: "email",
        keyPath: "email",
        header: "Email",
        type: "copy",
        tooltip: "Copy email address",
        toastMessage: "Email copied to clipboard!",
      },
      {
        id: "registeredDate",
        keyPath: "registeredDate",
        header: "Registered",
        type: "date",
      },
      {
        id: "lastLogin",
        keyPath: "lastLogin",
        header: "Last Login",
        type: "datetime",
      },
      {
        id: "sessionTime",
        keyPath: "sessionTime",
        header: "Session Duration",
        type: "time",
      },
      {
        id: "credits",
        keyPath: "credits",
        header: "Credits",
        type: "number",
        align: "center",
      },
      {
        id: "balance",
        keyPath: "balance",
        header: "Balance",
        type: "price",
        align: "end",
        priceColoring: {
          positive: "positive",
          negative: "critical",
        },
      },
    ];

    const columnTypesRows: DataRow[] = [
      {
        id: "1",
        avatar: { src: AvatarImage, alt: "John Doe" },
        name: "John Doe",
        email: "john.doe@example.com",
        registeredDate: new Date("2023-01-15"),
        lastLogin: new Date("2024-01-10T14:30:00Z"),
        sessionTime: new Date("2024-01-10T02:15:00Z"),
        credits: 1250,
        balance: 156.75,
        status: [],
        amount: 156.75,
        actions: [],
      },
      {
        id: "2",
        avatar: AvatarImage,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        registeredDate: new Date("2023-03-22"),
        lastLogin: new Date("2024-01-09T09:15:00Z"),
        sessionTime: new Date("2024-01-10T01:45:00Z"),
        credits: 850,
        balance: -25.5,
        status: [],
        amount: -25.5,
        actions: [],
      },
    ];

    return (
      <Table
        columns={columnTypesColumns}
        rows={columnTypesRows}
        rowHeight="sm"
        selectable={false}
        withVerticalBorders={true}
      />
    );
  },
};

/**
 * Shows a table without any selections, focusing purely on data display.
 * Useful for read-only data presentation or reporting scenarios.
 */
export const ReadOnlyTable: StoryObj<typeof Table> = {
  args: {
    columns: columns.slice(0, 4) as Column<BaseRow>[],
    rows: rows.slice(0, 8),
    rowHeight: "lg",
    selectable: false,
    withVerticalBorders: false,
  },
};

/**
 * Demonstrates custom content rendering with complex interactive elements.
 * Shows how to embed buttons, badges, and other components within table cells.
 */
export const CustomContent: StoryObj<typeof Table> = {
  render: () => {
    const customColumns: Column<DataRow>[] = [
      {
        id: "name",
        keyPath: "name",
        header: "Name",
        type: "string",
      },
      {
        id: "status",
        keyPath: "status",
        header: "Status",
        type: "custom",
        render: (row: DataRow) => (
          <div className="flex gap-xs">
            {row.status.map((status, index) => (
              <Chip
                key={index}
                label={status.label}
                color={status.color}
                size="sm"
                type="weak"
              />
            ))}
          </div>
        ),
      },
      {
        id: "progress",
        keyPath: "id",
        header: "Progress",
        type: "custom",
        render: (row: DataRow) => {
          const progress = parseInt(row.id.split("-")[1] || "0") * 10;
          return (
            <div className="flex items-center gap-sm">
              <div className="w-20 bg-surface-default-weak rounded-full h-2">
                <div
                  className="bg-surface-action-main-default h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-sm text-content-default-weaker">
                {Math.min(progress, 100)}%
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        keyPath: "actions",
        header: "Actions",
        type: "custom",
        align: "end",
        render: (row: DataRow) => (
          <div className="flex gap-xs">
            <Button
              intent="flat"
              color="default"
              size="sm"
              iconLeft="edit-02"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Edit ${row.name}`);
              }}
              label="Edit"
            />
            <Button
              intent="flat"
              color="critical"
              size="sm"
              iconLeft="trash-01"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Delete ${row.name}`);
              }}
              label="Delete"
            />
          </div>
        ),
      },
    ];

    return (
      <Table
        columns={customColumns}
        rows={rows.slice(0, 5)}
        rowHeight="lg"
        selectable={false}
        withVerticalBorders={true}
      />
    );
  },
};

/**
 * Demonstrates responsive table behavior with different row heights.
 * Compare compact vs comfortable layouts for different use cases.
 */
export const RowHeights: StoryObj<typeof Table> = {
  args: {
    columns: columns.slice(0, 5) as Column<BaseRow>[],
    rows: rows.slice(0, 4),
    rowHeight: "lg",
    selectable: true,
    withVerticalBorders: true,
  },
  argTypes: {
    rowHeight: {
      control: "inline-radio",
      options: ["sm", "lg"],
    },
  },
};
