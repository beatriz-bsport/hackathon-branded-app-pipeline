import { toast } from "@bsport/kaizen-primitive-core";

import { useDisableCustomForm } from "#src/hooks/api/use-disable-form";
import { useRestoreCustomForm } from "#src/hooks/api/use-restore-form";
import { useTranslation } from "#src/utils/i18n";
import type { AvailabilityModalProps } from "#src/utils/types";

export const useRestoreAction = ({
  onRestoreSuccess,
  onRestoreFailure,
  onDisableSuccess,
  onDisableFailure,
}: AvailabilityModalProps) => {
  const { t } = useTranslation("common");

  const { disableCustomForm } = useDisableCustomForm({
    onSuccess: () => {
      onDisableSuccess?.();
      toast({
        status: "default",
        icon: "reverse-left",
        title: t("toasts.messageUndone.success"),
        buttonIcon: "x-close",
      });
    },
    onFailure: () => {
      onDisableFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageUndone.error"),
        buttonIcon: "x-close",
      });
    },
  });
  const { restoreCustomForm } = useRestoreCustomForm({
    onSuccess: (formId: number) => {
      onRestoreSuccess?.();
      toast({
        status: "default",
        icon: "unarchive",
        title: t("toasts.messageRestored.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: () => {
          disableCustomForm({ id: formId });
        },
      });
    },
    onFailure: () => {
      onRestoreFailure?.();
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.messageRestored.error"),
        buttonIcon: "x-close",
      });
    },
  });

  const restoreFormAction = ({ formId }: { formId: number }) => {
    restoreCustomForm({ id: formId });
  };

  return { restoreFormAction };
};
