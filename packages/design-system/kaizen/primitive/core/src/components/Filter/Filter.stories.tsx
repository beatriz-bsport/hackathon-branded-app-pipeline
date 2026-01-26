import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";

import Button from "#src/components/Button";

import Filter, { FilterElementState } from "./Filter";

/**
 * Rendering a customizable list of filter items within an ordered list.<br>
 * Provides a flexible way to display filters with optional left and right icons, labels,
 * and dropdown menus for further filtering options.<br>
 * The component maintains its visual state internally, while external state control
 * is facilitated through props callbacks.<br>
 * The number of filter elements is infinite.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=3200-14891" target="_blank">Figma</a>
 */
const meta: Meta<typeof Filter> = {
  component: Filter,
  argTypes: {
    filters: {
      control: { type: "object" },
    },
    fields: {
      control: { type: "object" },
    },
    selectFieldLabel: {
      control: { type: "text" },
    },
    onFilterChange: {
      action: "onFilterChange",
    },
  },
  decorators: [
    (Story) => (
      <div className="p-2xs min-h-[30vh]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Filter>;

const args = {
  filters: [
    { id: "is", label: "is" },
    { id: "is-not", label: "is not" },
  ],
  fields: {
    fruit: {
      id: "fruit",
      label: "Fruit",
      availableFilters: ["is", "is-not"],
      values: [
        { id: "apple", label: "Apple" },
        { id: "banana", label: "Banana" },
        { id: "cherry", label: "Cherry" },
        { id: "date", label: "Date" },
        { id: "elderberry", label: "Elderberry" },
      ],
      multiSelect: true,
    },
    vegetable: {
      id: "vegetable",
      label: "Vegetable",
      availableFilters: ["is", "is-not"],
      values: [
        { id: "carrot", label: "Carrot" },
        { id: "broccoli", label: "Broccoli" },
        { id: "spinach", label: "Spinach" },
        { id: "potato", label: "Potato" },
        { id: "onion", label: "Onion" },
      ],
      multiSelect: false,
    },
  },
  selectFieldLabel: "Select a field",
  onFilterChange: (filters: FilterElementState[]) => {
    console.log(filters);
  },
  singleField: false,
};

export const Primary: Story = {
  name: "Filter",
  args,
};

/**
 * This shows how to reset the filters externally by calling the resetFilters method from the ref.
 */
export const ResetFilters: Story = {
  name: "Reset Filters",
  args,
  render: (args) => {
    const ref = useRef<{ resetFilters: () => void }>(null);

    return (
      <div className="flex flex-col gap-md">
        <Filter {...args} ref={ref} />
        <Button
          intent="call-to-action"
          color="critical"
          size="sm"
          label="Reset Filters"
          onClick={() => ref.current?.resetFilters()}
          className="w-fit"
        />
      </div>
    );
  },
};

export const FilterWithSingleChoice: Story = {
  name: "Filter with single choice",
  args: {
    ...args,
    singleField: true,
  },
};

export const FilterWithSingleCategory: Story = {
  name: "Filter with single category",
  args: {
    ...args,
    fields: {
      fruit: {
        id: "fruit",
        label: "Fruit",
        availableFilters: ["is", "is-not"],
        values: [
          { id: "apple", label: "Apple" },
          { id: "banana", label: "Banana" },
          { id: "cherry", label: "Cherry" },
        ],
        multiSelect: false,
      },
    },
    singleField: true,
  },
};

const FRUIT_ITEMS = [
  { id: "apple", label: "Apple" },
  { id: "banana", label: "Banana" },
  { id: "cherry", label: "Cherry" },
  { id: "date", label: "Date" },
  { id: "elderberry", label: "Elderberry" },
  { id: "fig", label: "Fig" },
  { id: "grape", label: "Grape" },
  { id: "honeydew", label: "Honeydew" },
];
const VEGETABLE_ITEMS = [
  { id: "carrot", label: "Carrot" },
  { id: "broccoli", label: "Broccoli" },
  { id: "spinach", label: "Spinach" },
  { id: "potato", label: "Potato" },
  { id: "onion", label: "Onion" },
  { id: "lettuce", label: "Lettuce" },
  { id: "cabbage", label: "Cabbage" },
  { id: "celery", label: "Celery" },
];
export const FilterWithSearch: Story = {
  name: "Filter with search",
  args,
  render: (args) => {
    const [searchFruitValues, setSearchFruitValues] = useState("");
    const [searchVegetableValues, setSearchVegetableValues] = useState("");
    const fruitValues = FRUIT_ITEMS.filter((fruit) =>
      fruit.label.toLowerCase().includes(searchFruitValues.toLowerCase()),
    );
    const vegetableValues = VEGETABLE_ITEMS.filter((vegetable) =>
      vegetable.label
        .toLowerCase()
        .includes(searchVegetableValues.toLowerCase()),
    );
    const props = {
      ...args,
      fields: {
        fruit: {
          id: "fruit",
          label: "Fruit",
          availableFilters: ["is", "is-not"],
          values: fruitValues,
          multiSelect: true,
          searchConfig: {
            placeholder: "Search fruits",
            value: searchFruitValues,
            onChange: (value: string) => {
              setSearchFruitValues(value);
            },
          },
        },
        vegetable: {
          id: "vegetable",
          label: "Vegetable",
          availableFilters: ["is", "is-not"],
          values: vegetableValues,
          multiSelect: false,
          searchConfig: {
            placeholder: "Search vegetables",
            value: searchVegetableValues,
            onChange: (value: string) => {
              setSearchVegetableValues(value);
            },
          },
        },
      },
    };
    return <Filter {...props} />;
  },
};
