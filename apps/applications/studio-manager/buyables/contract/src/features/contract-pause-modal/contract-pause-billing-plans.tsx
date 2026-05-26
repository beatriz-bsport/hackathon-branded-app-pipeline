import type { FC } from "react";

import { Alert, Body, Title } from "@bsport/kaizen-primitive-core";

import { useBillingPlansQuery } from "#src/hooks/api/use-billing-plans-query";
import { useTranslation } from "#src/utils/i18n";

import { AffectedBillingPlanList } from "./affected-billing-plan-list";

type ContractPauseBillingPlansProps = {
  validBillingPlans?: number[];
  invalidBillingPlans?: number[];
};

export const ContractPauseBillingPlans: FC<ContractPauseBillingPlansProps> = ({
  validBillingPlans,
  invalidBillingPlans,
}) => {
  const validIds = validBillingPlans ?? [];
  const invalidIds = invalidBillingPlans ?? [];

  const billingPlanIds = [...validIds, ...invalidIds];
  const { data, isLoading } = useBillingPlansQuery({ id__in: billingPlanIds });

  const billingPlans = data ?? [];

  const { t } = useTranslation("contract-features");

  const displayInvalidAlert = invalidIds.length > 0;

  return (
    <section onSubmit={(e) => e.stopPropagation()}>
      <div className="mb-md">
        <Title htmlVariant="h4" className="mb-2xs" weight="strong">
          {t("pauseModal.billingPlans.willBePaused.title")}
        </Title>
        {validIds.length > 0 && (
          <Body className="mb-sm">
            {t("pauseModal.billingPlans.willBePaused.description")}
          </Body>
        )}
        <AffectedBillingPlanList
          listId="billing-plan-list-valid"
          isLoading={isLoading}
          billingPlans={billingPlans.filter((item) =>
            validIds.includes(item.id),
          )}
        />
      </div>

      <div>
        <Title htmlVariant="h4" className="mb-2xs" weight="strong">
          {t("pauseModal.billingPlans.wontBePaused.title")}
        </Title>
        {displayInvalidAlert && (
          <>
            <Body className="mb-sm" color="critical">
              {t("pauseModal.billingPlans.wontBePaused.description", {
                count: invalidIds.length,
              })}
            </Body>
            <Alert status="info" customIcon="info-circle">
              {t("pauseModal.billingPlans.wontBePaused.alertInfo")}
            </Alert>
          </>
        )}
        <AffectedBillingPlanList
          listId="billing-plan-list-invalid"
          isLoading={isLoading}
          billingPlans={billingPlans.filter((item) =>
            invalidIds.includes(item.id),
          )}
        />
      </div>
    </section>
  );
};
