import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";

import CrashReportModal from "./CrashReportModal";

/**
 * Internal component used to display a crash report form when the frontend crashes unexpectedly.<br>
 * Allows users to submit feedback about the error to help the team resolve issues.<br>
 */
const meta: Meta<typeof CrashReportModal> = {
  component: CrashReportModal,
  argTypes: {
    isOpen: {
      table: {
        type: {
          summary: "Boolean",
        },
      },
    },
    onClose: {
      table: {
        type: {
          summary: "Function",
        },
      },
    },
    onConfirm: {
      table: {
        type: {
          summary: "Function",
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CrashReportModal>;

export const Primary: Story = {
  name: "Basic Crash Report",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-md">
          <Body>
            {`Oh no ! Your page just crashed :( \n Fill in this crash report !`}
          </Body>
          <Button
            intent="call-to-action"
            size="md"
            color="main"
            id="open-crash-report"
            label="Open crash report"
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </div>
        <CrashReportModal
          {...args}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          onConfirm={() => {
            alert("Confirming the crash report");
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
  args: {
    isOpen: false,
  },
};
