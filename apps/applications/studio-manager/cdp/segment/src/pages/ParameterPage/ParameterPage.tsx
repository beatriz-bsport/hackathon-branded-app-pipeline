import { useOutletContext } from "react-router";

import { Button, DetailDrawer } from "@bsport/kaizen-primitive-core";

import { FilterDraftDiscardModal } from "#src/components/filters/filter-draft-discard-modal";
import { SegmentFiltersManager } from "#src/components/filters/segment-filters-manager";
import { SmartlistMembersList } from "#src/components/smartlist-members-list/smartlist-members-list";
import { useFilterDraftCloseGuard } from "#src/hooks/use-filter-draft-close-guard";
import { useRefreshSmartlistMembers } from "#src/hooks/use-refresh-smartlist-members";
import type { DetailsPageOutletContext } from "#src/pages/DetailsPage/details-page-outlet-context";
import { useTranslation } from "#src/utils/i18n";

export const ParameterPage = () => {
  const { t } = useTranslation("details");
  const { smartlistId, isParameterDrawerOpen, closeParameterDrawer } =
    useOutletContext<DetailsPageOutletContext>();
  const refreshSmartlistMembers = useRefreshSmartlistMembers(smartlistId);
  const {
    isDiscardModalOpen,
    requestProtectedAction,
    confirmDiscard,
    cancelDiscard,
  } = useFilterDraftCloseGuard();

  const handleCloseDrawer = () => {
    requestProtectedAction(closeParameterDrawer);
  };

  return (
    <>
      <SmartlistMembersList smartlistId={smartlistId} />
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
              label={t("actions.refreshMembers")}
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
    </>
  );
};
