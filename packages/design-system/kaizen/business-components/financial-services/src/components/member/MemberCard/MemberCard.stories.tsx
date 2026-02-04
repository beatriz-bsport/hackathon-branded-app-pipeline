import type { Meta, StoryObj } from "@storybook/react-vite";

import MemberCard, { type MemberCardData } from "./MemberCard";

const meta: Meta<typeof MemberCard> = {
  component: MemberCard,
  title: "MemberCard",
  parameters: {
    layout: "centered",
    viewport: {
      defaultViewport: "responsive",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MemberCard>;

const mockMember: MemberCardData = {
  name: "John Doe",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  photo: "https://i.pravatar.cc/150?img=12",
};

export const Default: Story = {
  args: {
    member: mockMember,
    onEditClick: () => {
      console.log("Edit clicked");
    },
  },
};

export const WithoutPhoto: Story = {
  args: {
    member: {
      ...mockMember,
      photo: undefined,
    },
    onEditClick: () => {
      console.log("Edit clicked");
    },
  },
};

export const WithoutEmail: Story = {
  args: {
    member: {
      ...mockMember,
      email: "",
    },
    onEditClick: () => {
      console.log("Edit clicked");
    },
  },
};
