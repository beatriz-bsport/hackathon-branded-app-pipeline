import type { FC } from "react";

import type { BillingPlanPause } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useCancelBillingPlanPause } from "#src/hooks/api/use-cancel-billing-plan-pause";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  billingPlanId: number;
  pause: BillingPlanPause;
  isOpen: boolean;
  closeModal: () => void;
};

const formatPauseDate = (date: string) =>
  formatDateTime(date, DATETIME_FORMATS.DAY_MONTH);

export const MembershipPlanDeactivatePauseModal: FC<Props> = ({
  billingPlanId,
  pause,
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation("membership-plan");

  const { cancelBillingPlanPause, isCancelling } = useCancelBillingPlanPause({
    onSuccess: closeModal,
  });

  const safeCloseModal = () => {
    if (!isCancelling) {
      closeModal();
    }
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("deactivatePauseModal.actions.confirm"),
        onClick: () =>
          cancelBillingPlanPause({
            billing_plan_id: billingPlanId,
            pause_id: pause.id,
          }),
        disabled: isCancelling,
      }}
      cancelButton={{
        label: t("deactivatePauseModal.actions.cancel"),
        onClick: safeCloseModal,
        disabled: isCancelling,
      }}
      onCloseButtonClick={safeCloseModal}
      title={t("deactivatePauseModal.title")}
      size="md"
      onClickOutside={safeCloseModal}
    >
      <Body htmlVariant="p">
        {t("deactivatePauseModal.body", {
          fromDate: formatPauseDate(pause.from_date),
          untilDate: formatPauseDate(pause.until_date),
          name: pause.name,
        })}
      </Body>
    </Modal>
  );
};
