import type { FC } from "react";

import { Card, Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { useBenefitsQueries } from "#src/hooks/api/use-benefits-queries";

import { BenefitsCard } from "./benefits-card";

type BenefitsCardWithQueryProps = {
  passId: number | null;
  appointmentPassId: number | null;
  onEditClick?: () => void;
};

const BenefitsCardWithQueryInner: FC<BenefitsCardWithQueryProps> = ({
  passId,
  appointmentPassId,
  onEditClick,
}) => {
  const { passBenefit, appointmentPassBenefit } = useBenefitsQueries({
    passId,
    appointmentPassId,
  });

  return (
    <BenefitsCard
      appointmentPassBenefit={appointmentPassBenefit}
      passBenefit={passBenefit}
      onEditClick={onEditClick}
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
