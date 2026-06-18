import { useMemo } from "react";

import type { ContractPause } from "@bsport/api-buyables/contract-pause";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  type ActionButton,
  type ListItemProps,
  type WithTooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  PAUSE_STATUSES,
  getPauseStatus,
  usePauseStatusesTranslations,
} from "#src/utils/pauses";

function formatPauseDateRange({
  fromDate,
  untilDate,
}: {
  fromDate: string;
  untilDate: string;
}) {
  const fallback = "N/A";
  const start = fromDate
    ? formatDateTime(fromDate, DATETIME_FORMATS.DAY_MONTH_YEAR)
    : fallback;
  const end = untilDate
    ? formatDateTime(untilDate, DATETIME_FORMATS.DAY_MONTH_YEAR)
    : fallback;
  return `${start} - ${end}`;
}

export const useContractPauseListRows = ({
  contractPauses,
  onEditClick,
  onCancelClick,
}: {
  contractPauses: ContractPause[];
  onEditClick: (selectedPause: ContractPause) => void;
  onCancelClick: (selectedPauseId: number) => void;
}) => {
  const { t, i18n } = useTranslation("contract-features");

  const isMobile = !useMatchMedia("sm");

  const pauseStatuses = usePauseStatusesTranslations();

  const rows: ListItemProps[] = useMemo(
    () => {
      return contractPauses.map((contractPause) => {
        const { from_date: fromDate, until_date: untilDate } = contractPause;

        const pauseStatus = getPauseStatus({ fromDate, untilDate });

        return {
          id: contractPause.id.toString(),
          title: formatPauseDateRange({
            fromDate,
            untilDate,
          }),
          description: contractPause.name,
          chips: [
            {
              type: "weak",
              size: "lg",
              label: pauseStatuses[pauseStatus],
              color: pauseStatus === PAUSE_STATUSES.ACTIVE ? "main" : "default",
            },
          ],
          buttons: [
            {
              label: t("pauseList.items.buttons.cancel"),
              icon: "alarm-clock-off" as const,
              color: "default",
              intent: "flat",
              kind: "icon-button",
              id: `cancel-pause-${contractPause.id}`,
              size: "md",
              tooltipProps: {
                label: t("pauseList.items.buttons.cancel"),
                placement: "top-right",
              },
              disabled:
                pauseStatus === PAUSE_STATUSES.ENDED ||
                pauseStatus === PAUSE_STATUSES.ACTIVE,
              onClick: () => onCancelClick(contractPause.id),
            },
            {
              label: t("pauseList.items.buttons.edit"),
              icon: "pencil-02" as const,
              color: "default",
              intent: "flat",
              kind: "icon-button",
              id: `edit-pause-${contractPause.id}`,
              size: "md",
              tooltipProps: {
                label: t("pauseList.items.buttons.edit"),
                placement: "top-right",
              },
              disabled: pauseStatus === PAUSE_STATUSES.ENDED,
              onClick: () => onEditClick(contractPause),
            },
          ] satisfies Array<WithTooltip<ActionButton>>,
          dropdownConfig: {
            visibleActionsDisplayLimit: isMobile ? 0 : 2,
          },
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contractPauses, i18n.language, isMobile, onEditClick, onCancelClick],
  );

  return rows;
};
