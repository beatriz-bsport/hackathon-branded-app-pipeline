import React, { useState } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  Button,
  Card,
  Modal,
  Tabs,
  Title,
  Toggle,
} from "@bsport/kaizen-primitive-core";

import { PaymentMethodSelector } from "#src/components/financial-services/payment-method-selector";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import type { AllPaymentMethodKey } from "../payment-method-selector/constants";
import {
  useFetchInvoice,
  useFetchMember,
  useRequestPaymentClientSecret,
} from "./hooks";
import {
  GiftCardPaymentMethod,
  ManualPaymentMethod,
  StripePaymentMethod,
} from "./payment-methods";
import type { PaymentFlowModalProps } from "./types";

type PaymentTab = "one-time" | "installments";

export const PaymentFlowModal: React.FC<PaymentFlowModalProps> = ({
  isOpen,
  invoiceId,
  memberId,
  fetch,
  onClose,
  onConfirm,
}: PaymentFlowModalProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const [activeTab, setActiveTab] = useState<PaymentTab>("one-time");
  const [isPartialEnabled, setIsPartialEnabled] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodSelectorSelection>(null);

  const { data: member } = useFetchMember(fetch, memberId);
  const { data: invoice } = useFetchInvoice(fetch, invoiceId);
  useRequestPaymentClientSecret({
    fetch,
    invoiceId,
    memberId,
    enabled: isOpen,
  });

  const invoicePriceDue = Number(invoice?.price_due);
  const amountToPay = Number.isNaN(invoicePriceDue)
    ? "--"
    : getCurrencyDisplayWithPrice(invoicePriceDue);
  const memberName = member?.name ?? `#${memberId}`;

  const openExternalLink = (url: string): void => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const invoiceUrl = `/invoice/${invoiceId}`;
  const memberUrl = `/member/${memberId}`;
  const tabs = [
    { id: "one-time", label: t("paymentFlowModal.tabs.oneTime") },
    { id: "installments", label: t("paymentFlowModal.tabs.installments") },
  ];

  const allMethodRenderers: Record<AllPaymentMethodKey, () => React.ReactNode> =
    {
      card: () =>
        member ? (
          <StripePaymentMethod
            fetch={fetch}
            invoiceId={invoiceId}
            member={member}
            method="card"
          />
        ) : null,
      sepa_debit: () =>
        member ? (
          <StripePaymentMethod
            fetch={fetch}
            invoiceId={invoiceId}
            member={member}
            method="sepa_debit"
          />
        ) : null,
      gift_card_code: () => (
        <GiftCardPaymentMethod fetch={fetch} memberId={memberId} />
      ),
      // TODO: Implement terminal payment method
      terminal: () => null,
      manual: () => <ManualPaymentMethod />,
    };

  const renderSelectedPaymentMethod = (): React.ReactNode => {
    if (selectedPaymentMethod?.kind !== "all") return null;
    return allMethodRenderers[selectedPaymentMethod.id]?.() ?? null;
  };

  return (
    <Modal
      open={isOpen}
      title={t("paymentFlowModal.title")}
      size="lg"
      onClose={onClose}
      cancelButton={{
        label: t("paymentFlowModal.buttons.cancel"),
        onClick: onClose,
      }}
      confirmButton={{
        label: t("paymentFlowModal.buttons.confirm"),
        color: "main",
        onClick: onConfirm,
      }}
      onCloseButtonClick={onClose}
    >
      <div className="flex flex-col gap-md">
        <Tabs
          orientation="horizontal"
          tabs={tabs}
          value={activeTab}
          disableResponsive
          onValueChange={(id) => setActiveTab(id as PaymentTab)}
          className="border-b border-stroke-divider"
        />

        <div className="flex flex-col gap-2xs">
          <Title htmlVariant="h3" color="default" weight="strong">
            {t("paymentFlowModal.totalAmountLabel")}
          </Title>
          <Title htmlVariant="h1" color="default" weight="strong">
            {amountToPay}
          </Title>
        </div>

        <Toggle
          id="payment-flow-modal-partial-toggle"
          label={t("paymentFlowModal.partialToggleLabel")}
          checked={isPartialEnabled}
          onToggleChange={setIsPartialEnabled}
        />

        <Card className="flex flex-col gap-md bg-surface-default-weaker">
          <div className="flex flex-col gap-xs">
            <Title htmlVariant="h3" color="default" weight="strong">
              {t("paymentFlowModal.paymentMethodTitle")}
            </Title>
            <PaymentMethodSelector
              memberId={memberId}
              fetch={fetch}
              label={undefined}
              size="md"
              onSelectionChange={setSelectedPaymentMethod}
            />
          </div>

          {renderSelectedPaymentMethod()}
        </Card>

        <div className="flex items-start gap-xs flex-wrap">
          <Button
            intent="flat"
            color="default"
            size="sm"
            label={t("paymentFlowModal.links.invoice")}
            iconRight="link-external-02"
            onClick={() => openExternalLink(invoiceUrl)}
          />
          <Button
            intent="flat"
            color="default"
            size="sm"
            label={memberName}
            iconRight="link-external-02"
            onClick={() => openExternalLink(memberUrl)}
          />
        </div>
      </div>
    </Modal>
  );
};

PaymentFlowModal.displayName = "KaizenPaymentFlowModal";
