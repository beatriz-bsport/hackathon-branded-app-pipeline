import { useEffect } from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

import {
  FormStepContextProvider,
  NOTIFICATION_CONTENT_STEP_IDENTIFIER,
  NOTIFICATION_TRIGGER_STEP_IDENTIFIER,
  NOTIFICATION_TYPE_STEP_IDENTIFIER,
  useFormStepContext,
} from "./Context/FormStepContext.context";
import { initializeFormDataFromDraftMarketingNotification } from "./Context/form-data-formatting-utils";
import { NotificationContentForm } from "./NotificationContent/NotificationContentForm";
import { TriggerConditionStep } from "./NotificationTriggerForms/TriggerConditionStep";
import { TriggerTypeStep } from "./TriggerTypeSelector/TriggerTypeStep";

type EditMarketingNotificationModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  draftMarketingNotification?: MarketingNotification;
};
export const EditMarketingNotificationModal = ({
  isOpen,
  onClose,
  draftMarketingNotification,
}: EditMarketingNotificationModalProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { groupActivitiesById } = useGetMarketingNotificationDependenciesData();
  const {
    currentStep,
    updateForm,
    setBuildMarketingNotificationAction,
    checkIfCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    setStepValid,
  } = useFormStepContext();

  const isConfirmButtonDisabled = !checkIfCurrentStepValid();

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  useEffect(() => {
    if (draftMarketingNotification) {
      const baseFormData = initializeFormDataFromDraftMarketingNotification(
        draftMarketingNotification,
        groupActivitiesById,
      );
      updateForm({ ...baseFormData });
      setStepValid(NOTIFICATION_TYPE_STEP_IDENTIFIER, true);
      goToNextStep();
    }
  }, [draftMarketingNotification, groupActivitiesById]);

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      title={draftMarketingNotification ? t("title.edit") : t("title.create")}
      size="lg"
      steps={[
        {
          label: t("steps.label.triggerType"),
          content: <TriggerTypeStep />,
        },
        {
          label: t("steps.label.notificationRules"),
          content: <TriggerConditionStep />,
        },
        {
          label: t("steps.label.content"),
          content: <NotificationContentForm handleCloseModal={handleClose} />,
        },
      ]}
      initialStep={
        draftMarketingNotification
          ? NOTIFICATION_TRIGGER_STEP_IDENTIFIER
          : NOTIFICATION_TYPE_STEP_IDENTIFIER
      }
      confirmButton={{
        label: draftMarketingNotification
          ? t("buttons.edit")
          : t("buttons.create"),
        color: "main",
        disabled: isConfirmButtonDisabled,
        onClick: () => {
          if (currentStep === NOTIFICATION_CONTENT_STEP_IDENTIFIER) {
            setBuildMarketingNotificationAction(
              draftMarketingNotification ? "edit" : "create",
            );
          } else {
            goToNextStep();
          }
        },
      }}
      cancelButton={{
        label: t("buttons.cancel"),
        onClick: () => {
          if (
            (draftMarketingNotification &&
              currentStep === NOTIFICATION_TRIGGER_STEP_IDENTIFIER) ||
            currentStep === NOTIFICATION_TYPE_STEP_IDENTIFIER
          ) {
            handleClose();
          }
          goToPreviousStep();
        },
      }}
      onClickOutside={() => {}}
      onClose={() => {
        handleClose?.();
      }}
      onCloseButtonClick={() => {
        handleClose?.();
      }}
    />
  );
};

export const EditMarketingNotificationModalWrapper = (
  props: EditMarketingNotificationModalProps,
) => {
  return (
    <FormStepContextProvider>
      <EditMarketingNotificationModal {...props} />
    </FormStepContextProvider>
  );
};
