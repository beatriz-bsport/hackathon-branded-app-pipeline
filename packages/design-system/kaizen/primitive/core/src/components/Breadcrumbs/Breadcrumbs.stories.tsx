import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";

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

export const Primary: Story = {
  name: "Breadcrumbs",
  args: {
    breadcrumbsItems: [
      {
        id: "breadcrumb-item-1",
        text: "Breadcrumb-item",
        iconLeft: "arrow-right",
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
  },
};
