import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { GlobalAlert } from "#src/components/financial-services/global-alert/global-alert";

type GlobalAlertComponent = typeof GlobalAlert;

const meta: Meta<GlobalAlertComponent> = {
  component: GlobalAlert,
  title: "Financial Services/GlobalAlert",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `A presentational component for surfacing account-level actions to studio owners and managers.

The parent provides a map of \`{ [kind]: { severity, dueDate? } }\` for the actions that require attention.
Titles, descriptions, CTA labels and redirect URLs are resolved internally from \`kind\`.

Available actions: \`unpaid-invoice\`, \`disputed-invoice\`, \`stripe-not-configured\`, \`missing-vat-number\`, \`apple-developer-program-enrollment\`.

| \`severity\` | Behaviour |
|---|---|
| \`"info"\` | Dismissible floating banner — lower visual urgency |
| \`"warning"\` | Dismissible floating banner — communicates urgency |
| \`"blocking"\` | Non-dismissible full-screen modal — user must act on the CTA to regain access |

An optional \`dueDate\` (ISO date string) shows a deadline chip:
days remaining → critical · weeks → warning · months → default.`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<GlobalAlertComponent>;

const sharedArgs = {
  onNavigate: (url: string) => alert(`Navigate to: ${url}`),
  openIntercom: () => alert("Open Intercom"),
};

const StoryWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-full h-[50vh] flex items-center justify-center">
    {children}
  </div>
);

// ─── Info ─────────────────────────────────────────────────────────────────────

/**
 * Informational nudge — always dismissible, no escalation.
 * CTA opens Intercom instead of navigating.
 */
export const AppleDeveloperProgram: Story = {
  name: "Apple Developer Program",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open alert"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "apple-developer-program-enrollment": { severity: "info" },
    },
  },
};

// ─── Warning ──────────────────────────────────────────────────────────────────

/**
 * Dismissible banner — communicates urgency, can escalate to `blocking`.
 */
export const UnpaidInvoiceWarning: Story = {
  name: "Unpaid invoice (warning)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open alert"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "unpaid-invoice": {
        severity: "warning",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
};

/**
 * Dismissible banner — communicates urgency, can escalate to `blocking`.
 */
export const DisputedInvoiceWarning: Story = {
  name: "Disputed invoice (warning)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open alert"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "disputed-invoice": {
        severity: "warning",
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
};

/**
 * Dismissible banner — persists until the VAT number is added in account settings.
 */
export const MissingVatNumber: Story = {
  name: "Missing VAT number (warning)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open alert"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: { "missing-vat-number": { severity: "warning" } },
  },
};

/**
 * Dismissible banner — user must configure Stripe to avoid escalation.
 */
export const StripeNotConfiguredWarning: Story = {
  name: "Stripe not configured (warning)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open alert"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "stripe-not-configured": {
        severity: "warning",
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
};

// ─── Blocking ─────────────────────────────────────────────────────────────────

/**
 * Non-dismissible full-screen modal — user cannot proceed until the invoice is paid.
 */
export const UnpaidInvoiceBlocking: Story = {
  name: "Unpaid invoice (blocking)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert {...args} open={isOpen} />
        <Button
          intent="default"
          label="Open blocking modal"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: { "unpaid-invoice": { severity: "blocking" } },
  },
};

/**
 * Non-dismissible full-screen modal — user cannot proceed until the dispute is resolved.
 */
export const DisputedInvoiceBlocking: Story = {
  name: "Disputed invoice (blocking)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert {...args} open={isOpen} />
        <Button
          intent="default"
          label="Open blocking modal"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: { "disputed-invoice": { severity: "blocking" } },
  },
};

/**
 * Non-dismissible full-screen modal — user must configure Stripe to proceed.
 */
export const StripeNotConfiguredBlocking: Story = {
  name: "Stripe not configured (blocking)",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert {...args} open={isOpen} />
        <Button
          intent="default"
          label="Open blocking modal"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: { "stripe-not-configured": { severity: "blocking" } },
  },
};

// ─── Multiple alerts ──────────────────────────────────────────────────────────

/**
 * When two or more non-blocking alerts are active the component shows an aggregate banner
 * with a "Review" CTA that opens a detail drawer listing each action with its own CTA and due date.
 */
export const MultipleWarningAlerts: Story = {
  name: "Multiple warning alerts",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open 2 alerts"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "unpaid-invoice": {
        severity: "warning",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      "missing-vat-number": {
        severity: "warning",
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  },
};

/**
 * All active alerts are `"info"` — the aggregate banner renders with `status="info"`.
 */
export const MultipleInfoAlerts: Story = {
  name: "Multiple info alerts",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open 2 alerts"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "missing-vat-number": { severity: "info" },
      "apple-developer-program-enrollment": { severity: "info" },
    },
  },
};

/**
 * When at least one active alert is `"warning"`, the aggregate banner renders with
 * `status="warning"` even if other alerts are `"info"`.
 */
export const MixedInfoAndWarningAlerts: Story = {
  name: "Mixed info + warning alerts",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <StoryWrapper>
        <GlobalAlert
          {...args}
          open={isOpen}
          onDismiss={() => setIsOpen(false)}
        />
        <Button
          intent="default"
          label="Open 2 alerts"
          color="main"
          size="md"
          onClick={() => setIsOpen(true)}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "unpaid-invoice": {
        severity: "warning",
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      "apple-developer-program-enrollment": { severity: "info" },
    },
  },
};

/**
 * Only the highest-priority blocking alert is shown at a time (determined by `globalAlertKinds` order).
 */
export const MultipleBlockingAlerts: Story = {
  name: "Multiple blocking alerts",
  render: (args) => {
    const [alerts, setAlerts] = useState(args.alerts);
    const [isOpen, setIsOpen] = useState(false);

    return (
      <StoryWrapper>
        <GlobalAlert
          open={isOpen}
          alerts={alerts}
          onNavigate={(url) => {
            alert(url);
          }}
          openIntercom={args.openIntercom}
        />
        <Button
          intent="default"
          label="Open 2 blocking alerts"
          color="main"
          size="md"
          onClick={() => {
            setAlerts(args.alerts);
            setIsOpen(true);
          }}
        />
      </StoryWrapper>
    );
  },
  args: {
    ...sharedArgs,
    open: false,
    alerts: {
      "unpaid-invoice": { severity: "blocking" },
      "stripe-not-configured": { severity: "blocking" },
    },
  },
};
