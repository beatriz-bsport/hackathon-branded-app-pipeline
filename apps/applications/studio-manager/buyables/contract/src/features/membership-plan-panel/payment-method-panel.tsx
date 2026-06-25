import { type FC, useState } from "react";

import type { BillingPlan } from "@bsport/api-buyables/billing-plan";
import { PaymentMethodDisplay } from "@bsport/kaizen-business-components/financial-services/payment-method-display";
import { Body, Button } from "@bsport/kaizen-primitive-core";

import { useSavedPaymentMethodsQuery } from "#src/hooks/api/use-saved-payment-methods-query";
import { useSetBillingPlanPaymentMethod } from "#src/hooks/api/use-set-billing-plan-payment-method";
import { useTranslation } from "#src/utils/i18n";

import {
  MembershipPlanPaymentMethodEditor,
  type SavedPaymentMethodSelection,
} from "./payment-method-editor";
import { findCurrentSavedPaymentMethod } from "./payment-method-helpers";

type Props = {
  membershipPlan: BillingPlan;
};

export const MembershipPlanPaymentMethodPanel: FC<Props> = ({
  membershipPlan,
}) => {
  const { t } = useTranslation("membership-plan");
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: savedPaymentMethods = [],
    isError,
    isLoading,
  } = useSavedPaymentMethodsQuery(membershipPlan.member);
  const { isSettingBillingPlanPaymentMethod, setBillingPlanPaymentMethod } =
    useSetBillingPlanPaymentMethod({ member: membershipPlan.member });

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

  const handleSave = (selection: SavedPaymentMethodSelection) =>
    // This panel only surfaces Stripe payment methods (card / SEPA / BACS).
    // If non-Stripe methods (bsport credit, terminal) become supported here,
    // the source value will need to be derived from the selection.
    setBillingPlanPaymentMethod({
      id: membershipPlan.id,
      payment_method_identifier: selection.payment_backend_identifier,
      payment_method_id: selection.id,
      source: "stripe",
    });

  const canSelectSavedPaymentMethod = savedPaymentMethods.length > 0;

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center justify-between gap-xs">
        <Body size="lg" weight="strong">
          {t("panel.paymentMethod.title")}
        </Body>

        {!isEditing && canSelectSavedPaymentMethod && (
          <Button
            color="default"
            intent="flat"
            kind="icon-button"
            icon={currentPaymentMethod ? "pencil-02" : "plus"}
            label={t(
              currentPaymentMethod
                ? "panel.paymentMethod.edit"
                : "panel.paymentMethod.selectPaymentMethod",
            )}
            onClick={() => setIsEditing(true)}
            size="sm"
          />
        )}
      </div>

      {isEditing ? (
        <MembershipPlanPaymentMethodEditor
          {...(currentPaymentMethod ? { currentPaymentMethod } : {})}
          isSaving={isSettingBillingPlanPaymentMethod}
          memberId={membershipPlan.member}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : currentPaymentMethod ? (
        <PaymentMethodDisplay paymentMethod={currentPaymentMethod} />
      ) : (
        <Body size="md" color="weak">
          {t("panel.paymentMethod.emptyTitle")}
        </Body>
      )}
    </div>
  );
};
