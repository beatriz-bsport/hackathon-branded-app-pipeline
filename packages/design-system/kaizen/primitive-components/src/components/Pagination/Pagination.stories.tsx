import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";

/**
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

    useEffect(() => setPage(args.currentPage), [args.currentPage]);

    const onPageChange = (selectedPage: number) => {
      setPage(selectedPage);
      console.log("selectedPage:", selectedPage);
    };

    return (
      <Pagination {...args} currentPage={page} onPageChange={onPageChange} />
    );
  },
  args: {
    currentPage: 1,
    rowsPerPage: 40,
    totalItems: 1000,
    showRowsPerPageSelector: true,
  },
};
