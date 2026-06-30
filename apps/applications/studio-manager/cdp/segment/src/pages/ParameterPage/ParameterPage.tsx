import { useState } from "react";
import { useOutletContext } from "react-router";

import {
  Button,
  DetailDrawer,
  Indicator,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistFiltersQuery } from "#src/api/use-smartlist-filters-query";
import { FilterDraftDiscardModal } from "#src/components/filters/filter-draft-discard-modal";
import { SegmentFiltersManager } from "#src/components/filters/segment-filters-manager";
import { SmartlistMembersList } from "#src/components/smartlist-members-list/smartlist-members-list";
import { useFilterDraftCloseGuard } from "#src/hooks/use-filter-draft-close-guard";
import { useRefreshSmartlistMembers } from "#src/hooks/use-refresh-smartlist-members";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { SmartlistTabLayout } from "#src/pages/DetailsPage/smartlist-tab-layout";
import { useTranslation } from "#src/utils/i18n";

export const ParameterPage = () => {
  const { t } = useTranslation("details");
  const isMobile = !useMatchMedia("md");
  const { smartlistId } = useOutletContext<DetailsPageOutletContext>();
  const [isParameterDrawerOpen, setIsParameterDrawerOpen] = useState(false);
  const { data: smartlistFilters } = useSmartlistFiltersQuery(smartlistId);
  const filtersCount = smartlistFilters?.filtersCount ?? 0;
  const refreshSmartlistMembers = useRefreshSmartlistMembers(smartlistId);
  const {
    isDiscardModalOpen,
    requestProtectedAction,
    confirmDiscard,
    cancelDiscard,
  } = useFilterDraftCloseGuard();

  const openParameterDrawer = () => setIsParameterDrawerOpen(true);
  const closeParameterDrawer = () => setIsParameterDrawerOpen(false);

  const handleCloseDrawer = () => {
    requestProtectedAction(closeParameterDrawer);
  };

  const parametersButton = (
    <Button
      color="main"
      intent="default"
      label={isMobile ? "" : t("tabs.parameters", { ns: "details" })}
      aria-label={t("tabs.parameters", { ns: "details" })}
      iconLeft="filter-lines"
      size="md"
      onClick={openParameterDrawer}
    />
  );

  const callToActionButton =
    filtersCount > 0 ? (
      <Indicator size="sm" position="top" color="default" value={filtersCount}>
        {parametersButton}
      </Indicator>
    ) : (
      parametersButton
    );

  return (
    <SmartlistTabLayout
      layout="list"
      smartlistId={smartlistId}
      callToActionButton={callToActionButton}
    >
      <SmartlistMembersList
        smartlistId={smartlistId}
        onOpenParameterDrawer={openParameterDrawer}
      />
      <DetailDrawer
        id="smartlist-parameters-drawer"
        className="w-[500px]"
        isOpen={isParameterDrawerOpen}
        onClose={handleCloseDrawer}
      >
        <div className="flex min-h-full flex-col gap-md">
          <div className="flex-1">
            <SegmentFiltersManager smartlistId={smartlistId} />
          </div>
          <div className="sticky bottom-0 border-t border-stroke-divider bg-surface-default-elevated pt-md">
            <Button
              color="main"
              intent="call-to-action"
              label={t("actions.showResults")}
              iconLeft="refresh-cw-01"
              size="md"
              className="w-full"
              onClick={refreshSmartlistMembers}
            />
          </div>
        </div>
      </DetailDrawer>
      <FilterDraftDiscardModal
        isOpen={isDiscardModalOpen}
        onConfirmDiscard={confirmDiscard}
        onCancel={cancelDiscard}
      />
    </SmartlistTabLayout>
  );
};
