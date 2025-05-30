import { useEffect } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateDetail } from "@bsport/store-cdp-email-template";

import { AppLoader } from "#src/components/Common/AppLoader";
import { useDuplicateTemplate } from "#src/hooks/api/use-duplicate-template";
import { useFetchTemplateDetail } from "#src/hooks/fetch/useFetchTemplateDetails";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { Trans, useTranslation } from "#src/utils/i18n";
import { getLocalISOStringWithOffset } from "#src/utils/time";
import type { ModalProps } from "#src/utils/types";

type Props = ModalProps & {
  templateId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const DuplicateTemplateModal: React.FC<Props> = ({
  templateId,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const { emailTemplateDetail, isLoading, fetchEmailTemplateDetail } =
    useFetchTemplateDetail({ emailTemplateId: templateId });
  const { navigateToTemplateDetails } = useTemplateNavigation();

  const { t } = useTranslation("list");
  const { duplicateTemplate } = useDuplicateTemplate({
    onSuccess: (duplicatedTemplate: EmailTemplateDetail) => {
      onSuccess?.();
      toast({
        status: "positive",
        icon: "edit-02",
        title: t("activeList.duplicateTemplateModal.onSuccess.title", {
          emailTemplateTitle: emailTemplateDetail?.title,
        }),
        buttonLabel: t("activeList.duplicateTemplateModal.onSuccess.action"),
        onButtonClick: () => {
          navigateToTemplateDetails(duplicatedTemplate.id);
        },
      });
      onClose();
    },
    onFailure: () => {
      onFailure?.();
      onClose();
      toast({
        status: "critical",
        icon: "x-close",
        title: t("activeList.duplicateTemplateModal.onFailure.title"),
      });
    },
  });

  const handleDuplicateTemplate = () => {
    if (emailTemplateDetail) {
      duplicateTemplate({
        title: `${emailTemplateDetail.title} - Copy`,
        subject: emailTemplateDetail.subject,
        html: emailTemplateDetail.html,
        design: emailTemplateDetail.design,
        category: emailTemplateDetail.category,
        company_id: emailTemplateDetail.company_id,
        available_for_companies: emailTemplateDetail.available_for_companies,
        date_modified: getLocalISOStringWithOffset(new Date()),
      });
    }
  };

  useEffect(() => {
    fetchEmailTemplateDetail(templateId);
  }, [fetchEmailTemplateDetail, templateId]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("activeList.duplicateTemplateModal.title")}
      confirmLabel={t("activeList.duplicateTemplateModal.confirmButton")}
      confirmColor="main"
      onConfirmClick={handleDuplicateTemplate}
      cancelLabel={t("activeList.duplicateTemplateModal.cancelButton")}
      size="md"
    >
      {isLoading || !emailTemplateDetail ? (
        <AppLoader />
      ) : (
        <div className="flex flex-col gap-y-sm">
          <Body htmlVariant="p" size="lg" color="default" weight="weak">
            <Trans
              i18nKey={
                "activeList.duplicateTemplateModal.description.firstStep"
              }
              values={{ emailTemplateTitle: emailTemplateDetail?.title }}
              components={{
                b: <b></b>,
              }}
            />
          </Body>
          <Body htmlVariant="p" size="lg" color="default" weight="weak">
            {t("activeList.duplicateTemplateModal.description.secondStep")}
          </Body>
        </div>
      )}
    </Modal>
  );
};
