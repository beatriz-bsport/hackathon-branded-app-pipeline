import type { Meta, StoryObj } from "@storybook/react";

import Button from "#src/components/Button";

import ListLayout from "./ListLayout";

/**
 * Define Layout for List pages, with two subcomponents:<br>
 * - ListLayout.Header : See <https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs><br>
 * - ListLayout.Content<br>
 * The Header will stick to the top of the page while the Content
 * will be scrollable if its content exceeds the window height.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=9463-59076&t=9IwGiqrl7BAz2nCl-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof ListLayout> = {
  component: ListLayout,
};

export default meta;

type Story = StoryObj<typeof ListLayout>;

export const Primary: Story = {
  name: "ListLayout",
  render: () => {
    return (
      <ListLayout>
        <ListLayout.Header
          pageTitle="Title"
          breadcrumbsItems={[
            {
              id: "breadcrumb-item-1",
              text: "Breadcrumb-item",
              href: "#",
            },
          ]}
          callToActionButton={
            <Button
              key="call-to-action"
              iconLeft="chevron-right-double"
              color="main"
              intent="call-to-action"
              size="md"
              label="CTA Button"
            />
          }
          filterConfig={{
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
                ],
                multiSelect: false,
              },
            },
            selectFieldLabel: "Filter",
            onFilterChange: (filters) =>
              console.log("Filters changed:", filters),
          }}
          onEditTitleClick={() => console.log("You click on edit title !")}
        />
        <ListLayout.Content>
          <div className="h-screen w-full bg-luna-grey-200 rounded-sm" />
        </ListLayout.Content>
      </ListLayout>
    );
  },
};
