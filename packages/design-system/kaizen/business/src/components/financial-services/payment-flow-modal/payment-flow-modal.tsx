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
import { i18nInstance, useTranslation } from "#src/i18n";

import { useFetchInvoice } from "./hooks/use-fetch-invoice";
import { useFetchMember } from "./hooks/use-fetch-member";
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

  const { data: member } = useFetchMember(fetch, memberId);
  const { data: invoice } = useFetchInvoice(fetch, invoiceId);

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

  return (
    <Modal
      open={isOpen}
      title={t("paymentFlowModal.title")}
      size="lg"
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

        <Card className="flex flex-col gap-xs bg-surface-default-weaker">
          <Title htmlVariant="h5" color="default" weight="strong">
            {t("paymentFlowModal.paymentMethodTitle")}
          </Title>
          <PaymentMethodSelector
            memberId={memberId}
            fetch={fetch}
            label={undefined}
            size="md"
          />
        </Card>

        <div className="flex items-start gap-xs">
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
