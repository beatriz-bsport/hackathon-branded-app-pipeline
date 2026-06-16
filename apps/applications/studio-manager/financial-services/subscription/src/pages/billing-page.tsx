import { type FC, useState } from "react";

import { Alert, ErrorFallback, Loader } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import AddPaymentMethodModal from "#src/components/add-payment-method-modal";
import BillingInvoiceHistorySection from "#src/components/billing-invoice-history-section";
import BillingPaymentMethodSection from "#src/components/billing-payment-method-section";
import { useBillingData } from "#src/hooks/use-billing-data";
import { useTranslation } from "#src/utils/i18n";

const BillingPage: FC = () => {
  const { t } = useTranslation("subscription");
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
  const {
    paymentMethods,
    invoices,
    isLoading,
    isError,
    refetch,
    hasLatestInvoiceFailed,
    payInvoice,
    isPayingInvoice,
  } = useBillingData();

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const currencyDisplay = companyTheme?.currency_display ?? "€";

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <span>{t("billing.loading")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorFallback
          actionProps={{ onClick: refetch, label: t("billing.retry") }}
          description={t("billing.error")}
        />
      </div>
    );
  }

  const defaultPaymentMethod = paymentMethods.find((m) => m.is_default);

  return (
    <>
      <div className="flex min-w-0 flex-col p-md w-full max-w-component-content-centered m-auto gap-md">
        {hasLatestInvoiceFailed && (
          <Alert status="critical" title={t("billing.alert.title")}>
            {t("billing.alert.description")}
          </Alert>
        )}

        <BillingPaymentMethodSection
          paymentMethods={paymentMethods}
          defaultPaymentMethodId={defaultPaymentMethod?.id}
          onAddNew={() => setIsAddMethodModalOpen(true)}
        />

        <BillingInvoiceHistorySection
          invoices={invoices}
          currencyDisplay={currencyDisplay}
          payInvoice={payInvoice}
          isPayingInvoice={isPayingInvoice}
        />
      </div>
      <AddPaymentMethodModal
        isOpen={isAddMethodModalOpen}
        onClose={() => setIsAddMethodModalOpen(false)}
      />
    </>
  );
};

export default BillingPage;
