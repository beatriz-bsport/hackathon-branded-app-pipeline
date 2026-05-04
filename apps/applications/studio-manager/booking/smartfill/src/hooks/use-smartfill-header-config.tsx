import { useMemo } from "react";

import { type ChipProps, ListLayout } from "@bsport/kaizen-primitive-core";

import { useSmartfillConfigStatus } from "#src/hooks/use-smartfill-config-status";
import { useSmartfillConfigToggle } from "#src/hooks/use-smartfill-config-toggle";
import { useSmartfillTargetedOffers } from "#src/hooks/use-smartfill-targeted-offers";
import { flags, useFlag } from "#src/utils/feature-flags";
import { useTranslation } from "#src/utils/i18n";

export const useSmartfillHeaderConfig = () => {
  const { t } = useTranslation("smartfill");
  const isSmartfillEnabled = useFlag(flags.smartfill);
  const { data, isLoading } = useSmartfillConfigStatus();
  const { data: targetedOffersData, isLoading: isTargetedOffersLoading } =
    useSmartfillTargetedOffers(isSmartfillEnabled);
  const { mutate: toggleSmartfillConfig, isPending } =
    useSmartfillConfigToggle();

  const isActive = Boolean(data?.enabled);
  const targetedOffersCount = targetedOffersData?.count ?? 0;

  const pageStatusChip = useMemo<ChipProps | undefined>(() => {
    if (!isSmartfillEnabled || isLoading) return undefined;
    return {
      size: "sm",
      type: "weak",
      color: isActive ? "main" : "default",
      label: isActive
        ? t("header.statusChip.active")
        : t("header.statusChip.inactive"),
    };
  }, [isSmartfillEnabled, isLoading, isActive, t]);

  const callToActionButton = useMemo(() => {
    if (!isSmartfillEnabled || isLoading || isTargetedOffersLoading)
      return undefined;
    if (!isActive && targetedOffersCount === 0) return undefined;
    return (
      <ListLayout.Button
        intent={isActive ? "default" : "call-to-action"}
        color="main"
        label={isActive ? t("section.disable") : t("section.activate")}
        loading={isPending}
        disabled={isPending}
        onClick={() => {
          toggleSmartfillConfig(isActive ? "deactivate" : "activate");
        }}
      />
    );
  }, [
    isSmartfillEnabled,
    isLoading,
    isTargetedOffersLoading,
    isActive,
    isPending,
    targetedOffersCount,
    t,
    toggleSmartfillConfig,
  ]);

  return { pageStatusChip, callToActionButton };
};
