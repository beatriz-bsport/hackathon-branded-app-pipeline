import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MenuOption } from "#src/components/Menu/types";

import Autocomplete from "./Autocomplete";

/**
 * This component is a text input field that offers autocompletion from a set of items.<br>
 * It functions by filtering these items according to the user's input and displaying them in a popover.<br>
 * Debounces the `onChange` callback if supplied, otherwise filters items.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2474-3186" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  argTypes: {
    textfieldProps: {
      control: "object",
    },
    fullWidth: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const items = [
  {
    title: "Europe",
    options: [
      { id: "english", label: "English" },
      { id: "french", label: "French" },
      { id: "german", label: "German" },
      { id: "spanish", label: "Spanish" },
      { id: "portuguese", label: "Portuguese" },
      { id: "russian", label: "Russian" },
    ],
  },
  {
    title: "Asia",
    options: [
      { id: "japanese", label: "Japanese" },
      { id: "korean", label: "Korean" },
      { id: "chinese", label: "Chinese" },
      { id: "hindi", label: "Hindi" },
      { id: "thai", label: "Thai" },
    ],
  },
  {
    title: "Africa",
    options: [
      { id: "swahili", label: "Swahili" },
      { id: "arabic", label: "Arabic" },
      { id: "yoruba", label: "Yoruba" },
      { id: "zulu", label: "Zulu" },
      { id: "amharic", label: "Amharic" },
    ],
  },
  {
    title: "Americas",
    options: [
      { id: "spanish-americas", label: "Spanish" },
      { id: "english-americas", label: "English" },
      { id: "portuguese-brazil", label: "Portuguese (Brazil)" },
      { id: "guarani", label: "Guarani" },
      { id: "quechua", label: "Quechua" },
    ],
  },
  {
    title: "Oceania",
    options: [
      { id: "english-oceania", label: "English" },
      { id: "maori", label: "Maori" },
      { id: "samoan", label: "Samoan" },
      { id: "tongan", label: "Tongan" },
      { id: "fijian", label: "Fijian" },
    ],
  },
];

export const Primary: Story = {
  name: "Autocomplete",
  args: {
    textfieldProps: {
      id: "autocomplete-1",
      label: "Autocomplete",
      placeholder: "Select an option",
      status: "default",
    },
    items,
    fullWidth: false,
  },
};

export const AutocompleteItemsWithoutTitle: Story = {
  name: "Autocomplete Items Without Title",
  args: {
    textfieldProps: {
      id: "autocomplete-1",
      label: "Autocomplete",
      placeholder: "Select an option",
      status: "default",
    },
    items: [
      { id: "english", label: "English" },
      { id: "french", label: "French" },
      { id: "german", label: "German" },
      { id: "spanish", label: "Spanish" },
      { id: "portuguese", label: "Portuguese" },
      { id: "russian", label: "Russian" },
    ],
    fullWidth: false,
  },
};

export const AutocompleteCustomOnChange: Story = {
  name: "Autocomplete Custom OnChange",
  render: (args) => {
    const [filteredItems, setFilteredItems] = useState(args.items);

    const handleChange = (value: string) => {
      // Simulate fetching items from an API ...
      const fetchedItems = args.items;

      // Filter the items based on the search value
      const filteredCustom =
        Array.isArray(fetchedItems[0]) || "title" in fetchedItems[0]
          ? (fetchedItems as { title: string; options: MenuOption[] }[])
              .map((group) => {
                // Filter options in each group
                const filteredOptions = group.options.filter((option) =>
                  option.label.toLowerCase().includes(value.toLowerCase()),
                );

                // If there are filtered options, include the group
                if (filteredOptions.length > 0) {
                  return { ...group, options: filteredOptions };
                }

                return null;
              })
              .filter((group) => group !== null)
          : (fetchedItems as MenuOption[]).filter((item) =>
              item.label.toLowerCase().includes(value.toLowerCase()),
            );

      setFilteredItems(filteredCustom);
    };

    return (
      <div className="flex flex-col gap-md">
        <div className="h-[700px] bg-[#777]"></div>
        <Autocomplete
          {...args}
          items={filteredItems}
          onValueChange={handleChange}
        />
      </div>
    );
  },
  args: {
    textfieldProps: {
      id: "autocomplete-2",
      label: "Custom Autocomplete that filters options only",
      placeholder: "Choose a language",
      status: "default",
      iconRight: "chevron-down",
    },
    items,
    fullWidth: true,
  },
};
