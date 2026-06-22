import type { FC } from "react";

import { Card, Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { useBenefitsQueries } from "#src/hooks/api/use-benefits-queries";
import { getBenefitKind } from "#src/utils/contract-benefit";

import { BenefitsCard } from "./benefits-card";

type BenefitsCardWithQueryProps = {
  passId: number | null;
  appointmentPassId: number | null;
};

const BenefitsCardWithQueryInner: FC<BenefitsCardWithQueryProps> = ({
  passId,
  appointmentPassId,
}) => {
  const { passBenefit, appointmentPassBenefit } = useBenefitsQueries({
    passId,
    appointmentPassId,
  });

  let credits: number | null = null;
  let hasAccessToOnDemand: boolean = false;

  const hasPass = passBenefit != null;
  const hasAppointmentPass = appointmentPassBenefit != null;

  if (hasPass && hasAppointmentPass) {
    credits = passBenefit.credits ?? appointmentPassBenefit.credits;
    hasAccessToOnDemand =
      passBenefit.full_vod_access || appointmentPassBenefit.full_vod_access;
  } else if (hasAppointmentPass) {
    credits = appointmentPassBenefit.credits;
    hasAccessToOnDemand = appointmentPassBenefit.full_vod_access;
  } else if (hasPass) {
    credits = passBenefit.credits;
    hasAccessToOnDemand = passBenefit.full_vod_access;
  }

  return (
    <BenefitsCard
      credits={credits}
      hasAccessToOnDemand={hasAccessToOnDemand}
      kind={getBenefitKind({ hasAppointmentPass, hasPass })}
    />
  );
};

export const BenefitsCardWithQuery: FC<BenefitsCardWithQueryProps> = (
  params,
) => {
  return (
    <QueryBoundary
      loadingFallback={
        <Card>
          <Loader size="md" className="mx-auto" />
        </Card>
      }
    >
      <BenefitsCardWithQueryInner {...params} />
    </QueryBoundary>
  );
};
