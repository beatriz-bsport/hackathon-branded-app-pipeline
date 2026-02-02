import type { Meta, StoryObj } from "@storybook/react-vite";

import ExpandableSearchInput from "./ExpandableSearchInput";

/**
 * The ExpandableSearchInput component provides interactive search functionality by utilizing a TextField.<br>
 * Users can click the search icon to reveal or hide the input field for entering queries.<br>
 * The component's appearance and animation are influenced by the position prop,
 * which determines the direction from which the input field expands.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=7445-50370" target="_blank">Figma</a>
 */
const meta: Meta<typeof ExpandableSearchInput> = {
  component: ExpandableSearchInput,
  argTypes: {
    id: {
      control: { type: "text" },
    },
    placeholder: {
      control: { type: "text" },
    },
    position: {
      options: ["left", "right"],
      control: { type: "inline-radio" },
    },
    maxWidth: {
      control: { type: "number" },
    },
    inputValue: {
      control: { type: "text" },
    },
    onInputValueChange: {
      action: "onInputValueChange",
    },
    onButtonClick: {
      action: "onButtonClick",
    },
    onClear: {
      action: "onClear",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ExpandableSearchInput>;

export const Primary: Story = {
  name: "ExpandableSearchInput",
  args: {
    id: "expandable-search-1",
    placeholder: "Search",
    position: "left",
    inputValue: "",
    maxWidth: 200,
    onInputValueChange: (value) => console.log(value),
    onButtonClick: () => console.log("Search button clicked"),
    onClear: () => console.log("Clear button clicked"),
  },
};
