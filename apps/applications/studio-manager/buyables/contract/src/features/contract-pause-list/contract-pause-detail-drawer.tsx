import type { FC } from "react";

import type { ContractPause } from "@bsport/api-buyables/contract-pause";
import {
  Chip,
  type ChipProps,
  DetailDrawer,
  List,
  Title,
} from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import type { ListItemDetailDrawerProps } from "#src/hooks/layout/use-list-item-detail-drawer";
import { useTranslation } from "#src/utils/i18n";
import {
  PAUSE_STATUSES,
  getPauseStatus,
  usePauseStatusesTranslations,
} from "#src/utils/pauses";

import { ContractPauseMembershipPlanList } from "./contract-pause-membership-plan-list";

type ContractPauseDetailDrawerProps = ListItemDetailDrawerProps<ContractPause>;

export const ContractPauseDetailDrawer: FC<ContractPauseDetailDrawerProps> = ({
  isOpen,
  selectedItem,
  closeDrawer,
  selectNextItem,
  selectPreviousItem,
}) => {
  const { t } = useTranslation("contract-features");

  const pauseStatuses = usePauseStatusesTranslations();

  const getPauseChipConfig = (contractPause: ContractPause): ChipProps => {
    const pauseStatus = getPauseStatus({
      fromDate: contractPause.from_date,
      untilDate: contractPause.until_date,
    });
    return {
      type: "weak",
      size: "lg",
      label: pauseStatuses[pauseStatus],
      color: pauseStatus === PAUSE_STATUSES.ACTIVE ? "main" : "default",
    };
  };

  return (
    <DetailDrawer
      id="contract-pause-detail-drawer"
      isOpen={isOpen}
      onClose={closeDrawer}
      className="w-breakpoint-mobile"
      actionsConfig={[
        {
          id: "select-previous-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-up",
          kind: "icon-button",
          label: t("pauseDetailDrawer.navigation.selectPreviousItem"),
          onClick: selectPreviousItem,
        },
        {
          id: "select-next-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-down",
          kind: "icon-button",
          label: t("pauseDetailDrawer.navigation.selectNextItem"),
          onClick: selectNextItem,
        },
      ]}
    >
      <section className="flex flex-col gap-lg">
        <div className="inline-flex gap-md items-center">
          <Title htmlVariant="h2" weight="strong" className="truncate">
            {selectedItem?.name ?? ""}
          </Title>
          {selectedItem && <Chip {...getPauseChipConfig(selectedItem)} />}
        </div>

        <QueryBoundary>
          {selectedItem &&
          selectedItem.billing_plan_impossible.length +
            selectedItem.billing_plan_success.length >
            0 ? (
            <ContractPauseMembershipPlanList
              contractId={selectedItem.contract}
              notPausedMembershipPlanIds={selectedItem.billing_plan_impossible.map(
                (item) => item[0],
              )}
              pausedMembershipPlanIds={selectedItem.billing_plan_success.map(
                (item) => item[0],
              )}
            />
          ) : (
            <List
              id={`contract-empty-pause-membership-plans`}
              isCompact
              items={[]}
              emptyStateProps={{
                isEmpty: true,
                emptyConfig: {
                  subtitle: t("pauseDetailDrawer.emptyList"),
                },
              }}
            />
          )}
        </QueryBoundary>
      </section>
    </DetailDrawer>
  );
};
