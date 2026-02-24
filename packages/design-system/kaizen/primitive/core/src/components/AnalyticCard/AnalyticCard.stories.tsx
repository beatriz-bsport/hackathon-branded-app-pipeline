import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Body from "#src/components/Body";
import Link from "#src/components/Link";

import AnalyticCard, { Placements } from "./AnalyticCard";

/**
 * Display-only card for analytics-style metrics. Composes Card, Body, Icon and Popover.
 * Shows a title, a prominent figure, an optional subtitle, and an optional info icon
 * that opens a popover on hover or click.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=5697-18089&node-type=canvas&t=obgdPQCjAySQE353-0" target="_blank">Figma</a>
 */
const meta: Meta<typeof AnalyticCard> = {
  component: AnalyticCard,
  argTypes: {
    title: {
      control: { type: "text" },
      table: { type: { summary: "string" } },
    },
    figure: {
      control: { type: "text" },
      table: { type: { summary: "string" } },
    },
    subtitle: {
      control: { type: "text" },
      table: { type: { summary: "string" } },
    },
    infoContent: {
      table: { type: { summary: "ReactNode" } },
    },
    infoPopoverPlacement: {
      options: Placements,
      control: { type: "select" },
      table: {
        type: { summary: "Placement" },
        defaultValue: { summary: "bottom-right" },
      },
    },
    fullWidth: {
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AnalyticCard>;

export const Default: Story = {
  name: "Default",
  args: {
    title: "Delivery rate",
    figure: "99%",
  },
};

export const WithSubtitle: Story = {
  name: "With subtitle",
  args: {
    title: "Delivery rate",
    figure: "99%",
    subtitle: "99 emails delivered",
  },
};

export const WithInfoPopover: Story = {
  name: "With info popover",
  args: {
    title: "Delivery rate",
    figure: "99%",
    subtitle: "99 emails delivered",
    infoContent:
      "Delivery rate is the percentage of emails that were successfully delivered to recipients' inboxes.",
  },
};

export const WithInfoPopoverAndLink: Story = {
  name: "With info popover and link",
  args: {
    title: "Open rate",
    figure: "50%",
    subtitle: "50 recipients opened the email",
    infoContent: (
      <div className="flex flex-col gap-xs">
        <Body size="sm" color="default" htmlVariant="p">
          Open rate is the percentage of recipients who opened the email.{" "}
          <Link href="#" color="main">
            Learn more about open rates
          </Link>
        </Body>
      </div>
    ),
  },
};

export const CustomPlacement: Story = {
  name: "Custom popover placement",
  args: {
    title: "Click rate",
    figure: "50%",
    subtitle: "50 recipients clicked at least once",
    infoContent:
      "Click rate shows how many recipients clicked a link in the email.",
    infoPopoverPlacement: "top-right",
  },
};

export const FullWidth: Story = {
  name: "Full width",
  render: (args) => (
    <div className="flex w-full max-w-md flex-col gap-md">
      <AnalyticCard
        {...args}
        fullWidth
        title="Delivery rate"
        figure="99%"
        subtitle="99 emails delivered"
      />
    </div>
  ),
  args: {
    fullWidth: true,
  },
};

export const FullWidthVsContentSize: Story = {
  name: "Full width vs content size",
  render: () => (
    <div className="flex w-full max-w-2xl flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <Body size="sm" color="weak" htmlVariant="p">
          fullWidth=true (expands to container)
        </Body>
        <div className="flex w-full">
          <AnalyticCard
            fullWidth
            title="Delivery rate"
            figure="99%"
            subtitle="99 emails delivered"
          />
        </div>
      </div>
      <div className="flex flex-col gap-xs">
        <Body size="sm" color="weak" htmlVariant="p">
          fullWidth=false (sizes to content)
        </Body>
        <div className="flex w-full">
          <AnalyticCard
            title="Delivery rate"
            figure="99%"
            subtitle="99 emails delivered"
          />
        </div>
      </div>
    </div>
  ),
};

export const CampaignPerformance: Story = {
  name: "Campaign performance (three in a row)",
  render: (args) => (
    <div className="flex flex-col gap-lg">
      <Body size="lg" color="default" weight="strong" htmlVariant="p">
        Campaign performance
      </Body>
      <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
        <AnalyticCard
          title="Delivery rate"
          figure="99%"
          subtitle="99 emails delivered"
          infoContent="Delivery rate is the percentage of emails that were successfully delivered to recipients' inboxes."
          infoPopoverPlacement={args.infoPopoverPlacement}
          fullWidth={args.fullWidth}
        />
        <AnalyticCard
          title="Open rate"
          figure="50%"
          subtitle="50 recipients opened the email"
          infoContent="Open rate is the percentage of recipients who opened the email."
          infoPopoverPlacement={args.infoPopoverPlacement}
          fullWidth={args.fullWidth}
        />
        <AnalyticCard
          title="Click rate"
          figure="50%"
          subtitle="50 recipients clicked at least once"
          infoContent="Click rate shows how many recipients clicked at least one link in the email."
          infoPopoverPlacement={args.infoPopoverPlacement}
          fullWidth={args.fullWidth}
        />
      </div>
    </div>
  ),
  args: {
    infoPopoverPlacement: "bottom-right",
  },
};
