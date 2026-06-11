import { FC } from "react";

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
  const { passBenefit, appointmentPassBenefit, isLoading } = useBenefitsQueries(
    {
      passId,
      appointmentPassId,
      throwOnError: true, // Let the boundary catch errors
    },
  );

  if (isLoading) {
    return (
      <Card>
        <Loader size="md" className="mx-auto" />
      </Card>
    );
  }

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
    <QueryBoundary>
      <BenefitsCardWithQueryInner {...params} />
    </QueryBoundary>
  );
};
