import { useEffect, useState } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  EmailTemplateDetail,
  createEmailTemplateAction,
} from "@bsport/store-cdp-email-template";
import { useAsync } from "@bsport/use-async";

import { AppLoader } from "#src/components/Common/AppLoader";
import { useDeleteTemplate } from "#src/hooks/api/use-delete-template";
import { useFetchTemplateDetail } from "#src/hooks/fetch/useFetchTemplateDetails";
import { fetch } from "#src/utils/fetch";
import { Trans, useTranslation } from "#src/utils/i18n";
import type { ModalProps } from "#src/utils/types";

type Props = ModalProps & {
  templateId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteTemplateModal: React.FC<Props> = ({
  templateId,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const [templateTmp, setTemplateTmp] = useState<EmailTemplateDetail | null>(
    null,
  );
  const { emailTemplateDetail, isLoading, fetchEmailTemplateDetail } =
    useFetchTemplateDetail({ emailTemplateId: templateId });
  const { t } = useTranslation("list");

  const [, restoreEmailTemplate] = useAsync({
    asyncFn: async (emailTemplateDetails: EmailTemplateDetail) => {
      return createEmailTemplateAction(fetch, {
        ...emailTemplateDetails,
      });
    },
    onSuccess: () => {
      onSuccess?.();
      toast({
        status: "default",
        icon: "reverse-left",
        buttonIcon: "x-close",
        title: t("activeList.actions.undo.success"),
      });
    },
    onFailure: () => {
      onFailure?.();
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.restoreEmailTemplateAction.onFailure.title"),
      });
    },
    dependencies: [onSuccess, onFailure, templateTmp],
  });

  const { deleteTemplate } = useDeleteTemplate({
    onSuccess: (deletedTemplate: EmailTemplateDetail) => {
      toast({
        status: "default",
        icon: "trash-01",
        title: t("activeList.deleteTemplateModal.onSuccess.title"),
        buttonLabel: t("activeList.deleteTemplateModal.onSuccess.action"),
        onButtonClick: () => {
          restoreEmailTemplate(deletedTemplate);
        },
      });
      onSuccess?.();
      onClose();
    },
    onFailure: () => {
      onFailure?.();
      onClose();
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.deleteTemplateModal.onFailure.title"),
      });
    },
  });

  const handleDeleteTemplate = () => {
    if (!emailTemplateDetail) {
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.deleteTemplateModal.onFailure.title"),
      });
      return;
    }
    deleteTemplate({ ...emailTemplateDetail });
  };

  useEffect(() => {
    fetchEmailTemplateDetail({ id: templateId });
  }, [fetchEmailTemplateDetail, templateId]);

  useEffect(() => {
    if (emailTemplateDetail) {
      setTemplateTmp(emailTemplateDetail);
    }
  }, [emailTemplateDetail]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.deleteTemplateModal.title")}
      confirmButton={{
        label: t("activeList.deleteTemplateModal.confirmButton"),
        color: "critical",
        onClick: handleDeleteTemplate,
      }}
      cancelButton={{
        label: t("activeList.deleteTemplateModal.cancelButton"),
        onClick: onClose,
      }}
      size="md"
    >
      {isLoading || !emailTemplateDetail ? (
        <AppLoader />
      ) : (
        <div className="flex flex-col gap-y-sm">
          <Body htmlVariant="p" size="lg" color="default" weight="weak">
            <Trans
              i18nKey={"activeList.deleteTemplateModal.description.firstStep"}
              values={{ emailTemplateTitle: emailTemplateDetail?.title }}
              components={{
                b: <b></b>,
              }}
            />
          </Body>
          <Body htmlVariant="p" size="lg" color="default" weight="weak">
            {t("activeList.deleteTemplateModal.description.secondStep")}
          </Body>
        </div>
      )}
    </Modal>
  );
};
