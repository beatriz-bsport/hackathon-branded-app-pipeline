import { Alert, Button, Tabs, Title } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { PartialAmountSection } from "./partial-amount-section";
import {
  INVOICE_ALREADY_PAID_ALERT,
  type PaymentTab,
} from "./payment-flow-form";
import { PaymentMethodSection } from "./payment-method-section";
import type { PaymentFlowModalBodyState } from "./types";

type PaymentFlowModalBodyProps = {
  body: PaymentFlowModalBodyState;
};

const isPaymentTab = (value: string): value is PaymentTab =>
  value === "one-time" || value === "installments";

export const PaymentFlowModalBody = ({ body }: PaymentFlowModalBodyProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const {
    memberId,
    fetch,
    activeTab,
    setActiveTab,
    isPartialEnabled,
    setIsPartialEnabled,
    onPartialAmountFocus,
    onPartialAmountBlur,
    partialAmountError,
    remainingAmountText,
    isPartialSupportedForSelectedMethod,
    amountToPay,
    isInvoiceAlreadyPaid,
    shouldShowMemberBalanceWarning,
    submitError,
    hasPositiveAccountBalance,
    isAccountBalanceEnough,
    accountBalance,
    hiddenAllMethodIds,
    disabledAllMethodIds,
    onSelectionChange,
    renderSelectedPaymentMethod,
    memberName,
    invoiceUrl,
    memberUrl,
  } = body;

  const openExternalLink = (url: string): void => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const tabs = [
    { id: "one-time", label: t("paymentFlowModal.tabs.oneTime") },
    { id: "installments", label: t("paymentFlowModal.tabs.installments") },
  ];

  return (
    <>
      <Tabs
        orientation="horizontal"
        tabs={tabs}
        value={activeTab}
        disableResponsive
        onValueChange={(id) => {
          if (isPaymentTab(id)) setActiveTab(id);
        }}
        className="border-b border-stroke-divider"
        disabled={isInvoiceAlreadyPaid}
      />

      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h3" color="default" weight="strong">
          {t("paymentFlowModal.totalAmountLabel")}
        </Title>
        <Title htmlVariant="h1" color="default" weight="strong">
          {amountToPay}
        </Title>
      </div>

      <PartialAmountSection
        isInvoiceAlreadyPaid={isInvoiceAlreadyPaid}
        isPartialEnabled={isPartialEnabled}
        isPartialSupportedForSelectedMethod={
          isPartialSupportedForSelectedMethod
        }
        partialAmountError={partialAmountError}
        remainingAmountText={remainingAmountText}
        onPartialEnabledChange={setIsPartialEnabled}
        onPartialAmountFocus={onPartialAmountFocus}
        onPartialAmountBlur={onPartialAmountBlur}
      />

      {isInvoiceAlreadyPaid && (
        <Alert status="warning" type="weak" layout="banner">
          {INVOICE_ALREADY_PAID_ALERT}
        </Alert>
      )}
      {shouldShowMemberBalanceWarning && (
        <Alert status="warning" type="weak" layout="banner">
          {t("paymentFlowModal.memberBalanceInsufficientAlert")}
        </Alert>
      )}
      {submitError && <Alert status="critical">{submitError}</Alert>}

      <PaymentMethodSection
        memberId={memberId}
        fetch={fetch}
        disabled={isInvoiceAlreadyPaid}
        hasPositiveAccountBalance={hasPositiveAccountBalance}
        isAccountBalanceEnough={isAccountBalanceEnough}
        accountBalance={accountBalance}
        hiddenAllMethodIds={hiddenAllMethodIds}
        disabledAllMethodIds={disabledAllMethodIds}
        onSelectionChange={onSelectionChange}
        renderSelectedPaymentMethod={() =>
          !isInvoiceAlreadyPaid && renderSelectedPaymentMethod()
        }
      />

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
    </>
  );
};
