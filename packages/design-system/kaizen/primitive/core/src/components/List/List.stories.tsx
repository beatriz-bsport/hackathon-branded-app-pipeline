import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Checkbox from "#src/components/Checkbox";
import CopyToClipboard from "#src/components/CopyToClipboard";
import Icon from "#src/components/Icon";
import List, { type ListItemProps, type ListProps } from "#src/components/List";
import Popover from "#src/components/Popover";

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
    collapsibleProps: {
      control: "object",
      table: {
        type: {
          detail:
            "{\n\tinitiallyOpen?: boolean;\n\tid?: string;\n\tclassName?: string\n}",
          summary: "CollapseProps",
        },
      },
    },
    header: {
      control: "object",
      table: {
        type: {
          summary: "ListHeaderProps",
          detail: `
    {
      id: string;
      title: string;
      className?: string;
      description?: string;
      isSelectable?: boolean;
      onCheckboxChange?: (checked: boolean) => void;
      buttons?: ActionButton[]; // The same as normal button but the onClick event does not have an event parameter
      dropdownConfig?: ActionsDropdownConfig;
    }
          `.trim(),
        },
      },
    },
    items: {
      control: "object",
      table: {
        type: {
          summary: "ListItemProps",
          detail: `
    {
      id: string;
      title: string;
      rightTitle?: string;
      description?: string;
      className?: string;
      icon?: string;
      avatar?: AvatarProps;
      color?: string;
      chips?: ChipProps[];
      chipsDirection?: "start" | "end";
      buttons?: ActionButton[];  // The same as normal button but the onClick event does not have an event parameter
      dropdownConfig?: ActionsDropdownConfig;
      link?: string;
      onCheckboxChange?: (checked: boolean) => void;
      onItemClick?: () => void;
      isActive?: boolean; // Indicates if the item is currently active
      }
          `.trim(),
        },
      },
    },
    emptyStateProps: {
      control: "object",
      table: {
        type: {
          summary: "UseEmptyStateProps",
          detail: `
    {
      isEmpty: boolean;
      emptyConfig: {
        title?: string;
        subtitle?: string;
        className?: string;
        ctaButtonConfig?: ButtonProps;
        secondaryButtonConfig?: ButtonProps;
      };
      isEmptySearch?: boolean;
      emptySearchConfig?: {
        title?: string;
        subtitle?: string;
        className?: string;
        ctaButtonConfig?: ButtonProps;
        secondaryButtonConfig?: ButtonProps;
      };
    }
          `.trim(),
        },
      },
    },
    loadingProps: {
      control: "object",
      table: {
        type: {
          summary: "UseLoadingStateProps",
          detail: `
    {
      message?: string; default "Loading...";
      className?: string;
      isLoading?: boolean; default: false;
    }
          `.trim(),
        },
      },
    },
  },
};

