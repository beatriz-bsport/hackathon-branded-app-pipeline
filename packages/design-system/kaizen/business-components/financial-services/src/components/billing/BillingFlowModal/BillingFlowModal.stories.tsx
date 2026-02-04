import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import BillingFlowModal from "./BillingFlowModal";

const MEMBER_ID = 29612631;

const meta: Meta<typeof BillingFlowModal> = {
  component: BillingFlowModal,
  title: "billing/BillingFlowModal",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BillingFlowModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button
          label="Open Billing Flow Modal"
          size="md"
          intent="default"
          color="main"
          onClick={() => setIsOpen(true)}
        />
        <BillingFlowModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          memberId={MEMBER_ID}
        />
      </>
    );
  },
};
