import type { Meta, StoryObj } from "@storybook/react-vite";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { Channel, type ChannelType } from "./channel";

const CHANNELS: ChannelType[] = ["email", "sms", "push", "chat"];

const meta: Meta<typeof Channel> = {
  title: "Inbox/Channel",
  component: Channel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Compact channel marker for Inbox messages.",
      },
    },
  },
  decorators: storybookDecorator,
  argTypes: {
    channel: {
      control: "select",
      options: CHANNELS,
    },
  },
  args: {
    channel: "email",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Channel>;

export const Default: Story = {};

export const AllChannels: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-sm text-onsurface-weak">
      {CHANNELS.map((channel) => (
        <Channel key={channel} {...args} channel={channel} />
      ))}
    </div>
  ),
};

export const Contexts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md">
      <div className="rounded-md border border-stroke-thin border-stroke-weak bg-surface-page-navigation p-sm text-onsurface-weak">
        <Channel {...args} channel="email" />
        <p className="mt-2xs text-body-xs text-onsurface-weak">
          Incoming / member message - onsurface-weak
        </p>
      </div>

      <div className="rounded-md bg-surface-main-weak p-sm text-onsurface-main-strong">
        <Channel {...args} channel="email" />
        <p className="mt-2xs text-body-xs">
          Outgoing / studio message - onsurface-main-strong on surface-main-weak
        </p>
      </div>
    </div>
  ),
};
