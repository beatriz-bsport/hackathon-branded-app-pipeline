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

### Control modes

- **Uncontrolled (default):** omit \`value\`/\`defaultValue\`. If saved methods exist, the selector auto-selects the first one; otherwise it auto-selects **new card** (\`all:card\`).
- **Uncontrolled with initial value:** pass \`defaultValue\` to seed the selection once (auto-select is disabled so your value is preserved). Useful for read-only display of the current method.
- **Controlled:** pass \`value\` and update it from \`onSelectionChange\`. The parent fully owns the selection.

### Identifier mapping

- \`saved\` selections emitted through \`onSelectionChange\` are enriched with \`paymentMethodType\` and \`payment_backend_identifier\`, so consumers can map the textual frontend id back to the numeric backend id.
- Saved methods can show \`PaymentMethodLogo\` when the saved method maps to a supported logo \`type\` (for example Visa/Mastercard/SEPA/BACS).

### Required peerDependencies

The host app must provide these (see \`@bsport/kaizen-business-components\` \`peerDependencies\`):

| Package | Role |
|---------|------|
| \`react\` | Component runtime |
| \`@tanstack/react-query\` | Saved payment methods query |
| \`@bsport/fetch\` | Business API client (\`fetch\` prop) |
| \`@bsport/i18n\` | \`financial-services\` namespace translations |
| \`@bsport/kaizen-primitive-core\` | Select and Body primitives |

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

const ControlledSelectorPreview = ({
  memberId,
  fetch,
}: {
  memberId: number;
  fetch: Fetch;
}) => {
  const [selection, setSelection] =
    useState<PaymentMethodSelectorSelection>(null);

  return (
    <div className="w-[320px]">
      <PaymentMethodSelector
        memberId={memberId}
        fetch={fetch}
        value={selection}
        onSelectionChange={setSelection}
      />
      <hr className="my-md border-t border-surface-divider" />
      <p className="text-body-sm text-onsurface-weak">
        <strong>Story helper —</strong> Controlled value:{" "}
        {selection ? `${selection.kind} - ${selection.id}` : "none"}
      </p>
    </div>
  );
};

// Controlled - The parent owns the selection via `value` + `onSelectionChange`.
export const Controlled: StoryObj<PaymentMethodSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled: the parent stores the selection and feeds it back through `value`. Auto-select is disabled in this mode.",
      },
    },
  },
  render: (args) => (
    <ControlledSelectorPreview fetch={args.fetch} memberId={args.memberId} />
  ),
};

// Initialized - Seeds an initial selection via `defaultValue`, read-only.
// Mirrors the membership-plan "current payment method" display use case.
export const Initialized: StoryObj<PaymentMethodSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled with an initial `defaultValue` and `disabled` for read-only display. The seeded value is preserved (no auto-select fallback). A saved method can be seeded the same way with `{ kind: "saved", id: stripePaymentMethodId }`.',
      },
    },
  },
  render: (args) => (
    <div className="w-[320px]">
      <PaymentMethodSelector
        memberId={args.memberId}
        fetch={args.fetch}
        defaultValue={{ kind: "all", id: "sepa_debit" }}
        disabled
      />
    </div>
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

### Control modes

- **Uncontrolled (no \`value\`/\`defaultValue\`):** auto-selects the first saved method, or \`all:card\` when none exist.
- **Uncontrolled with \`defaultValue\`:** seeds the initial selection once; auto-select is disabled.
- **Controlled (\`value\` + \`onSelectionChange\`):** the parent owns the selection at all times.

### Identifier mapping

- Emitted \`saved\` selections include \`paymentMethodType\` and \`payment_backend_identifier\`, bridging the textual frontend id and numeric backend id.

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
