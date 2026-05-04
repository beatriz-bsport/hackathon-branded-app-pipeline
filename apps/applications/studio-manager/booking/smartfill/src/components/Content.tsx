import type { FC } from "react";

import {
  ErrorFallback,
  Loader,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { SmartfillActivatedEmptyState } from "#src/components/SmartfillActivatedEmptyState";
import { SmartfillInactiveEmptyState } from "#src/components/SmartfillInactiveEmptyState";
import { SmartfillTargetedOffersList } from "#src/components/SmartfillTargetedOffersList";
import { useSmartfillConfigStatus } from "#src/hooks/use-smartfill-config-status";
import { useSmartfillTargetedOffers } from "#src/hooks/use-smartfill-targeted-offers";
import { flags, useFlag } from "#src/utils/feature-flags";
import { useTranslation } from "#src/utils/i18n";

const Content: FC = () => {
  const { t } = useTranslation("smartfill");
  const isSmartfillEnabled = useFlag(flags.smartfill);

  const {
    data: configStatus,
    isLoading: isConfigStatusLoading,
    isError: isConfigStatusError,
    refetch: refetchConfigStatus,
  } = useSmartfillConfigStatus();

  const {
    data: targetedOffersData,
    isLoading: isTargetedOffersLoading,
    isError: isTargetedOffersError,
    refetch: refetchTargetedOffers,
  } = useSmartfillTargetedOffers(isSmartfillEnabled);

  const { EmptyState: DisabledFeatureEmptyState } = useEmptyState({
    isEmpty: true,
    emptyConfig: {
      title: t("page.title"),
      subtitle: t("page.disabled"),
    },
  });

  if (!isSmartfillEnabled) {
    return <DisabledFeatureEmptyState />;
  }

  if (isConfigStatusLoading || isTargetedOffersLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size="md" />
      </div>
    );
  }

  if (isConfigStatusError || isTargetedOffersError) {
    return (
      <div className="grid h-full w-full place-content-center p-md">
        <ErrorFallback
          title={t("error.title")}
          subtitle=""
          description={t("error.description")}
          actionProps={{
            label: t("error.retry"),
            onClick: () => {
              void refetchConfigStatus();
              void refetchTargetedOffers();
            },
          }}
        />
      </div>
    );
  }

  const isEnabled = Boolean(configStatus?.enabled);
  const targetedOffersCount = targetedOffersData?.count ?? 0;

  if (targetedOffersCount > 0) {
    return <SmartfillTargetedOffersList />;
  }

  if (!isEnabled) {
    return <SmartfillInactiveEmptyState />;
  }

  return <SmartfillActivatedEmptyState />;
};

export default Content;
