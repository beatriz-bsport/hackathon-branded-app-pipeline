import type { Meta, StoryObj } from "@storybook/react-vite";

import ItemAutocomplete, {
  ITEM_AUTOCOMPLETE_ITEM_KINDS,
} from "./ItemAutocomplete";

const meta: Meta<typeof ItemAutocomplete> = {
  component: ItemAutocomplete,
  argTypes: {
    itemType: {
      control: { type: "select" },
      options: Object.keys(ITEM_AUTOCOMPLETE_ITEM_KINDS),
    },
  },
};

export default meta;

type Story = StoryObj<typeof ItemAutocomplete>;

export const Primary: Story = {
  name: "ItemAutocomplete",
  args: {
    itemType: ITEM_AUTOCOMPLETE_ITEM_KINDS.pass,
    textfieldProps: {
      label: "Item",
      placeholder: "Search an item...",
    },
  },
};
