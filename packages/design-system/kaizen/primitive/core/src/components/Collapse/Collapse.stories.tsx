import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Collapse from "#src/components/Collapse";
import Title from "#src/components/Title";
import useEmptyState from "#src/hooks/use-empty-state.hook";

/**
 * The Collapse component is used to show and hide content in a controlled manner,
 * typically as a toggleable section. It's ideal for scenarios where you want to
 * conserve screen space or organize information hierarchically, such as FAQs,
 * filters, or expandable details.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=826-7387&node-type=canvas&t=KitDYojgfO0WC5ph-0" target="_blank">Figma</a>
 */
const meta: Meta<typeof Collapse> = {
  component: Collapse,
};

export default meta;

type Story = StoryObj<typeof Collapse>;

export const Primary: Story = {
  name: "Collapse",
  render: () => (
    <Collapse>
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen }) => {
          const toggleOpen = () => setIsCollapseOpen((prevState) => !prevState);
          return (
            <Button
              color="main"
              intent="call-to-action"
              size="md"
              className="w-fit"
              label="I am a custom controller"
              iconRight="chevron-right"
              onClick={toggleOpen}
              {...collapseProps}
            />
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        <div>
          <Title htmlVariant="h1" color="default">
            Lorem Ipsum
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            consequat purus in nulla tincidunt, at tempor lorem consequat. Cras
            et sapien eu elit tincidunt mollis. Ut tincidunt orci vel nisi
            placerat, nec fermentum nulla placerat. <a href="#">Click here</a>{" "}
            to learn more.
          </Body>
          <Title htmlVariant="h2" color="default">
            Subheading
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Sed varius felis quis neque tempor, ac convallis tortor maximus. In
            sed quam id arcu gravida luctus. Etiam euismod felis eget sapien
            feugiat lobortis. Curabitur malesuada urna vitae ante volutpat, ac
            sagittis odio sollicitudin.
          </Body>
          <Title htmlVariant="h3" color="default">
            Another Subheading
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Aenean tempus est vel justo fermentum, non fermentum enim consequat.
            Nulla facilisi. In tincidunt, felis a vehicula volutpat, turpis
            turpis finibus metus, a varius urna ligula ut ipsum.
          </Body>
        </div>
      </Collapse.Content>
    </Collapse>
  ),
};

export const Controlled: Story = {
  name: "Initially open",
  render: () => (
    <Collapse initiallyOpen>
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen }) => {
          const toggleOpen = () => setIsCollapseOpen((prevState) => !prevState);
          return (
            <Button
              color="main"
              intent="call-to-action"
              size="md"
              className="w-fit"
              label="I am a custom controller"
              iconRight="chevron-right"
              onClick={toggleOpen}
              {...collapseProps}
            />
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        <div>
          <Title htmlVariant="h1" color="default">
            Lorem Ipsum
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            consequat purus in nulla tincidunt, at tempor lorem consequat. Cras
            et sapien eu elit tincidunt mollis. Ut tincidunt orci vel nisi
            placerat, nec fermentum nulla placerat. <a href="#">Click here</a>{" "}
            to learn more.
          </Body>
          <Title htmlVariant="h2" color="default">
            Subheading
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Sed varius felis quis neque tempor, ac convallis tortor maximus. In
            sed quam id arcu gravida luctus. Etiam euismod felis eget sapien
            feugiat lobortis. Curabitur malesuada urna vitae ante volutpat, ac
            sagittis odio sollicitudin.
          </Body>
          <Title htmlVariant="h3" color="default">
            Another Subheading
          </Title>
          <Body htmlVariant="p" size="lg" color="default">
            Aenean tempus est vel justo fermentum, non fermentum enim consequat.
            Nulla facilisi. In tincidunt, felis a vehicula volutpat, turpis
            turpis finibus metus, a varius urna ligula ut ipsum.
          </Body>
        </div>
      </Collapse.Content>
    </Collapse>
  ),
};

export const ControllerInContent: Story = {
  name: "With controller in content",
  render: () => (
    <Collapse>
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen }) => {
          const toggleOpen = () => setIsCollapseOpen((prevState) => !prevState);
          return (
            <Button
              color="main"
              intent="call-to-action"
              size="md"
              className="w-fit"
              label="I am a custom controller"
              iconRight="chevron-right"
              onClick={toggleOpen}
              {...collapseProps}
            />
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        {({ setIsCollapseOpen }) => {
          const toggleOpen = () => setIsCollapseOpen(false);
          return (
            <div>
              <Title htmlVariant="h1" color="default">
                With controller in content
              </Title>
              <Body htmlVariant="p" size="lg" color="default">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                consequat purus in nulla tincidunt, at tempor lorem consequat.
                Cras et sapien eu elit tincidunt mollis. Ut tincidunt orci vel
                nisi placerat, nec fermentum nulla placerat.{" "}
                <a href="#">Click here</a> to learn more.
              </Body>
              <Button
                color="critical"
                intent="call-to-action"
                size="md"
                className="mt-sm w-fit"
                label="This button will close the collapse"
                iconRight="chevron-right"
                onClick={toggleOpen}
              />
            </div>
          );
        }}
      </Collapse.Content>
    </Collapse>
  ),
};

export const CollapsibleWithComputedChildren: Story = {
  name: "Collapsible with a computed children component",
  args: {
    initiallyOpen: true,
  },
  render: (args) => {
    const emptyConfig = {
      title: "Test with the base empty state",
      subtitle:
        "The empty state is computed so if you do the height calculation too fast you will end up with a cropped component",
      className: "max-w-[320px]",
      ctaButtonConfig: {
        iconLeft: "award-03" as const,
        label: "Create template",
        onClick: () => console.log("Create email template"),
      },
      secondaryButtonConfig: {
        iconLeft: "bank-note-03" as const,
        label: "Add category",
        onClick: () => console.log("Create a new category"),
      },
    };

    const emptyStateProps = {
      isEmpty: true,
      emptyConfig: emptyConfig,
    };

    const { EmptyState } = useEmptyState(emptyStateProps);
    return (
      <Collapse initiallyOpen={args?.initiallyOpen}>
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);
            return (
              <Button
                label="Toggle Collapse"
                color="default"
                intent="flat"
                size="md"
                className="w-fit"
                iconRight="chevron-down"
                onClick={toggleOpen}
                {...collapseProps}
              />
            );
          }}
        </Collapse.Controller>
        <Collapse.Content>
          {() => {
            return <EmptyState />;
          }}
        </Collapse.Content>
      </Collapse>
    );
  },
};
