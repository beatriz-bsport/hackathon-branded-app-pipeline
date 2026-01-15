import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useDeleteMarketingNotification } from "#src/hooks/api/use-delete-marketing-notification";
import { useTranslation } from "#src/utils/i18n";
import {
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationPrivatePassTimeType,
} from "#src/utils/typesGuards";

type DeleteTagModalProps = {
  isOpen: boolean;
  notification: MarketingNotification;
  onClose: () => void;
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const DeleteTagModal: React.FC<DeleteTagModalProps> = ({
  isOpen,
  notification,
  onClose,
  onSuccess,
  onFailure,
}: DeleteTagModalProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const { deleteMarketingNotification } = useDeleteMarketingNotification({
    onFailure: () => {
      onFailure?.();
      toast({
        title: t("toast.delete.failure"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onClose();
    },
    onSuccess: () => {
      toast({
        title: t("toast.delete.success"),
        status: "default",
        icon: "trash-01",
        buttonIcon: "x-close",
      });
      onSuccess?.();
      onClose();
    },
  });

  const getDeleteDescription = () => {
    if (
      isMarketingNotificationPaymentPackCreditsType(notification) ||
      isMarketingNotificationPaymentPackTimeType(notification)
    ) {
      return t("deleteModal.description.paymentPack");
    }
    if (
      isMarketingNotificationPrivatePassCreditsType(notification) ||
      isMarketingNotificationPrivatePassTimeType(notification)
    ) {
      return t("deleteModal.description.privatePass");
    }
    return t("deleteModal.description.other");
  };

  const handleDelete = () => {
    deleteMarketingNotification({ id: notification.id });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("deleteModal.title")}
      confirmButton={{
        color: "critical",
        onClick: handleDelete,
        label: t("deleteModal.actions.confirm"),
      }}
      cancelButton={{
        label: t("deleteModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-sm">
        <Body htmlVariant="p">{getDeleteDescription()}</Body>
        <Body htmlVariant="p" weight="stronger">
          {t("deleteModal.description.warning")}
        </Body>
      </div>
    </Modal>
  );
};
