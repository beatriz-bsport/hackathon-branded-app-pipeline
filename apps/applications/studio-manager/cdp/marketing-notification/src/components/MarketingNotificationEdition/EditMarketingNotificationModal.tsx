import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { TriggerTypeStep } from "./TriggerTypeStep";

type EditMarketingNotificationModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const EditMarketingNotificationModal = ({
  isOpen,
  onClose,
}: EditMarketingNotificationModalProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <ModalStepper
      open={isOpen}
      title={t("title.create")}
      size="lg"
      steps={[
        {
          label: t("steps.label.triggerType"),
          content: (
            <TriggerTypeStep
              onSelectTriggerType={(params) => console.log(params)}
            />
          ),
        },
        {
          label: t("steps.label.notificationRules"),
          content: <>Automation Step</>,
        },
        {
          label: t("steps.label.content"),
          content: <>Content Step</>,
        },
      ]}
      initialStep={0}
      confirmButton={{
        label: "Create",
        color: "main",
        onClick: () => {
          // Handle create notification logic here
        },
      }}
      cancelButton={{
        label: "Cancel",
        color: "critical",
      }}
      onClickOutside={() => {
        onClose?.();
      }}
      onClose={() => {
        onClose?.();
      }}
      onCloseButtonClick={() => {
        onClose?.();
      }}
    />
  );
};
