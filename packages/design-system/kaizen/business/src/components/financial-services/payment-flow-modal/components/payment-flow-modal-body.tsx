import { Alert, Button, Tabs } from "@bsport/kaizen-primitive-core";

import { PAYMENT_FLOW_ERROR_KEYS } from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-errors";
import {
  PAYMENT_TAB,
  isPaymentTab,
} from "#src/components/financial-services/payment-flow-modal/lib/payment-flow-form";
import type { PaymentFlowModalBodyState } from "#src/components/financial-services/payment-flow-modal/types";
import { i18nInstance, useTranslation } from "#src/i18n";

import { InstallmentsSection } from "./installments-section";
import { PartialAmountSection } from "./partial-amount-section";
import { PaymentMethodSection } from "./payment-method-section";
import { TotalAmountSection } from "./total-amount-section";

type PaymentFlowModalBodyProps = {
  body: PaymentFlowModalBodyState;
};

export const PaymentFlowModalBody = ({ body }: PaymentFlowModalBodyProps) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const {
    memberId,
    fetch,
    activeTab,
    setActiveTab,
    installmentsTabDisabled,
    installmentsTabTooltip,
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
    installmentScheduleDetail,
    installmentPerIntervalCaption,
    invoiceRemainingAmountCts,
  } = body;

  const openExternalLink = (url: string): void => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const tabs = [
    {
      id: PAYMENT_TAB.ONE_TIME,
      label: t("paymentFlowModal.tabs.oneTime"),
      disabled: isInvoiceAlreadyPaid,
    },
    {
      id: PAYMENT_TAB.INSTALLMENTS,
      label: t("paymentFlowModal.tabs.installments"),
      disabled: installmentsTabDisabled,
      ...(installmentsTabTooltip
        ? {
            tooltipProps: {
              label: installmentsTabTooltip,
              className: "!z-[1000]",
            },
          }
        : {}),
    },
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
      />

      <TotalAmountSection
        amountLabel={t("paymentFlowModal.totalAmountLabel")}
        formattedAmount={amountToPay}
        caption={
          activeTab === PAYMENT_TAB.INSTALLMENTS
            ? installmentPerIntervalCaption
            : undefined
        }
        scheduleDetail={
          activeTab === PAYMENT_TAB.INSTALLMENTS
            ? installmentScheduleDetail
            : undefined
        }
      />

      {activeTab === PAYMENT_TAB.ONE_TIME ? (
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
      ) : (
        <InstallmentsSection
          installmentScheduleTotalCts={invoiceRemainingAmountCts}
        />
      )}

      {isInvoiceAlreadyPaid && (
        <Alert status="warning" type="weak" layout="banner">
          {t(PAYMENT_FLOW_ERROR_KEYS.invoiceAlreadyPaid)}
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
