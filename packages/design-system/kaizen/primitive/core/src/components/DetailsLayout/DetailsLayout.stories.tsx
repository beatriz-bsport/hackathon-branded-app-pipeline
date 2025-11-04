import type { Meta, StoryObj } from "@storybook/react";

import Button from "#src/components/Button";

import DetailsLayout from "./DetailsLayout";
import { useDetailsLayout } from "./LayoutProvider";

/**
 * DetailsLayout - Compound Component for Detail Page Layouts
 *
 * Provides a structured grid layout for detail pages with four key subcomponents:
 * 1. **Header** - Sticky top bar
 * 2. **Content** - Scrollable main area
 * 3. **Panel** - Collapsible side panel
 * 4. **Confirmation** - Unsaved changes alert
 *
 * @example
 * // Basic Usage in Storybook
 * import DetailsLayout from '#src/components/DetailsLayout';
 *
 * export const Default = () => (
 *   <DetailsLayout>
 *     <DetailsLayout.Header title="User Profile" />
 *     <DetailsLayout.Content>
 *       Main form/content
 *     </DetailsLayout.Content>
 *     <DetailsLayout.Panel>
 *       Additional settings/options
 *     </DetailsLayout.Panel>
 *     <DetailsLayout.Confirmation
 *       onDiscard={() => console.log('Changes discarded')}
 *       onSave={() => console.log('Changes saved')}
 *     />
 *   </DetailsLayout>
 * );
 *
 * ### Subcomponent Props
 * | Component         | Required Props | Optional Props                      |
 * |-------------------|----------------|--------------------------------------|
 * | Header            | title          | className, children                 |
 * | Content           | -              | className, children                 |
 * | Panel             | -              | className, children                 |
 * | Confirmation      | -              | className, onDiscard, onSave        |
 *
 * ### Layout Behavior
 * - **Grid Areas**: Components are positioned using CSS grid template areas
 * - **Responsive**: Panel collapses to 0px width when closed
 * - **State Management**: Uses context provider for:
 *   - `toggleIsPanelOpened()`: Control panel visibility
 *   - `toggleHasUnsavedChanges()`: Show/hide confirmation bar
 *
 * ### Styling
 * - Max content width: 920px
 * - Panel width: 320px (when open)
 * - Built with `class-variance-authority` for variant management
 *
 * @see {@link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-detailslayout--docs|Storybook Docs}
 *
 * @param {string} [className] - Additional CSS classes for root element
 * @param {ReactNode} children - Composition of layout subcomponents
 *
 * @remarks
 * - Children order doesn't affect layout (positioned via grid areas)
 * - Confirmation bar only appears when `hasUnsavedChanges` context is true
 * - Panel visibility controlled through context state
 */
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
  <DetailsLayout {...detailsLayoutProps}>
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
      onDiscard={() => console.log('Changes discarded')}
      onSave={() => console.log('Changes saved')}
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
  name: "DetailsLayout",
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
        <DetailsLayout.Confirmation />
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
        <DetailsLayout.Confirmation />
        <DetailsLayout.Content>
          <div className="h-screen w-full bg-luna-grey-200 rounded-sm" />
        </DetailsLayout.Content>
      </DetailsLayout>
    );
  },
};
