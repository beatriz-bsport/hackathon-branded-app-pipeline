import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FC } from "react";

import type { SavedPaymentMethod } from "@bsport/api-financial-services";
import {
  paymentMethodKeys,
  setCompanyPaymentMethodAsDefaultAPI,
} from "@bsport/api-financial-services";
import PaymentMethodChip from "@bsport/kaizen-business-components/financial-services/payment-method-chip";
import {
  Badge,
  Body,
  Button,
  type IconName,
  type Item,
  Select,
  Title,
  toast,
} from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

/**
 * Cards: title-cased brand + identifier (e.g. "Visa 4242"), falling back to brand alone.
 * SEPA/BACS: type prefix + identifier (e.g. "SEPA 1234"), falling back to "SEPA debit" / "BACS debit".
 */
const formatPaymentMethodLabel = (
  paymentMethod: SavedPaymentMethod,
): string => {
  const identifier = paymentMethod.readable_identifier;

  if (paymentMethod.type === "card") {
    const brand = (paymentMethod.display_brand ?? paymentMethod.brand ?? "Card")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (substring) => substring.toUpperCase());
    return identifier ? `${brand} ${identifier}` : brand;
  }

  if (paymentMethod.type === "sepa_debit") {
    return identifier ? `SEPA ${identifier}` : "SEPA debit";
  }

  return identifier ? `BACS ${identifier}` : "BACS debit";
};

const getTriggerIcon = (
  paymentMethod: SavedPaymentMethod | undefined,
): IconName | undefined => {
  if (!paymentMethod) return undefined;
  return paymentMethod.type === "card" ? "credit-card-02" : "bank";
};

interface BillingPaymentMethodSectionProps {
  paymentMethods: SavedPaymentMethod[];
  defaultPaymentMethodId: string | undefined;
  onAddNew: () => void;
}

const BillingPaymentMethodSection: FC<BillingPaymentMethodSectionProps> = ({
  paymentMethods,
  defaultPaymentMethodId,
  onAddNew,
}) => {
  const { t } = useTranslation("subscription");
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | undefined>(
    defaultPaymentMethodId,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedId(defaultPaymentMethodId);
  }, [defaultPaymentMethodId]);

  const items = useMemo<Item[]>(
    () =>
      paymentMethods.map((paymentMethod) => ({
        id: paymentMethod.id,
        label: formatPaymentMethodLabel(paymentMethod),
        leftSlot: <PaymentMethodChip type={paymentMethod.type} />,
        rightSlot:
          paymentMethod.id === defaultPaymentMethodId ? (
            <Badge
              color="main"
              size="lg"
              text={t("billing.payment-method.current")}
            />
          ) : undefined,
      })),
    [paymentMethods, defaultPaymentMethodId, t],
  );

  const selectedMethod = paymentMethods.find(
    (paymentMethod) => paymentMethod.id === selectedId,
  );
  const hasChanged =
    selectedId !== undefined && selectedId !== defaultPaymentMethodId;

  const handleConfirm = useCallback(async () => {
    if (!selectedId) return;

    setIsSubmitting(true);
    try {
      await setCompanyPaymentMethodAsDefaultAPI(fetch, selectedId);
      await queryClient.invalidateQueries({
        queryKey: paymentMethodKeys.company(),
      });
      toast({
        icon: "credit-card-02",
        title: t("billing.update-payment-method.success"),
        status: "default",
      });
    } catch {
      toast({
        icon: "x-circle",
        title: t("billing.update-payment-method.error"),
        status: "critical",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedId, queryClient, t]);

  return (
    <section className="flex flex-col gap-xs">
      <div className="flex items-center justify-between gap-md">
        <Title htmlVariant="h2" weight="strong">
          {t("billing.payment-method.title")}
        </Title>
        <Button
          iconLeft="plus"
          label={t("billing.payment-method.add-new-method")}
          intent="default"
          color="main"
          size="md"
          onClick={onAddNew}
        />
      </div>
      <Body color="weak" size="sm">
        {t("billing.payment-method.description")}
      </Body>
      {paymentMethods.length > 0 ? (
        <div className="flex items-center gap-xs">
          <div className="w-component-select">
            <Select
              value={selectedId}
              items={items}
              iconLeft={getTriggerIcon(selectedMethod)}
              onChange={setSelectedId}
              disabled={isSubmitting}
              fullWidth
            />
          </div>
          <Button
            kind="icon-button"
            icon="check"
            label={t("billing.payment-method.confirm")}
            intent="call-to-action"
            color="main"
            size="md"
            disabled={!hasChanged}
            loading={isSubmitting}
            onClick={() => void handleConfirm()}
          />
        </div>
      ) : (
        <Body color="weak">{t("billing.payment-method.none")}</Body>
      )}
    </section>
  );
};

export default BillingPaymentMethodSection;
