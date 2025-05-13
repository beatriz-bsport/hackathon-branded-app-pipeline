import type { Meta, StoryObj } from "@storybook/react";

import Breadcrumbs from "./Breadcrumbs";
import BreadcrumbItem from "./BreadcrumbsItem";

/**
 * Component that show users their current location within a hierarchy of pages or sections.
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=591-6021" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/dropdown-menu/component-overview-JTn1hKTy" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
  argTypes: {
    breadcrumbsItems: {
      control: { type: "object" },
      table: {
        type: {
          summary: "array",
          detail:
            "[{id: string, text: string, active?: boolean, iconLeft?: string}]",
        },
      },
      description:
        "Can contain href, target, rel, and other props from Link component, if not active or collapsed.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

const breadcrumbsItems = [
  {
    id: "breadcrumb-item-1",
    text: "Breadcrumb-item 1",
    iconLeft: "arrow-right" as const,
    href: "#",
  },
  {
    id: "breadcrumb-item-2",
    text: "Breadcrumb-item 2",
    href: "#",
    iconLeft: "award-03" as const,
  },
  {
    text: "Breadcrumb-item 3",
    iconLeft: "bank-note-03" as const,
    active: true,
  },
];

export const DeclarativeConfiguration: Story = {
  args: {
    breadcrumbsItems: breadcrumbsItems,
  },
};

export const ComposableConfiguration: Story = {
  args: {
    BreadcrumbsItems: breadcrumbsItems.map((value, index) => (
      <a key={index} href={value.href}>
        <BreadcrumbItem
          text={value.text}
          isActive={value.active}
          icon={value.iconLeft}
        />
      </a>
    )),
  },
};
