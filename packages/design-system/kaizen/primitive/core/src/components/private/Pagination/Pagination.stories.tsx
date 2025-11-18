import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import Pagination from "./Pagination";

/**
 * **This component is an internal component. It should not be used directly in your apps !**<br>
 * Please refer to Table or List components for proper usage.<br><br>
 * Pagination component for navigating through large sets of data, allowing navigation between pages
 * and the option to adjust the number of rows displayed per page. It includes support for boundary
 * and range-based page selection as well as a rows-per-page selector.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=948-7024" target="_blank">Figma</a>
 */
const meta: Meta<typeof Pagination> = {
  component: Pagination,
  argTypes: {
    currentPage: {
      control: { type: "number" },
    },
    rowsPerPage: {
      control: { type: "number" },
    },
    totalItems: {
      control: { type: "number" },
    },
    showRowsPerPageSelector: {
      control: { type: "boolean" },
    },
    maxVisiblePages: {
      control: { type: "number", min: 3, max: 11, step: 2 },
      description:
        "Maximum number of page buttons to display (excluding ellipsis, but including [last]). Defaults to 8.",
    },
    onPageChange: {
      table: {
        type: { summary: "function", detail: "(page: number) => void" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Primary: Story = {
  name: "Pagination",
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    const [rowsPerPage, setRowsPerPage] = useState(args.rowsPerPage);

    useEffect(() => {
      setPage(args.currentPage);
      setRowsPerPage(args.rowsPerPage);
    }, [args.currentPage, args.rowsPerPage]);

    const handlePageSettingsChange = (page: number, rowsPerPage: number) => {
      console.log("page:", page, "rowsPerPage:", rowsPerPage);
      setPage(page);
      setRowsPerPage(rowsPerPage);
    };

    return (
      <Pagination
        {...args}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        onPageSettingsChange={handlePageSettingsChange}
      />
    );
  },
  args: {
    currentPage: 1,
    rowsPerPage: 40,
    totalItems: 1000,
    showRowsPerPageSelector: true,
    disabled: false,
    maxVisiblePages: 8,
  },
};

/**
 * This story demonstrates the Pagination component with more than 1000 items.
 * It is used to verify the correct display and tooltip behavior for large page numbers,
 * including the shortened label format (e.g., "..00" for 1000, "..09" for 1009, etc.).
 */
export const PaginationWithMoreThanAThousandItems: Story = {
  name: "More than a thousand items",
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    const [rowsPerPage, setRowsPerPage] = useState(args.rowsPerPage);

    useEffect(() => {
      setPage(args.currentPage);
      setRowsPerPage(args.rowsPerPage);
    }, [args.currentPage, args.rowsPerPage]);

    const handlePageSettingsChange = (page: number, rowsPerPage: number) => {
      console.log("page:", page, "rowsPerPage:", rowsPerPage);
      setPage(page);
      setRowsPerPage(rowsPerPage);
    };

    return (
      <Pagination
        {...args}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        onPageSettingsChange={handlePageSettingsChange}
      />
    );
  },
  args: {
    currentPage: 1,
    rowsPerPage: 1,
    totalItems: 1010,
    showRowsPerPageSelector: true,
    disabled: false,
    maxVisiblePages: 8,
  },
};

/**
 * This story demonstrates the Pagination component with a compact layout (maxVisiblePages={6}).
 * This is useful for mobile devices or constrained spaces where showing fewer page buttons is needed.
 */
export const CompactMobileLayout: Story = {
  name: "Compact mobile layout (maxVisiblePages=6)",
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    const [rowsPerPage, setRowsPerPage] = useState(args.rowsPerPage);

    useEffect(() => {
      setPage(args.currentPage);
      setRowsPerPage(args.rowsPerPage);
    }, [args.currentPage, args.rowsPerPage]);

    const handlePageSettingsChange = (page: number, rowsPerPage: number) => {
      console.log("page:", page, "rowsPerPage:", rowsPerPage);
      setPage(page);
      setRowsPerPage(rowsPerPage);
    };

    return (
      <Pagination
        {...args}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        onPageSettingsChange={handlePageSettingsChange}
      />
    );
  },
  args: {
    currentPage: 1,
    rowsPerPage: 40,
    totalItems: 1000,
    showRowsPerPageSelector: true,
    disabled: false,
    maxVisiblePages: 6,
  },
};
