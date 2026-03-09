import { useMemo } from "react";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import type { CampaignScheduled } from "#src/api/types";
import { useTranslation } from "#src/utils/i18n";

import { useDeleteScheduledCommunication } from "./use-delete-scheduled-communication";

const MINUTES_THRESHOLD_BEFORE_SEND = 5;

type DeleteScheduledCommunicationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignScheduled;
  smartlistId: string;
  /** Called after successful delete (e.g. navigate back to list) */
  onDeleted?: () => void;
};

function isScheduledToSendInLessThanMinutes(
  datetimeScheduledIso: string,
  minutes: number,
): boolean {
  const scheduledDt = fromIsoString(datetimeScheduledIso);
  const now = getLocalNow({});
  const diffMinutes = scheduledDt.diff(now, "minutes").as("minutes");
  return diffMinutes > 0 && diffMinutes < minutes;
}

export const DeleteScheduledCommunicationModal: React.FC<
  DeleteScheduledCommunicationModalProps
> = ({
  isOpen,
  onClose,
  campaign,
  smartlistId,
  onDeleted,
}: DeleteScheduledCommunicationModalProps) => {
  const { t } = useTranslation("campaign");

  const isSentInLessThan5Min = useMemo(
    () =>
      isScheduledToSendInLessThanMinutes(
        campaign.datetime_scheduled,
        MINUTES_THRESHOLD_BEFORE_SEND,
      ),
    [campaign.datetime_scheduled],
  );

  const { deleteScheduledCommunication, isDeleting } =
    useDeleteScheduledCommunication({ onDeleted });

  const handleDelete = () => {
    deleteScheduledCommunication({
      scheduledCampaignId: String(campaign.id),
      smartlistId,
    });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("table.campaignScheduled.deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isDeleting || isSentInLessThan5Min,
      }}
      cancelButton={{
        label: t("table.campaignScheduled.deleteModal.buttons.cancel"),
        onClick: onClose,
      }}
      title={t("table.campaignScheduled.deleteModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <div className="flex flex-col gap-lg">
        {isSentInLessThan5Min ? (
          <Body htmlVariant="p" size="lg" color="default" weight="weak">
            {t("table.campaignScheduled.deleteModal.cannotDeleteWithin5Min")}
          </Body>
        ) : (
          <>
            <Body htmlVariant="p" size="lg" color="default" weight="weak">
              {t("table.campaignScheduled.deleteModal.description")}
            </Body>
            <Body htmlVariant="p" size="lg" color="default" weight="stronger">
              {t("table.campaignScheduled.deleteModal.warning")}
            </Body>
          </>
        )}
      </div>
    </Modal>
  );
};
