import type { Meta, StoryObj } from "@storybook/react";

import Button from "#src/components/Button";

import ListLayout from "./ListLayout";

/**
 * Define Layout for List pages, with three subcomponents:<br>
 * - ListLayout.Header : See <https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs><br>
 * - ListLayout.Content<br>
 * - ListLayout.Button : Responsive button that adapts to mobile/desktop screens<br>
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

export const WithLayoutButton: Story = {
  name: "ListLayout with Layout Button",
  render: () => {
    return (
      <ListLayout>
        <ListLayout.Header
          pageTitle="Members"
          breadcrumbsItems={[
            {
              id: "breadcrumb-item-1",
              text: "Home",
              href: "#",
            },
          ]}
          callToActionButton={
            <ListLayout.Button
              key="add-member"
              iconLeft="user-plus-01"
              color="main"
              intent="call-to-action"
              label="Add Member"
              desktopSize="md"
              mobileSize="md"
            />
          }
        />
        <ListLayout.Content>
          <div className="p-md">
            <p className="text-body-md mb-md">
              This example uses ListLayout.Button which is responsive:
            </p>
            <ul className="list-disc ml-md space-y-xs text-body-sm">
              <li>
                <strong>Desktop (≥640px):</strong> Shows full button with
                &quot;Add Member&quot; label and user-plus icon
              </li>
              <li>
                <strong>Mobile (&lt;640px):</strong> Shows icon-only button with
                user-plus icon
              </li>
            </ul>
            <div className="mt-lg space-y-sm">
              <p className="text-body-sm font-semibold">
                Try resizing your browser to see the button adapt!
              </p>
              <div className="flex gap-sm">
                <ListLayout.Button
                  iconLeft="plus"
                  color="main"
                  intent="call-to-action"
                  label="Create"
                />
                <ListLayout.Button
                  iconLeft="edit-02"
                  color="main"
                  intent="default"
                  label="Edit"
                />
                <ListLayout.Button
                  iconRight="chevron-right"
                  color="main"
                  intent="default"
                  label="Next"
                />
              </div>
            </div>
          </div>
        </ListLayout.Content>
      </ListLayout>
    );
  },
};
