import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import List from "#src/components/List";

import { ButtonProps } from "../Button";

/**
 * A list component that can contain multiple `Item` components and one `Header` component.<br>
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=642-5125" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof List> = {
  component: List,
  argTypes: {
    id: {
      control: "text",
      description: "Optional ID for the list.",
    },
    header: { control: "object" },
    items: { control: "object" },
    emptyStateProps: {
      table: {
        type: {
          detail:
            "{\n\tisEmpty: boolean;\n\temptyConfig: {" +
            "\n\t\ttitle?: string;\n\t\tsubtitle?: string;\n\t\tclassName?: string;" +
            "\n\t\tctaButtonConfig?: ButtonProps;\n\t\tsecondaryButtonConfig?: ButtonProps;\n\t};" +
            "\n\tisEmptySearch?: boolean;\n\temptySearchConfig?: Like emptyConfig;\n}",
          summary: "UseEmptyStateProps",
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof List>;

const items = Array.from({ length: 100 }, (_, index) => ({
  id: `item${index}`,
  title: `Item ${index}`,
  rightTitle: "Right title",
  description: "Playing with fonts is fun",
}));

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

export const Primary: Story = {
  name: "List",
  args: {
    id: "list-1",
    header: {
      title: "List Title",
      description: "Helpful description",
      id: "list-header-1",
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        color: "#338c32",
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        color: "red",
      },
    ],
    isSelectable: false,
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
  },
};

export const ListWithButtonsInHeader: Story = {
  name: "List with buttons in header",
  args: {
    id: "list-1",
    header: {
      title: "List with buttons in header title",
      description: "Helpful description",
      id: "list-header-1",
      buttons: [
        {
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "chevron-down",
        },
        {
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "dots-horizontal",
        },
      ] as [ButtonProps, ButtonProps],
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
      },
    ],
    isSelectable: false,
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
  },
};

export const Checkboxes: Story = {
  name: "List with checkboxes",
  args: {
    id: "list-2",
    header: {
      title: "List Title",
      description: "Helpful description",
      id: "list-header-2",
    },
    items: [
      {
        id: "list-item-4",
        title:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget urna a justo dictum tincidunt. Duis elementum non felis sit amet tristique. Aenean lorem dolor, eleifend in justo ornare, facilisis condimentum felis. Vestibulum eu ipsum ipsum. Aliquam viverra quis arcu et imperdiet. Sed nec ipsum quis dolor sagittis accumsan. Sed commodo velit et lacus convallis viverra. Maecenas eu ligula a sapien varius vulputate quis at sem.",
        rightTitle: "Right title",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget urna a justo dictum tincidunt. Duis elementum non felis sit amet tristique. Aenean lorem dolor, eleifend in justo ornare, facilisis condimentum felis. Vestibulum eu ipsum ipsum. Aliquam viverra quis arcu et imperdiet. Sed nec ipsum quis dolor sagittis accumsan. Sed commodo velit et lacus convallis viverra. Maecenas eu ligula a sapien varius vulputate quis at sem.",
        chips: [
          {
            label: "Chip 1",
            type: "weak",
            color: "default",
            size: "lg",
          },
          {
            label: "Chip 2",
            type: "weak",
            color: "default",
            size: "lg",
          },
          {
            label: "Chip 3",
            type: "weak",
            color: "default",
            size: "lg",
          },
        ],
        chipsDirection: "end",
        buttons: [
          {
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "file-06",
          },
        ],
      },
      {
        id: "list-item-5",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        chips: [
          {
            label: "Chip 1",
            type: "weak",
            color: "default",
            size: "lg",
          },
          {
            label: "Chip 2",
            type: "weak",
            color: "default",
            size: "lg",
          },
        ],
      },
      {
        id: "list-item-6",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        chips: [
          {
            label: "Chip 1",
            type: "weak",
            color: "default",
            size: "lg",
          },
        ],
        buttons: [
          {
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "arrow-right",
          },
          {
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "refresh-cw-01",
          },
        ],
      },
    ],
    isSelectable: true,
  },
};

const updateRows = (page: number, nbRows: number) => {
  const start = (page - 1) * nbRows;
  const end = start + nbRows;
  return items.slice(start, end);
};

export const PaginatedList: Story = {
  name: "Paginated List",
  args: {
    header: {
      title: "Paginated List",
      description: "Helpful description",
      id: "list-header-3",
    },
    paginationProps: {
      currentPage: 1,
      rowsPerPage: 10,
      totalItems: items.length,
      showRowsPerPageSelector: true,
    },
  },
  render: (args) => {
    const [shownItems, setShownItems] = useState(updateRows(1, 10));

    const handlePaginationSettingsChange = (page: number, rows: number) => {
      setShownItems(updateRows(page, rows));
    };

    return (
      <List
        {...args}
        items={shownItems}
        paginationProps={{
          ...args.paginationProps,
          currentPage: args.paginationProps?.currentPage || 1,
          rowsPerPage: args.paginationProps?.rowsPerPage || 10,
          totalItems: args.paginationProps?.totalItems || 100,
          onPageSettingsChange: handlePaginationSettingsChange,
        }}
      />
    );
  },
};

export const EmptyList: Story = {
  args: {
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: true,
      emptyConfig: emptyConfig,
    },
  },
};

export const EmptyListWithHeader: Story = {
  args: {
    header: {
      title: "Empty List Header",
      description: "Helpful description for a empty list with a header",
      id: "list-header-4",
    },
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: true,
      emptyConfig: emptyConfig,
    },
  },
};

export const EmptySearchList: Story = {
  args: {
    emptyStateProps: {
      isEmptySearch: true,
      emptySearchConfig: emptySearchConfig,
      isEmpty: true, // Check that empty search prevails over empty
      emptyConfig: emptyConfig,
    },
  },
};
