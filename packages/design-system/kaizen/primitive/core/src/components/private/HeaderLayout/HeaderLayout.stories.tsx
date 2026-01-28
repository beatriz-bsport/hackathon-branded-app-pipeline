import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Popover from "#src/components/Popover";
import Select from "#src/components/Select";
import Tooltip, { withTooltip } from "#src/components/Tooltip";
import { MenuOption } from "#src/index";

import HeaderLayout from "./HeaderLayout";
import { useAdaptiveActions } from "./use-adaptive-actions";

const ButtonWithTooltip = withTooltip(Button);

const CATEGORIES = {
  DATA_ACTIONS: "Actions related to data : filter, search, display",
  CUSTOM_ACTIONS: "Custom actions",
  NAVIGATION: "Page navigation section",
};

/**
 * **This component is an internal component. It should not be used directly in your apps !**<br>
 * Please refer to ListLayout or DetailsLayout components for proper usage.<br><br>
 * A configurable header component designed for B2B pages.<br>
 * It provides a consistent layout for all pages, while supporting various features
 * such as breadcrumbs, tabs, filters, and custom actions.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=9463-59076&t=9IwGiqrl7BAz2nCl-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof HeaderLayout> = {
  component: HeaderLayout,
  argTypes: {
    breadcrumbsItems: {
      table: {
        type: {
          detail:
            "Array<{\n\tid: string;\n\ttext: string;\n\tactive?: boolean;\n\ticonLeft?: IconName;\n}>",
          summary: "Array<BreadcrumbItemProps>",
        },
        category: CATEGORIES.NAVIGATION,
      },
    },
    callToActionButton: {
      table: {
        category: CATEGORIES.CUSTOM_ACTIONS,
      },
      description: "Main button of custom actions.",
    },
    endGroupActions: {
      table: {
        type: {
          summary: "Array<ReactNode>",
        },
        category: CATEGORIES.CUSTOM_ACTIONS,
      },
      description: "List of ReactNode for custom actions that are not CTAs",
    },
    filterConfig: {
      table: {
        type: { summary: "FilterProps" },
        category: CATEGORIES.DATA_ACTIONS,
      },
    },
    onDisplayPopover: {
      table: {
        type: { summary: "(props) => ReactNode" },
        category: CATEGORIES.DATA_ACTIONS,
      },
    },
    onEditTitleClick: { table: { category: CATEGORIES.NAVIGATION } },

    pageStatusBadge: {
      table: {
        type: {
          summary: "BadgeProps",
        },
        category: CATEGORIES.NAVIGATION,
      },
    },
    pageStatusChip: {
      table: {
        type: {
          summary: "ChipProps",
        },
        category: CATEGORIES.NAVIGATION,
      },
    },
    pageTabs: {
      table: {
        type: {
          summary: "TabsProps",
          detail:
            "{\n\tvalue?: string;\n\tdefaultValue?: string;" +
            "\n\tonValueChange?: (value: string) => void;" +
            "\n\ttabs: Array<{\n\t\tlabel: string;\n\t\thref?: string;" +
            "\n\t\ttarget?: target;\n\t\tdisabled?: boolean;\n\t\ticon?: IconName;\n\t}>;\n}",
        },
        category: CATEGORIES.NAVIGATION,
      },
    },
    pageTitle: { table: { category: CATEGORIES.NAVIGATION } },
    searchConfig: {
      table: {
        type: {
          summary: "ExpandableSearchProps",
          detail:
            "{\n\tid: string;\n\tplaceholder?: string;\n\tposition?: 'left' | 'right';" +
            "\n\tmaxWidth?: number;\n\tinputValue?: string;\n\tonInputValueChange?: (value: string) => void;" +
            "\n\tonButtonClick?: () => void;\n\tonClear?: () => void;\n}",
        },
        category: CATEGORIES.DATA_ACTIONS,
      },
    },
    startGroupActions: {
      table: {
        type: {
          summary: "Array<ReactNode>",
        },
        category: CATEGORIES.CUSTOM_ACTIONS,
      },
      description: "List of ReactNode for custom actions that are not CTAs",
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderLayout>;

const ARGS = {
  BREADCRUMBS_ITEMS: [
    {
      id: "breadcrumb-item-1",
      text: "Breadcrumb-item",
      href: "#",
    },
    {
      id: "breadcrumb-item-2",
      text: "Breadcrumb-item",
      href: "#",
    },
    {
      id: "breadcrumb-item-3",
      text: "Breadcrumb-item",
      active: true,
    },
  ],
  CALL_TO_ACTION_BUTTON: (
    <Button
      key="call-to-action"
      iconLeft="chevron-right-double"
      color="main"
      intent="call-to-action"
      size="md"
      label="CTA Button"
    />
  ),
  END_GROUP_ACTIONS: [
    <Button
      key="chevron-right-button"
      kind="icon-button"
      label="Next"
      icon="chevron-right-double"
      color="main"
      intent="default"
      size="md"
    />,
    <Popover key="popover-example">
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label="Awards"
            icon="award-03"
            intent="default"
            color="main"
            size="md"
            onClick={() => setIsPopoverOpened((prev) => !prev)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {() => {
          return (
            <Select
              key="selector"
              defaultValue="Select something"
              items={[
                { id: "option-1", label: "Option 1" },
                { id: "option-2", label: "Option 2" },
              ]}
            />
          );
        }}
      </Popover.Content>
    </Popover>,
  ],
  FILTER_CONFIG: {
    filters: [
      { id: "is", label: "is" },
      { id: "is-not", label: "is not" },
    ],
    fields: {
      fruit: {
        id: "fruit",
        label: "Fruit",
        availableFilters: ["is", "is-not"],
        values: [
          { id: "apple", label: "Apple" },
          { id: "banana", label: "Banana" },
          { id: "cherry", label: "Cherry" },
        ],
        multiSelect: true,
      },
      vegetable: {
        id: "vegetable",
        label: "Vegetable",
        availableFilters: ["is", "is-not"],
        values: [
          { id: "carrot", label: "Carrot" },
          { id: "broccoli", label: "Broccoli" },
          { id: "spinach", label: "Spinach" },
        ],
        multiSelect: false,
      },
    },
    selectFieldLabel: "Filter",
    onFilterChange: (
      filters: Array<{
        id: number;
        field: string | null;
        filter: string | null;
        valueIds: string[];
      }>,
    ) => console.log("Filters changed:", filters),
  },
  ON_DISPLAY_POPOVER: () => <Body>This is the popover content</Body>,
  ON_EDIT_TITLE_CLICK: () => console.log("You click on edit title !"),
  PAGE_STATUS_BADGE: {
    text: "New",
    size: "sm" as const,
    color: "default" as const,
  },
  PAGE_STATUS_CHIP: {
    label: "Status",
    size: "lg" as const,
    color: "default" as const,
    type: "weak" as const,
  },
  PAGE_TABS: {
    tabs: [
      {
        id: "tab-1",
        label: "Info",
        href: "#",
        target: "_self",
        disabled: false,
        icon: "award-03" as const,
      },
      {
        id: "tab-2",
        label: "Bookings",
        disabled: false,
        icon: "award-03" as const,
      },
      {
        id: "tab-3",
        label: "VOD",
        disabled: false,
        icon: "award-03" as const,
      },
    ],
    orientation: "horizontal" as const,
    defaultValue: "Info",
    value: "",
    onValueChange: undefined,
  },
  SEARCH_CONFIG: {
    id: "expandable-search",
  },
  START_GROUP_ACTIONS: [
    <Button
      key="bank-note-button"
      kind="icon-button"
      label="Bank note"
      icon="bank-note-03"
      intent="default"
      color="main"
      size="md"
    />,
    <Tooltip key="calendar-button" label="Super tooltip" className="h-full">
      <Button
        key="calendar-button"
        kind="icon-button"
        label="Calendar"
        icon="calendar"
        intent="default"
        color="main"
        size="md"
      />
    </Tooltip>,
  ],
};

export const CompleteConfiguration: Story = {
  name: "Complete configuration",
  args: {
    breadcrumbsItems: ARGS.BREADCRUMBS_ITEMS,
    callToActionButton: ARGS.CALL_TO_ACTION_BUTTON,
    endGroupActions: ARGS.END_GROUP_ACTIONS,
    filterConfig: ARGS.FILTER_CONFIG,
    onDisplayPopover: ARGS.ON_DISPLAY_POPOVER,
    onEditTitleClick: ARGS.ON_EDIT_TITLE_CLICK,
    pageStatusBadge: ARGS.PAGE_STATUS_BADGE,
    pageStatusChip: undefined,
    pageTabs: ARGS.PAGE_TABS,
    pageTitle: "Header with complete configuration",
    searchConfig: ARGS.SEARCH_CONFIG,
    startGroupActions: ARGS.START_GROUP_ACTIONS,
  },
};

export const BasicConfiguration: Story = {
  name: "Basic configuration",
  args: {
    callToActionButton: ARGS.CALL_TO_ACTION_BUTTON,
    filterConfig: ARGS.FILTER_CONFIG,
    onDisplayPopover: ARGS.ON_DISPLAY_POPOVER,
    pageStatusBadge: ARGS.PAGE_STATUS_BADGE,
    pageTitle: "Header with basic configuration",
    searchConfig: ARGS.SEARCH_CONFIG,
  },
};

export const MinimalConfiguration: Story = {
  name: "Minimal configuration",
  args: {
    pageTitle: "Header with minimal configuration",
  },
};

export const ConfigWithButtonsOnly: Story = {
  name: "With Buttons only",
  args: {
    pageTitle: "Header with buttons only",
    callToActionButton: ARGS.CALL_TO_ACTION_BUTTON,
    endGroupActions: ARGS.END_GROUP_ACTIONS,
  },
};

export const LongGermanTitle: Story = {
  name: "With Long German Title",
  args: {
    pageTitle:
      "ÜbermäßigLangesZusammengesetztesWortFürStudioManagementSystemKonfigurationsEinstellungenUndWeitereUntersuchungen",
    callToActionButton: ARGS.CALL_TO_ACTION_BUTTON,
    endGroupActions: ARGS.END_GROUP_ACTIONS,
  },
};

export const ConfigWithClickDataActions: Story = {
  name: "With Click Data Actions",
  args: {
    onDisplayPopover: ARGS.ON_DISPLAY_POPOVER,
    pageTitle: "Header with click data actions",
    searchConfig: ARGS.SEARCH_CONFIG,
  },
};

export const ConfigWithAllDataActions: Story = {
  name: "With All Data Actions",
  args: {
    filterConfig: ARGS.FILTER_CONFIG,
    onDisplayPopover: ARGS.ON_DISPLAY_POPOVER,
    pageTitle: "Header with all data actions",
    searchConfig: ARGS.SEARCH_CONFIG,
  },
};

export const ConfigWithPageActionsOnly: Story = {
  name: "With Page Actions only",
  args: {
    breadcrumbsItems: ARGS.BREADCRUMBS_ITEMS,
    callToActionButton: ARGS.CALL_TO_ACTION_BUTTON,
    endGroupActions: ARGS.END_GROUP_ACTIONS,
    onEditTitleClick: ARGS.ON_EDIT_TITLE_CLICK,
    pageTabs: ARGS.PAGE_TABS,
    pageTitle: "The Name Of My Great Page",
    startGroupActions: ARGS.START_GROUP_ACTIONS,
  },
};

export const WithTooltipAroundSearch: Story = {
  args: {
    pageTitle: "Header with default tooltip around search",
    searchConfig: {
      tooltipConfig: {},
      id: "search",
    },
  },
};

export const TabsWithCTAs: Story = {
  name: "Tabs with CTAs",
  args: {
    pageTitle: "Email templates",
    pageTabs: {
      tabs: [
        { id: "custom", label: "Custom templates" },
        { id: "default", label: "Default templates" },
        { id: "bsport", label: "bsport templates" },
      ],
      orientation: "horizontal" as const,
      defaultValue: "Custom templates",
    },
    endGroupActions: [
      <Button
        key="add-category-btn"
        intent="default"
        color="main"
        size="md"
        iconLeft="plus"
        label="Add category"
      />,
    ],
    callToActionButton: (
      <Button
        key="create-template-btn"
        intent="call-to-action"
        color="main"
        size="md"
        iconLeft="plus"
        label="Create template"
      />
    ),
  },
};

export const WithAdaptiveActions: Story = {
  name: "With Adaptive Actions (Hook Demo)",
  render: () => {
    const adaptiveActions = useAdaptiveActions({
      startGroupActions: [
        <Button
          key="export-btn"
          iconLeft="download-01"
          intent="flat"
          color="default"
          size="md"
          label="Export"
          onClick={() => console.log("Export clicked")}
        />,
        <ButtonWithTooltip
          key="share-btn"
          iconLeft="share-03"
          intent="flat"
          color="default"
          size="md"
          label="Share"
          onClick={() => console.log("Share clicked")}
          tooltipProps={{ label: "Share this content" }}
        />,
      ],
      endGroupActions: [
        <ButtonWithTooltip
          key="edit-btn"
          iconLeft="edit-02"
          intent="flat"
          color="default"
          size="md"
          label="Edit"
          onClick={() => console.log("Edit clicked")}
          tooltipProps={{ label: "Edit this item" }}
        />,
        <Button
          key="delete-btn"
          iconLeft="trash-01"
          intent="flat"
          color="default"
          size="md"
          label="Delete"
          onClick={() => console.log("Delete clicked")}
        />,
      ],
    });

    return (
      <HeaderLayout
        pageTitle="Adaptive Actions Demo"
        pageStatusBadge={ARGS.PAGE_STATUS_BADGE}
        {...adaptiveActions}
      />
    );
  },
};

// Mock API data for different continents
const mockApiData = {
  europe: [
    { id: "london", label: "London", description: "Capital of United Kingdom" },
    { id: "paris", label: "Paris", description: "Capital of France" },
    { id: "berlin", label: "Berlin", description: "Capital of Germany" },
    { id: "madrid", label: "Madrid", description: "Capital of Spain" },
    { id: "rome", label: "Rome", description: "Capital of Italy" },
    {
      id: "amsterdam",
      label: "Amsterdam",
      description: "Capital of Netherlands",
    },
    { id: "vienna", label: "Vienna", description: "Capital of Austria" },
    { id: "prague", label: "Prague", description: "Capital of Czech Republic" },
  ],
  asia: [
    { id: "tokyo", label: "Tokyo", description: "Capital of Japan" },
    { id: "seoul", label: "Seoul", description: "Capital of South Korea" },
    { id: "beijing", label: "Beijing", description: "Capital of China" },
    { id: "bangkok", label: "Bangkok", description: "Capital of Thailand" },
    {
      id: "singapore",
      label: "Singapore",
      description: "City-state in Southeast Asia",
    },
    {
      id: "mumbai",
      label: "Mumbai",
      description: "Financial capital of India",
    },
    { id: "delhi", label: "Delhi", description: "Capital of India" },
    { id: "jakarta", label: "Jakarta", description: "Capital of Indonesia" },
  ],
  africa: [
    { id: "cairo", label: "Cairo", description: "Capital of Egypt" },
    { id: "lagos", label: "Lagos", description: "Largest city in Nigeria" },
    {
      id: "johannesburg",
      label: "Johannesburg",
      description: "Largest city in South Africa",
    },
    {
      id: "casablanca",
      label: "Casablanca",
      description: "Largest city in Morocco",
    },
    { id: "nairobi", label: "Nairobi", description: "Capital of Kenya" },
    {
      id: "addis-ababa",
      label: "Addis Ababa",
      description: "Capital of Ethiopia",
    },
    { id: "accra", label: "Accra", description: "Capital of Ghana" },
    { id: "tunis", label: "Tunis", description: "Capital of Tunisia" },
  ],
  americas: [
    { id: "new-york", label: "New York", description: "Largest city in USA" },
    {
      id: "sao-paulo",
      label: "São Paulo",
      description: "Largest city in Brazil",
    },
    {
      id: "mexico-city",
      label: "Mexico City",
      description: "Capital of Mexico",
    },
    { id: "toronto", label: "Toronto", description: "Largest city in Canada" },
    {
      id: "buenos-aires",
      label: "Buenos Aires",
      description: "Capital of Argentina",
    },
    { id: "lima", label: "Lima", description: "Capital of Peru" },
    { id: "bogota", label: "Bogotá", description: "Capital of Colombia" },
    { id: "santiago", label: "Santiago", description: "Capital of Chile" },
  ],
  oceania: [
    { id: "sydney", label: "Sydney", description: "Largest city in Australia" },
    {
      id: "melbourne",
      label: "Melbourne",
      description: "Second largest city in Australia",
    },
    {
      id: "auckland",
      label: "Auckland",
      description: "Largest city in New Zealand",
    },
    {
      id: "wellington",
      label: "Wellington",
      description: "Capital of New Zealand",
    },
    {
      id: "brisbane",
      label: "Brisbane",
      description: "Third largest city in Australia",
    },
    {
      id: "perth",
      label: "Perth",
      description: "Fourth largest city in Australia",
    },
    { id: "suva", label: "Suva", description: "Capital of Fiji" },
    {
      id: "port-moresby",
      label: "Port Moresby",
      description: "Capital of Papua New Guinea",
    },
  ],
};

// Simulate API delay
const simulateApiCall = (
  query: string,
  delay: number = 800,
): Promise<MenuOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allCities = Object.values(mockApiData).flat();
      const filteredCities = allCities.filter(
        (city) =>
          city.label.toLowerCase().includes(query.toLowerCase()) ||
          city.description.toLowerCase().includes(query.toLowerCase()),
      );
      resolve(filteredCities);
    }, delay);
  });
};

export const withAPIMockFilterComponent: Story = {
  name: "With API Mock Filter Component",
  render: (args) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<MenuOption[]>([]);
    const filterConfig = {
      filters: [
        { id: "is", label: "is" },
        { id: "is-not", label: "is not" },
      ],
      fields: {
        city: {
          id: "city",
          label: "City",
          availableFilters: ["is", "is-not"],
          values: searchResults,
          multiSelect: true,
          searchConfig: {
            value: searchValue,
            onChange: (newValue: string) => {
              setSearchValue(newValue);
              simulateApiCall(newValue).then((results) => {
                setSearchResults(results);
              });
            },
            placeholder: "Search for a city...",
          },
        },
        country: {
          id: "country",
          label: "Country",
          availableFilters: ["is", "is-not"],
          values: [
            { id: "usa", label: "USA" },
            { id: "brazil", label: "Brazil" },
            { id: "mexico", label: "Mexico" },
          ],
          multiSelect: false,
        },
      },
      selectFieldLabel: "Filter",
      onFilterChange: (
        filters: Array<{
          id: number;
          field: string | null;
          filter: string | null;
          valueIds: string[];
        }>,
      ) => console.log("Filters changed:", filters),
    };

    return (
      <HeaderLayout
        {...args}
        pageTitle="Header with API Mock Filter Component"
        filterConfig={filterConfig}
      />
    );
  },
};
