import { type FC, useMemo, useState } from "react";

import {
  Body,
  List,
  type ListItemProps,
  Modal,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSwapPass } from "#src/hooks/appointment/actions/use-swap-pass";
import { useFetchCompatiblePasses } from "#src/hooks/appointment/fetch/useFetchCompatiblePasses";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { getAppointmentModalDescription } from "./get-appointment-modal-description";

type SwapPassModalProps = {
  appointment: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
};

export const SwapPassModal: FC<SwapPassModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const [selectedPassId, setSelectedPassId] = useState<number | null>(
    appointment.private_consumer_pass,
  );

  const { data: passes, isLoading } = useFetchCompatiblePasses(
    appointment.private_slot,
    appointment.member,
  );
  const swapPass = useSwapPass();

  const isUnchanged = selectedPassId === appointment.private_consumer_pass;

  const handleConfirm = () => {
    if (selectedPassId === null) return;

    swapPass.mutate(
      {
        id: appointment.id,
        params: { private_consumer_pass_id: selectedPassId },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const listItems: ListItemProps[] = useMemo(
    () =>
      (passes ?? []).map((pass) => ({
        id: String(pass.id),
        title: pass.private_pass.name,
        customNode: (
          <Body htmlVariant="span" size="sm" color="weak">
            {t("swapPassModal.credits", {
              used: pass.used_credits,
              total: pass.private_pass.credits,
            })}
          </Body>
        ),
        isActive: pass.id === selectedPassId,
        onItemClick: () => setSelectedPassId(pass.id),
      })),
    [passes, selectedPassId, t],
  );

  const description = getAppointmentModalDescription(appointment, {
    locale: i18n.language,
    timeZone: companyTimezone,
  });

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("swapPassModal.title")}
      description={description}
      onClose={onClose}
      confirmButton={{
        label: t("swapPassModal.confirmButton"),
        onClick: handleConfirm,
        disabled: isUnchanged || isLoading || swapPass.isPending,
      }}
      cancelButton={{
        label: t("swapPassModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        {!isLoading && listItems.length > 0 && (
          <Body htmlVariant="span" size="md" weight="strong">
            {t("swapPassModal.passesLabel")}
          </Body>
        )}
        <List
          id="swap-pass-list"
          items={listItems}
          loadingProps={{
            isLoading,
            message: t("swapPassModal.loading"),
          }}
          emptyStateProps={{
            isEmpty: !isLoading && listItems.length === 0,
            emptyConfig: { title: t("swapPassModal.emptyState") },
          }}
        />
      </div>
    </Modal>
  );
};
