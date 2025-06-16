import { useEffect } from "react";

import { Body, Modal, toast } from "@bsport/kaizen-primitive-core";
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from "@bsport/store-cdp-email-template";

import { AppLoader } from "#src/components/Common/AppLoader";
import { HTMLPreview } from "#src/components/Common/HTMLPreview";
import { useDuplicateTemplate } from "#src/hooks/api/use-duplicate-template";
import { useFetchTemplateDetail } from "#src/hooks/fetch/useFetchTemplateDetails";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";
import { getEmailTemplateType } from "#src/utils/templates";
import { getLocalISOStringWithOffset } from "#src/utils/time";

type Props = {
  templateSummary: EmailTemplateSummary;
  isOpen: boolean;
  onClose: () => void;
  onDuplicateSuccess?: () => void;
  onDuplicateFailure?: () => void;
};

export const PreviewTemplateModal: React.FC<Props> = ({
  templateSummary,
  isOpen,
  onClose,
  onDuplicateSuccess,
  onDuplicateFailure,
}: Props) => {
  const templateType = getEmailTemplateType({
    emailTemplate: templateSummary,
  });
  const { emailTemplateDetail, isLoading, fetchEmailTemplateDetail } =
    useFetchTemplateDetail({ emailTemplateId: templateSummary.id });
  const { navigateToTemplateDetails } = useTemplateNavigation();
  const { t } = useTranslation("list");

  const { duplicateTemplate } = useDuplicateTemplate({
    onSuccess: (duplicatedTemplate: EmailTemplateDetail) => {
      onDuplicateSuccess?.();
      toast({
        status: "default",
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
      onDuplicateFailure?.();
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
        title: t("activeList.duplicateTemplateModal.duplicateEmailTitle", {
          emailTemplateTitle: emailTemplateDetail.title,
        }),
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

  const handleOnConfirm = () => {
    if (templateType === "custom") {
      navigateToTemplateDetails(templateSummary.id);
    } else if (templateType === "bsport") {
      handleDuplicateTemplate();
    }
  };

  const confirmButtonText =
    templateType === "custom"
      ? t("activeList.previewEmailTemplateModal.confirmButton")
      : templateType === "bsport"
        ? t("activeList.duplicateTemplateModal.confirmButton")
        : null;

  const cancelButtonText =
    templateType !== "master"
      ? t("activeList.previewEmailTemplateModal.cancelButton")
      : null;

  useEffect(() => {
    fetchEmailTemplateDetail();
  }, [fetchEmailTemplateDetail, templateSummary.id]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={emailTemplateDetail?.title}
      confirmButton={
        confirmButtonText
          ? {
              label: confirmButtonText,
              onClick: handleOnConfirm,
            }
          : undefined
      }
      cancelButton={
        cancelButtonText
          ? {
              label: cancelButtonText,
              onClick: onClose,
            }
          : undefined
      }
      size="md"
    >
      {isLoading || !emailTemplateDetail ? (
        <AppLoader />
      ) : (
        <Body
          htmlVariant="p"
          size="lg"
          color="default"
          weight="weak"
          className="flex flex-col gap-md"
        >
          <HTMLPreview htmlContent={emailTemplateDetail.html} />
        </Body>
      )}
    </Modal>
  );
};
