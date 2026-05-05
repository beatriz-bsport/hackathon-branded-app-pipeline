import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import { Button } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

import { PaymentFlowModal } from "./payment-flow-modal";

type PaymentFlowModalComponent = typeof PaymentFlowModal;

const meta: Meta<PaymentFlowModalComponent> = {
  component: PaymentFlowModal,
  title: "Financial Services/PaymentFlowModal",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Orchestrates invoice/member display and payment-method selection in the payment flow modal.",
      },
    },
    metaSourceCode: `
import { fetch } from "#src/utils/fetch";
<PaymentFlowModal
  isOpen={true}
  invoiceId="74780524-2350-4acf-9eef-140e3c55f82a"
  memberId={29617664}
  fetch={fetch}
  onClose={() => {}}
  onConfirm={() => {}}
/>
`,
    peerDependencies: ["@tanstack/react-query"],
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    useEffect(() => setIsOpen(args.isOpen), [args.isOpen]);

    useEffect(() => {
      const originalUseCompanyTheme = dataAccessLayer.useCompanyTheme;
      dataAccessLayer.useCompanyTheme = () => {
        return {
          stripe_pk_key: "pk_test_lFB5CxcyTCaQcS00MiE1ebEO",
          stripe_id: "acct_1HXD8XGqCXxmgm1P",
        } as CompanyTheme;
      };

      return () => {
        dataAccessLayer.useCompanyTheme = originalUseCompanyTheme;
      };
    }, []);

    return (
      <>
        <Button
          intent="default"
          label="Open Payment Modal"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />

        <PaymentFlowModal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    isOpen: false,
    invoiceId: "74780524-2350-4acf-9eef-140e3c55f82a",
    memberId: 29617664,
    fetch,
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<PaymentFlowModalComponent> = {};
