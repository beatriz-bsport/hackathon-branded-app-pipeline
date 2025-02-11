import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Table, { BaseRowType, Column } from "./Table";
import Button from "#src/components/Button";
import Chip from "#src/components/Chip";
import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";

/**
 * The Table component is used to render a flexible, customizable data table that displays rows and columns of information.<br>
 * It allows different configurations such as selectable rows with checkboxes, different row heights, and vertical borders between cells.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2023-14889" target="_blank">Figma</a>
 */
const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type DataRow = {
  id: string;
  link?: string;
  avatar: { src: string; alt: string } | string;
  name: string;
  registeredDate: Date;
  status: Array<{ label: string; color: "positive" | "critical" | "warning" }>;
  amount: number;
  actions: string[];
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
  amount: index * 100,
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
    type: "string",
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
    id: "amount",
    keyPath: "amount",
    header: "Amount",
    type: "number",
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

export const Primary: StoryObj<typeof Table> = {
  args: {
    columns: columns as Column<BaseRowType>[],
    rows: rows.slice(0, 5),
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
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
    columns: columns as Column<BaseRowType>[],
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
    const [tableRows, setTableRows] = useState(updateRows(1, 10));

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
    columns: columns as Column<BaseRowType>[],
    rows: rows.slice(0, 3).map((row) => ({
      ...row,
      link: "https://example.com",
    })),
    rowHeight: "sm",
    selectable: true,
    withVerticalBorders: true,
  },
};
