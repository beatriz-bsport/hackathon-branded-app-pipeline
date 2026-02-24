import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";

import Accordion from "#src/components/Accordion";
import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Title from "#src/components/Title";

/**
 * **Accordion** groups multiple collapsible sections. Each section has a
 * clickable header (trigger) and expandable content. The header is a
 * **div with role="button"** (keyboard-accessible, `aria-expanded`) so
 * **headerActions can contain real buttons** without invalid HTML. It is built on the
 * primitive [Collapse](/story/primitive-collapse--primary) component.
 *
 * ## Usage
 *
 * - **Accordion** – Container. Use `className` for layout (e.g. gap, flex).
 * - **Accordion.Item** – One section. Props:
 *   - `ariaLabel` – Accessible label for the header trigger (required).
 *   - `header` – Content inside the trigger (title, metadata). The trigger and chevron are rendered by Accordion.
 *   - `headerActions?` – Optional node between the header and the chevron (e.g. buttons); clicks here do not toggle.
 *   - `children` – Section body (shown when open).
 *   - `initiallyOpen?` – When `true`, the section starts expanded.
 *   - `setOpenRef?` – Optional ref that receives the internal `setOpen` so you can open/close sections programmatically.
 *
 * ## Status
 *
 * **Unvalidated** – This component is not yet design-validated.
 */
const meta: Meta<typeof Accordion> = {
  component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Primary: Story = {
  name: "Accordion",
  parameters: {
    docs: {
      description: {
        story:
          "Default accordion with two sections. The first is initially open. " +
          "The header is always a button (rendered by Accordion) with your content and a chevron.",
      },
    },
  },
  render: () => (
    <Accordion>
      <Accordion.Item
        initiallyOpen
        ariaLabel="Section one"
        header={
          <Title htmlVariant="h4" color="default" weight="strong">
            Section one
          </Title>
        }
      >
        <Body htmlVariant="p" size="md" color="default">
          Content for section one.
        </Body>
      </Accordion.Item>
      <Accordion.Item
        ariaLabel="Section two"
        header={
          <Title htmlVariant="h4" color="default" weight="strong">
            Section two
          </Title>
        }
      >
        <Body htmlVariant="p" size="md" color="default">
          Content for section two.
        </Body>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithHeaderActions: Story = {
  name: "With header actions",
  parameters: {
    docs: {
      description: {
        story:
          "Use `headerActions` to show actions (e.g. “Add footnote”) between the header and the chevron. " +
          "The chevron stays on the far right. Clicks on headerActions do not toggle the section.",
      },
    },
  },
  render: () => (
    <Accordion>
      <Accordion.Item
        initiallyOpen
        ariaLabel="Summary"
        header={
          <Title htmlVariant="h4" color="default" weight="strong">
            Summary
          </Title>
        }
        headerActions={
          <div className="flex gap-xs">
            <Button
              intent="default"
              color="main"
              size="sm"
              label="Action one"
              onClick={() => console.log("Accordion action one clicked")}
            />
            <Button
              intent="default"
              color="main"
              size="sm"
              label="Action two"
              onClick={() => console.log("Accordion action two clicked")}
            />
          </div>
        }
      >
        <Body htmlVariant="p" size="md" color="default">
          Section content. The “Add footnote” button is in the header row; the
          chevron stays on the right.
        </Body>
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithSetOpenRef: Story = {
  name: "With programmatic open/close",
  parameters: {
    docs: {
      description: {
        story:
          "Use `setOpenRef` to control sections from outside. Pass a ref to each " +
          "Accordion.Item; the ref's `current` is set to the internal `setOpen` " +
          "function. Call it with `true`/`false` or an updater to open/close sections.",
      },
    },
  },
  render: () => {
    const firstRef = useRef<
      ((value: boolean | ((prev: boolean) => boolean)) => void) | null
    >(null);
    const secondRef = useRef<
      ((value: boolean | ((prev: boolean) => boolean)) => void) | null
    >(null);

    return (
      <div className="flex flex-col gap-md">
        <div className="flex gap-xs">
          <Button
            label="Toggle first"
            size="sm"
            intent="call-to-action"
            color="main"
            onClick={() => firstRef.current?.((prev) => !prev)}
          />
          <Button
            label="Toggle second"
            size="sm"
            intent="call-to-action"
            color="main"
            onClick={() => secondRef.current?.((prev) => !prev)}
          />
        </div>
        <Accordion>
          <Accordion.Item
            initiallyOpen
            setOpenRef={firstRef}
            ariaLabel="First"
            header={
              <Title htmlVariant="h4" color="default" weight="strong">
                First
              </Title>
            }
          >
            <Body>First section content.</Body>
          </Accordion.Item>
          <Accordion.Item
            setOpenRef={secondRef}
            ariaLabel="Second"
            header={
              <Title htmlVariant="h4" color="default" weight="strong">
                Second
              </Title>
            }
          >
            <Body>Second section content. Use buttons above to switch.</Body>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  },
};
