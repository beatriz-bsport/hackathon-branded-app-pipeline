import type { Meta, StoryObj } from "@storybook/react";

import EmptyState from "./EmptyState";

/**
 * Internal component used to display empty list states, with two variants :<br>
 * Whether the list is empty by filtering (no-results-found) or not (empty-state, default variant).<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=3204-19671&p=f&t=81XxOuted9WeT1Bv-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  argTypes: {
    variant: {
      table: {
        type: {
          summary: "empty-state | no-results-found",
        },
      },
    },
    ctaButtonConfig: {
      table: {
        type: {
          summary: "ButtonProps",
        },
      },
    },
    secondaryButtonConfig: {
      table: {
        type: {
          summary: "ButtonProps",
        },
      },
    },
    children: {
      table: {
        type: {
          summary: "ReactNode",
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const CompleteConfiguration: Story = {
  name: "Empty state fully configured",
  args: {
    title: "No email templates yet",
    subtitle: "Create email templates to easily contact your members",
    className: "max-w-[320px]",
    ctaButtonConfig: {
      iconLeft: "award-03",
      label: "Create template",
      onClick: () => console.log("Create email template"),
    },
    secondaryButtonConfig: {
      iconLeft: "bank-note-03",
      label: "Add category",
      onClick: () => console.log("Create a new category"),
    },
  },
};

export const FilterEmptyResults: Story = {
  name: "Empty filter results",
  args: {
    subtitle:
      "No members match your filters.\nTry clearing them to see more results",
    className: "max-w-[320px]",
    secondaryButtonConfig: {
      label: "Clear filters",
      onClick: () => console.log("Clear the filters"),
    },
    variant: "no-results-found",
  },
};

export const CustomFilterEmptyResults: Story = {
  name: "Custom empty filter results",
  args: {
    title: "Custom title",
    subtitle: "No members match your filters.",
    className: "max-w-[320px]",
    secondaryButtonConfig: {
      label: "Custom cta",
      onClick: () => console.log("Clear the filters"),
    },
    variant: "no-results-found",
  },
};

export const EmptyStateWithCTAOnly: Story = {
  name: "Empty state with CTA Only",
  args: {
    title: "No members yet",
    subtitle: "Start adding members in your studio",
    className: "max-w-[320px]",
    ctaButtonConfig: {
      iconLeft: "book-closed",
      label: "Add member",
      onClick: () => console.log("Create a member"),
    },
  },
};

export const EmptyStateWithoutButtons: Story = {
  name: "Empty state without buttons",
  args: {
    title: "No archived members",
    subtitle: "You have not archived any member yet",
    className: "max-w-[320px]",
  },
};
