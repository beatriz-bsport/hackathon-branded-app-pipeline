import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Tabs, { orientations } from "./Tabs";

/**
 * A component that renders a set of tabs.<br>
 * One tab is composed of a unique label and reprensented by an anchor tag that may be used to navigate to another page.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=1186-12365" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Tabs> = {
  component: Tabs,
  argTypes: {
    tabs: {
      control: { type: "object" },
      table: {
        type: {
          summary: "array",
          detail:
            "[{id: string, label: string, href?: string, target?: string, disabled?: boolean, icon?: string}]",
        },
      },
    },
    TabsItems: {
      control: { type: "object" },
      table: {
        type: {
          summary: "Array<ReactNode>",
        },
      },
    },
    orientation: {
      options: Object.keys(orientations),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    defaultValue: {
      control: { type: "text" },
    },
    value: {
      control: { type: "text" },
    },
    onValueChange: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const tabs = [
  {
    id: "tab-1",
    label: "Tab 1",
    href: "#",
    target: "_self",
    disabled: false,
    icon: "arrow-right" as const,
  },
  {
    id: "tab-2",
    label: "Tab 2",
    disabled: false,
    icon: "message-question-square" as const,
  },
  {
    id: "tab-3",
    label: "Tab 3",
    disabled: false,
    icon: "message-alert-square" as const,
  },
  {
    id: "tab-4",
    label: "Tab 4",
    disabled: false,
  },
  {
    id: "tab-5",
    label: "Tab disabled",
    disabled: true,
  },
];

export const TabsWithInternalState: Story = {
  name: "Tabs with object declaration & Internal state",
  args: {
    tabs,
    orientation: "horizontal",
    defaultValue: "tab-2",
  },
};

export const TabsWithManagedState: Story = {
  name: "Tabs with object declaration & Internal state",
  args: {
    tabs,
    orientation: "horizontal",
    defaultValue: "tab-2",
  },
  render: (args) => {
    const [selectedTab, setSelectedTab] = useState("tab-1");
    return (
      <Tabs {...args} value={selectedTab} onValueChange={setSelectedTab} />
    );
  },
};

export const TabsWithComposition: Story = {
  name: "Tabs with composition",
  args: {
    orientation: "horizontal",
  },
  render: (args) => {
    const [selectedTab, setSelectedTab] = useState("tab-1");

    // Replace what should be at the end a React Router Link
    const MockReactRouterLink = ({
      to,
      id,
      children,
    }: {
      to?: string;
      id: string;
      children: (props: { isActive: boolean }) => React.ReactNode;
    }) => {
      const isActive = id === selectedTab;
      const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedTab(id);
      };

      return (
        <a href={to} onClick={handleClick}>
          {children({ isActive })}
        </a>
      );
    };

    return (
      <Tabs
        orientation={args.orientation}
        TabsItems={tabs.map((value) => (
          <MockReactRouterLink to={value.href} id={value.id} key={value.id}>
            {({ isActive }) => (
              <Tabs.Item
                {...value}
                isActive={isActive}
                orientation={args.orientation}
              />
            )}
          </MockReactRouterLink>
        ))}
      />
    );
  },
};

export const TabsWithDisabledResponsive: Story = {
  name: "Tabs with responsive disabled",
  args: {
    tabs,
    orientation: "horizontal",
    defaultValue: "tab-2",
    disableResponsive: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `disableResponsive` prop to opt-out of responsive behavior and always show regular tabs, even on mobile.",
      },
    },
  },
};
