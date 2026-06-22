import type { FC } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { PaymentMethodDisplay } from "@bsport/kaizen-business-components/financial-services/payment-method-display";
import { PaymentMethodSelector } from "@bsport/kaizen-business-components/financial-services/payment-method-selector";
import { Body } from "@bsport/kaizen-primitive-core";

import { useSavedPaymentMethodsQuery } from "#src/hooks/api/use-saved-payment-methods-query";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { findCurrentSavedPaymentMethod } from "./payment-method-helpers";

type Props = {
  membershipPlan: BillingPlan;
};

export const MembershipPlanPaymentMethodPanel: FC<Props> = ({
  membershipPlan,
}) => {
  const { t } = useTranslation("membership-plan");
  const {
    data: savedPaymentMethods = [],
    isError,
    isLoading,
  } = useSavedPaymentMethodsQuery(membershipPlan.member);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-sm">
        <Body color="weak" size="sm">
          {t("panel.paymentMethod.loading")}
        </Body>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-sm">
        <Body color="critical" size="sm">
          {t("panel.paymentMethod.error")}
        </Body>
      </div>
    );
  }

  const currentPaymentMethod = findCurrentSavedPaymentMethod(
    membershipPlan,
    savedPaymentMethods,
  );

  if (!currentPaymentMethod) {
    return (
      <div className="flex flex-col gap-sm">
        <Body size="lg" weight="strong">
          {t("panel.paymentMethod.emptyTitle")}
        </Body>

        <PaymentMethodSelector fetch={fetch} memberId={membershipPlan.member} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      <Body size="lg" weight="strong">
        {t("panel.paymentMethod.current")}
      </Body>

      <PaymentMethodDisplay paymentMethod={currentPaymentMethod} />
    </div>
  );
};
