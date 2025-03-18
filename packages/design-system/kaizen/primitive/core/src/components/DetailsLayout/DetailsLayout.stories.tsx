import type { Meta, StoryObj } from "@storybook/react";
import Button from "#src/components/Button";
import DetailsLayout from "./DetailsLayout";
import { useDetailsLayout } from "./LayoutProvider";

/**
 * Define Layout for Details pages, with four subcomponents:
 * - DetailsLayout.Header : See https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 * - DetailsLayout.Confirmation
 * - DetailsLayout.Content
 * - DetailsLayout.Panel
 * The Header will stick to the top of the page while the Content
 * will be scrollable if its content exceeds the window height
 * the Panel on the left side will ocuppy the whole height and can be collapsed/expanded -triggered using toggleIsPanelOpened-
 * the Confirmation on the bottom will appear when there are unsaved changes -triggered using toggleHasUnsavedChanges-
 * the placement of the subcomponents is not relevant because they are positioned using grid areas
 *
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-detailslayout--docs
 */
const meta: Meta<typeof DetailsLayout> = {
  component: DetailsLayout,
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
