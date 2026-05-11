import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { Fetch } from "@bsport/fetch";

import { fetch } from "#src/utils/fetch";

import { PaymentMethodSelector } from "./payment-method-selector";
import type { PaymentMethodSelectorSelection } from "./types";

type PaymentMethodSelectorComponent = typeof PaymentMethodSelector;

const metaComponentDescription = `
**PaymentMethodSelector** is a business selector used in payment flows to choose:
- a **saved payment method** (already registered for the member), or
- an entry from **all methods** (card, SEPA, terminal, manual, gift card code) that can trigger a dedicated payment form in the parent flow.

### Business intent

The selector itself should stay focused on **selection UX** (grouping, labels, fetching saved methods), while the parent payment flow handles method-specific rendering and side effects:
- selecting \`saved\` usually means "use existing method as-is";
- selecting \`all\` is where parent logic typically mounts Stripe Elements or internal forms.

### Default behavior

- Always **uncontrolled**.
- If saved methods exist, the selector auto-selects the first one.
- If no saved method exists, it auto-selects **new card** (\`all:card\`).
- Saved methods can show \`PaymentMethodLogo\` when the saved method maps to a supported logo \`type\` (for example Visa/Mastercard/SEPA/BACS).

### How to import?

\`\`\`tsx
import { PaymentMethodSelector } from "@bsport/kaizen-business-components/financial-services/payment-method-selector";
\`\`\`
`;

const metaSourceCode = `
import { useState } from "react";
import {
  PaymentMethodSelector,
  type PaymentMethodSelectorSelection,
} from "@bsport/kaizen-business-components/financial-services/payment-method-selector";
import { fetch } from "#src/utils/fetch";

function PaymentFormStep() {
  const [selection, setSelection] = useState<PaymentMethodSelectorSelection>(null);

  return (
    <>
      <PaymentMethodSelector
        fetch={fetch}
        memberId={29617664}
        onSelectionChange={setSelection}
      />

      {/* parent chooses what to render based on selection.kind/id */}
      {selection?.kind === "all" && selection.id === "card" ? <CardElementForm /> : null}
      {selection?.kind === "all" && selection.id === "sepa_debit" ? <SepaForm /> : null}
    </>
  );
}
`;

const meta: Meta<PaymentMethodSelectorComponent> = {
  component: PaymentMethodSelector,
  title: "Financial Services/PaymentMethodSelector",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  args: {
    fetch,
    memberId: 29617664,
  },
  tags: ["autodocs"],
};

export default meta;

const SelectorStatePreview = ({
  memberId,
  fetch,
  disabled,
}: {
  memberId: number;
  fetch: Fetch;
  disabled?: boolean;
}) => {
  const [selection, setSelection] =
    useState<PaymentMethodSelectorSelection>(null);

  return (
    <div className="w-[320px]">
      <PaymentMethodSelector
        disabled={disabled}
        memberId={memberId}
        fetch={fetch}
        onSelectionChange={setSelection}
      />
      <hr className="my-md border-t border-surface-divider" />
      <p className="text-body-sm text-onsurface-weak">
        <strong>Story helper —</strong> Current selection:{" "}
        {selection ? `${selection.kind} - ${selection.id}` : "none"}
      </p>
    </div>
  );
};

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<PaymentMethodSelectorComponent> = {
  render: (args) => (
    <SelectorStatePreview
      disabled={args.disabled}
      fetch={args.fetch}
      memberId={args.memberId}
    />
  ),
};

export const Disabled: StoryObj<PaymentMethodSelectorComponent> = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <SelectorStatePreview
      disabled={args.disabled}
      fetch={args.fetch}
      memberId={args.memberId}
    />
  ),
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<PaymentMethodSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Selection contract

| Callback | Payload | Typical usage |
|---------|---------|---------------|
| \`onSelectionChange\` | \`{ kind: "saved"; id: string }\` | Use an existing saved method |
| \`onSelectionChange\` | \`{ kind: "all"; id: AllPaymentMethodKey }\` | Mount the matching payment form in the parent flow |

### Selection defaults

- If at least one saved method exists, the first saved method is auto-selected.
- If no saved method exists, \`all:card\` is auto-selected.

### Saved method visuals

- The selector maps each saved payment method to an optional \`PaymentMethodLogo\` \`type\`; unsupported card brands omit the logo.

### Responsibility split recommendation

- Keep this component as a **pure selector** (fetch + grouped options + value changes).
- Render Stripe Elements / manual / terminal / gift card forms in the **parent flow** from \`onSelectionChange\`.
        `,
      },
    },
  },
};
