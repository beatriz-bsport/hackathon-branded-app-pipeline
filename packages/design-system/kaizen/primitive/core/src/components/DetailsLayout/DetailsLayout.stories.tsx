import type { Meta, StoryObj } from "@storybook/react-vite";

import Button from "#src/components/Button";

import DetailsLayout from "./DetailsLayout";
import { useDetailsLayout } from "./LayoutProvider";

const meta: Meta<typeof DetailsLayout> = {
  component: DetailsLayout,
  parameters: {
    docs: {
      description: {
        component: `
A compound component for detail pages, composed of:

- **Header**: Sticky top bar
- **Content**: Scrollable main area
- **Panel**: Collapsible side panel
- **Confirmation**: Unsaved changes alert

---

## Usage

\`\`\`jsx
// ParentPage.tsx
export const ParentPage = () => (

const { detailsLayoutProps } = useDetailsLayout();

return (
  <DetailsLayout {...detailsLayoutProps} withPanel>
    <DetailsLayout.Header
      pageTitle="User Profile"
      onEditTitleClick={() => toggleEditTitleInModal()}
      breadcrumbsItems={breadcrumbs}
      endGroupActions={actions}
    />
    <DetailsLayout.Content>
      <ChildContent />
    </DetailsLayout.Content>
    <DetailsLayout.Panel>
      Additional settings/options
    </DetailsLayout.Panel>
    <DetailsLayout.Confirmation
      onSave={() => {
        console.log("Save changes and close the Confirmation on Success");
        toggleHasUnsavedChanges(false);
      }}
      onDiscard={() => {
        console.log("Discard changes and close the Confirmation on Success");
        toggleHasUnsavedChanges(false);
      }}
    />
  </DetailsLayout>);
}
\`\`\`

## In your children component

\`\`\`jsx
// ChildContent.tsx

export const ChildContent = () => (

const { toggleHasUnsavedChanges, toggleIsPanelOpened } = useDetailsLayout();

return (
  <div>
  <Button
    label="Toggle Unsaved Changes"
    onClick={() => toggleHasUnsavedChanges(true)} 
  />
  <Button
    label="Toggle Panel"
    onClick={() => toggleIsPanelOpened(true)} 
  />
  </div>);
}
\`\`\`


---

## Subcomponent Props

- **Header**: \`pageTitle\` (required), \`className\`, \`children\`, \`breadcrumbsItems\`, \`callToActionButton\`, \`onEditTitleClick\`, \`endGroupActions\`
- **Content**: \`className\`, \`children\`
- **Panel**: \`className\`, \`children\`
- **Confirmation**: \`className\`, \`onDiscard\`, \`onSave\`

---

## Behavior

- Children can be placed in any order (layout is grid-based).
- Panel and confirmation visibility are controlled by context.
- Panel collapses to 0px when closed.

[See full docs](https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-detailslayout--docs)
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailsLayout>;

export const Primary: Story = {
  name: "DetailsLayout with Panel controller (open by default)",
  render: () => {
    const { detailsLayoutProps, toggleHasUnsavedChanges, toggleIsPanelOpened } =
      useDetailsLayout();

    const { endGroupActions, isMobile } = DetailsLayout.useAdaptiveActions({
      endGroupActions: [
        <Button
          key="chevron-right-button"
          label="Toggle Panel"
          iconLeft="chevron-right-double"
          color="main"
          intent="default"
          size="md"
          onClick={() => toggleIsPanelOpened()}
        />,
      ],
      mobileOnlyActions: [
        <Button
          key="layout-details-button-edit-pack-name"
          color="default"
          intent="flat"
          size="md"
          icon="edit-02"
          kind="icon-button"
          label="Edit title"
          onClick={() => console.log("You click on edit title !")}
        />,
      ],
    });

    return (
      <DetailsLayout {...detailsLayoutProps} withPanel>
        <DetailsLayout.Header
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
              onClick={() => toggleHasUnsavedChanges()}
            />
          }
          onEditTitleClick={
            isMobile
              ? undefined
              : () => console.log("You click on edit title !")
          }
          endGroupActions={endGroupActions}
        />
        <DetailsLayout.Confirmation
          onSave={() => {
            console.log("Save changes and close the Confirmation");
            toggleHasUnsavedChanges(false);
          }}
          onDiscard={() => {
            console.log("Discard changes and close the Confirmation");
            toggleHasUnsavedChanges(false);
          }}
        />
        <DetailsLayout.Content>
          <div className="h-screen w-full bg-luna-grey-200 rounded-sm" />
        </DetailsLayout.Content>
        <DetailsLayout.Panel>
          <div className="h-screen w-full bg-luna-grey-200 rounded-sm" />
        </DetailsLayout.Panel>
      </DetailsLayout>
    );
  },
};

export const DetailsWithoutPanel: Story = {
  name: "DetailsLayout without Panel",
  render: () => {
    const { detailsLayoutProps, toggleHasUnsavedChanges, toggleIsPanelOpened } =
      useDetailsLayout();

    return (
      <DetailsLayout {...detailsLayoutProps}>
        <DetailsLayout.Header
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
              onClick={() => toggleHasUnsavedChanges()}
            />
          }
          onEditTitleClick={() => console.log("You click on edit title !")}
          endGroupActions={[
            <Button
              key="chevron-right-button"
              label="Toggle Panel"
              iconLeft="chevron-right-double"
              color="main"
              intent="default"
              size="md"
              onClick={() => toggleIsPanelOpened()}
            />,
          ]}
        />
        <DetailsLayout.Confirmation
          onSave={() => {
            console.log("Save changes and close the Confirmation");
            toggleHasUnsavedChanges(false);
          }}
          onDiscard={() => {
            console.log("Discard changes and close the Confirmation");
            toggleHasUnsavedChanges(false);
          }}
        />
        <DetailsLayout.Content>
          <div className="h-screen w-full bg-luna-grey-200 rounded-sm" />
        </DetailsLayout.Content>
      </DetailsLayout>
    );
  },
};
