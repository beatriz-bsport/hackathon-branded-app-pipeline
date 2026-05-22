import { type FC, useMemo } from "react";

import { PartnershipIdentifier } from "@bsport/api-book";
import {
  ListLayout,
  Loader,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { MyClubsSection } from "#src/features/myclubs/components/myclubs-section";
import { useAggregatorPartnershipId } from "#src/features/partnership-aggregator/hooks/use-aggregator-partnership-id";
import { UscSection } from "#src/features/usc/components/usc-section";
import { WellhubSection } from "#src/features/wellhub/components/wellhub-section";
import { WellpassSection } from "#src/features/wellpass/components/wellpass-section";
import { AggregatorFlags, useAggregatorFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

const AggregatorsContent: FC = () => {
  const { t } = useTranslation("common");
  const { data: myclubsId } = useAggregatorPartnershipId(
    PartnershipIdentifier.MYCLUBS,
  );
  const { data: wellhubId } = useAggregatorPartnershipId(
    PartnershipIdentifier.WELLHUB,
  );
  const { data: uscId } = useAggregatorPartnershipId(PartnershipIdentifier.USC);
  const { data: wellpassId } = useAggregatorPartnershipId(
    PartnershipIdentifier.WELLPASS,
  );

  const isWellpassEnabled = useAggregatorFlag(
    AggregatorFlags.BOOKING_ACTIVATE_NEW_WELLPASS_CONFIGURATION,
  );

  const hasAny =
    myclubsId != null ||
    wellhubId != null ||
    uscId != null ||
    (isWellpassEnabled && wellpassId != null);

  const emptyConfig = useMemo(
    () => ({
      title: t("emptyState.title"),
      subtitle: t("emptyState.subtitle"),
      ctaButtonConfig: {
        label: t("emptyState.cta"),
        onClick: openIntercomConversation,
      },
    }),
    [t],
  );

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: !hasAny,
    emptyConfig,
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <>
      <MyClubsSection />
      <WellhubSection />
      <UscSection />
      {isWellpassEnabled && <WellpassSection />}
    </>
  );
};

const AggregatorsViewSettingsPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("name")} />
      <ListLayout.Content className="pt-md pb-xl gap-xl flex flex-col">
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <AggregatorsContent />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default AggregatorsViewSettingsPage;