type CustomItemProps = {
  id: string;
  name: string;
  role: "Admin" | "User" | "Guest";
  isSelectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

const CustomListItem = ({
  id,
  name,
  role,
  isSelectable,
  selected,
  onSelect,
}: CustomItemProps) => (
  <div
    style={{
      padding: "10px 16px",
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <div style={{ flexGrow: 1 }}>
      <div style={{ fontWeight: "bold" }}>{name}</div>
      <div style={{ fontSize: "0.9em", color: "#555" }}>Role: {role}</div>
    </div>
    <span style={{ color: "#777", fontSize: "0.8em" }}>ID: {id}</span>
    <div className="w-4">
      {isSelectable && (
        <Checkbox
          id={id}
          value={selected ? "checked" : "unchecked"}
          onChange={() => onSelect?.()}
        />
      )}
    </div>
  </div>
);

const customItems: CustomItemProps[] = [
  { id: "user-1", name: "Jane Doe", role: "Admin" },
  { id: "user-2", name: "John Smith", role: "User" },
  { id: "user-3", name: "Guest User", role: "Guest" },
];

export const WithCustomComponent: Story<CustomItemProps> = {
  name: "With Custom Component",
  args: {
    id: "custom-list",
    header: {
      id: "custom-list-header",
      title: "User List",
      description: "A list rendered with a custom component.",
    },
    items: customItems,
    ListItem: CustomListItem,
    isSelectable: true,
  },
};

export default meta;

type Story<T extends { id: string } = ListItemProps> = StoryObj<ListProps<T>>;

const items: ListItemProps[] = Array.from({ length: 100 }, (_, index) => ({
  id: `item${index}`,
  title: `Item ${index}`,
  rightTitle: "Right title",
  description: "Playing with fonts is fun",
  onItemClick: () => console.log(`Item ${index} clicked`),
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

const collapseConfig = {
  id: "list-collapse",
  initiallyOpen: true,
};

const baseDropdownConfig = { visibleActionsDisplayLimit: 0 };

export const Primary: Story = {
  name: "List",
  args: {
    id: "list-1",
    header: {
      title: "List Title",
      description: "Helpful description",
      id: "list-header-1",
      dropdownConfig: baseDropdownConfig,
      buttons: [
        {
          id: "list-header-button-2",
          label: "Button 2",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 2 clicked"),
        },
        {
          id: "list-header-button-3",
          label: "Button 3",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 3 clicked"),
        },
        {
          id: "list-header-button-4",
          label: "Button 4",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 4 clicked"),
        },
      ],
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        isActive: true,
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 2 },
        onItemClick: () => console.log("Item 1 clicked"),
        buttons: [
          {
            id: "list-header-button-2",
            label: "Button 2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Button 2 clicked"),
          },
          {
            id: "list-header-button-3",
            label: "Button 3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Button 3 clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Button 4 clicked"),
          },
        ],
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        onItemClick: () => console.log("Item 2 clicked"),

        color: "#338c32",
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        onItemClick: () => console.log("Item 3 clicked"),

        color: "red",
      },
    ],
    collapsibleProps: collapseConfig,
    isSelectable: false,
    emptyStateProps: {
      isEmptySearch: false,
      emptySearchConfig: emptySearchConfig,
      isEmpty: false,
      emptyConfig: emptyConfig,
    },
    loadingProps: {
      isLoading: false,
      className: "",
      message: "Loading smth ...",
    },
  },
};

export const ListWithButtonsInHeader: Story = {
  name: "List with buttons in header",
  args: {
    id: "list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
    header: {
      title: "List with buttons in header title",
      description: "Helpful description",
      id: "list-header-1",
      buttons: [
        {
          id: "list-header-button-2",
          label: "Button 2",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 2 clicked"),
        },
        {
          id: "list-header-button-3",
          label: "Button 3",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 3 clicked"),
        },
        {
          id: "list-header-button-4",
          label: "Button 4",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Button 4 clicked"),
        },
      ],
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

export const ListWithNoPrimaryButtons: Story = {
  name: "List with buttons in items and header",
  args: {
    id: "list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
    isCompact: true,
    header: {
      title: "List with buttons in header title",
      description: "Helpful description",
      id: "list-header-1",
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      buttons: [
        {
          id: "list-header-button-2",
          label: "Button 2",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "announcement-01",
          onClick: () => alert("Announcement clicked"),
        },
        {
          id: "list-header-button-3",
          label: "Button 3",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "bank-note-03",
          onClick: () => alert("Note clicked"),
        },
        {
          id: "list-header-button-4",
          label: "Button 4",
          intent: "flat",
          color: "default",
          size: "md",
          iconLeft: "x",
          onClick: () => alert("X clicked"),
        },
      ],
    },
    items: [
      {
        id: "list-item-1",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-2",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        buttons: [
          {
            id: "list-header-button-2",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Button 4",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        dropdownConfig: { visibleActionsDisplayLimit: 0 },
        buttons: [
          {
            id: "list-header-button-2",
            label: "Announcement",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "announcement-01",
            onClick: () => alert("Announcement clicked"),
          },
          {
            id: "list-header-button-3",
            label: "Notes",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "bank-note-03",
            onClick: () => alert("Note clicked"),
          },
          {
            id: "list-header-button-4",
            label: "Quit",
            intent: "flat",
            color: "default",
            size: "md",
            iconLeft: "x",
            onClick: () => alert("X clicked"),
          },
        ],
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
            id: "default",
            label: "Default",
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
            id: "default-1",
            label: "Default 1",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "arrow-right",
          },
          {
            id: "default-2",
            label: "Default 2",
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
  render: (args: ListProps<ListItemProps>) => {
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
    collapsibleProps: {
      initiallyOpen: true,
    },
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

export const LongDescriptionTruncation: Story = {
  name: "List With Long Descriptions",
  args: {
    id: "list-long-descriptions",
    header: {
      title: "Long Descriptions Example",
      description: "Demonstrating line-clamp-1 behavior for descriptions",
      id: "list-header-long-desc",
    },
    items: [
      {
        id: "list-item-short",
        title: "Short Description Example",
        description: "This is a short description that fits in one line.",
      },
      {
        id: "list-item-long",
        title: "Long Description Example",
        description:
          "This is a very long description that should be truncated with an ellipsis because it exceeds the width of a single line. The line-clamp-1 utility class ensures that this text is displayed on a single line only, with an ellipsis at the end to indicate there is more content.",
      },
      {
        id: "list-item-very-long",
        title: "Very Long Description With No Spaces",
        description:
          "ThisIsAnExtremelyLongDescriptionWithNoSpacesWhichShouldAlsoBeTruncatedWithAnEllipsisToPreventLayoutIssuesAndEnsureTheUIRemainsCleanAndConsistentEvenWithUnusualContentLikeThisVeryLongWordWithoutAnySpacesInIt.",
      },
      {
        id: "list-item-special-chars",
        title: "Special Characters",
        description:
          "Description with special characters: !@#$%^&*()_+{}|:\"<>?~`-=[]\\;',./αβγδεζηθικλμνξοπρστυφχψω",
      },
    ],
  },
};

export const LoadingList: Story = {
  args: {
    loadingProps: {
      isLoading: true,
      message: "Loading smth...",
    },
  },
};

export const ListWithButtonDropdownInItems: Story = {
  name: "List With Button Dropdown In Items",
  args: {
    id: "list-1",
    collapsibleProps: {
      initiallyOpen: true,
    },
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
        buttons: [
          {
            id: "default-1",
            label: "Default 1",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "arrow-right",
          },
          {
            id: "default-2",
            label: "Default 2",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "refresh-cw-01",
          },
        ],
      },
      {
        id: "list-item-3",
        title: "Playing with fonts is fun",
        rightTitle: "Right title",
        description: "Playing with fonts is fun",
        buttons: [
          {
            id: "open-new-window",
            label: "Open new window",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "plus",
            onClick: () => window?.open(""),
          },
          {
            id: "console-log",
            label: "Console log",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "file-06",
            onClick: () => console.log("I am console logging hello"),
          },
          {
            id: "alert-action",
            label: "Alert popping",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "announcement-01",
            onClick: () => alert("I am alerting"),
          },
          {
            id: "print-hello",
            label: "Print hello",
            size: "md",
            intent: "flat",
            color: "default",
            iconLeft: "bell-ringing-04",
            onClick: () => alert("Hello to the one who pushed the button"),
          },
        ],
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

export const CompactListOfAvatar: Story = {
  name: "Compact List Of Avatar",
  args: {
    id: "compact-list-avatar",
    isCompact: true,
    items: [
      {
        id: "list-item-1",
        avatar: {
          alt: "Avatar 1",
          initials: "A1",
          shape: "round",
          size: "sm",
        },
        title: "Emma Johnson",
        buttons: [
          {
            id: "plus-compact-1",
            size: "sm",
            intent: "flat",
            color: "default",
            iconLeft: "plus",
          },
        ],
      },
      {
        id: "list-item-1",
        avatar: {
          alt: "Avatar 1",
          initials: "A1",
          shape: "round",
          size: "sm",
        },
        title: "Lucas Jackson",
        buttons: [
          {
            id: "plus-compact-1",
            size: "sm",
            intent: "flat",
            color: "default",
            iconLeft: "plus",
          },
        ],
      },
      {
        id: "list-item-1",
        avatar: {
          alt: "Avatar 1",
          initials: "A1",
          shape: "round",
          size: "sm",
        },
        title: "Sophie Miller",
        buttons: [
          {
            id: "plus-compact-1",
            size: "sm",
            intent: "flat",
            color: "default",
            iconLeft: "plus",
          },
        ],
      },
    ],
  },
};

const sharedConfig: ListItemProps = {
  id: "placeholder",
  title: "Playing with fonts is fun",
  rightTitle: "See here ->",
  buttons: [
    {
      id: "button",
      label: "A button",
      size: "md",
      intent: "flat",
      color: "default",
    },
    {
      id: "button-in-dropdown",
      label: "A dropdown",
      size: "md",
      intent: "flat",
      color: "default",
    },
  ],
  dropdownConfig: {
    visibleActionsDisplayLimit: 1,
  },
  chips: [
    {
      label: "A chip",
      type: "weak",
      color: "default",
      size: "lg",
    },
  ],
  chipsDirection: "start",
} as const;

export const WithCustomNode: Story = {
  name: "List With Custom Node in Items",
  args: {
    id: "list-1",

    items: [
      {
        ...sharedConfig,
        id: "list-item-1",
        customNode: (
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Icon
                  icon="info-circle"
                  size="sm"
                  onMouseEnter={() => setIsPopoverOpened(true)}
                  onMouseLeave={() => setIsPopoverOpened(false)}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement="bottom-left">
              {() => <p>Hello world</p>}
            </Popover.Content>
          </Popover>
        ),
      },
      {
        ...sharedConfig,
        id: "list-item-2",
        customNode: (
          <CopyToClipboard
            color="critical"
            intent="call-to-action"
            size="sm"
            label="Copy me !"
            value="Hidden value"
          />
        ),
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
