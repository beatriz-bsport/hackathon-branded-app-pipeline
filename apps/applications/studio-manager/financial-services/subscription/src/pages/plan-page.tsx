import type { FC } from "react";

import { ErrorFallback, Loader, Title } from "@bsport/kaizen-primitive-core";

import FeatureComparisonTable from "#src/components/feature-comparison-table";
import PlanOverviewSection from "#src/components/plan-overview-section";
import { usePlanData } from "#src/hooks/use-plan-data";
import { MARKETS, PlanKey } from "#src/types/plan";
import { useTranslation } from "#src/utils/i18n";

const PlanPage: FC = () => {
  const { t } = useTranslation("subscription");
  const { data, isLoading, isError, refetch } = usePlanData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-md">
        <Loader size="xl" />
        <span>{t("plan.loading")}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <ErrorFallback
          actionProps={{
            onClick: refetch,
            label: t("plan.retry"),
          }}
          description={t("plan.error")}
        />
      </div>
    );
  }

  const { plans, features, currentPlanId, renewDate, marketId } = data;
  const market = MARKETS[marketId];

  const headers: Record<"feature" | PlanKey, string> = {
    feature: t("plan.columns.feature"),
    start: t("plan.columns.start"),
    build: t("plan.columns.build"),
    engage: t("plan.columns.engage"),
    elevate: t("plan.columns.elevate"),
  };

  return (
    <div className="flex min-w-0 flex-col p-md w-full max-w-component-content-centered m-auto gap-md">
      <section className="flex min-w-0 flex-col">
        <PlanOverviewSection
          plans={plans}
          currentPlanId={currentPlanId}
          market={market}
          renewDate={renewDate}
        />
      </section>
      <section className="flex min-w-0 flex-col gap-xs overflow-x-hidden">
        <Title htmlVariant="h3" weight="strong">
          {t("plan.what-is-included")}
        </Title>
        <FeatureComparisonTable features={features} headers={headers} />
      </section>
    </div>
  );
};

export default PlanPage;
