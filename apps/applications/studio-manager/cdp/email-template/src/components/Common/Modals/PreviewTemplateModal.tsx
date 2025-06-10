import { useEffect } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { AppLoader } from "#src/components/Common/AppLoader";
import { HTMLPreview } from "#src/components/Common/HTMLPreview";
import { useFetchTemplateDetail } from "#src/hooks/fetch/useFetchTemplateDetails";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  templateId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const PreviewTemplateModal: React.FC<Props> = ({
  templateId,
  isOpen,
  onClose,
}: Props) => {
  const { emailTemplateDetail, isLoading, fetchEmailTemplateDetail } =
    useFetchTemplateDetail({ emailTemplateId: templateId });
  const { navigateToTemplateDetails } = useTemplateNavigation();

  const { t } = useTranslation("list");
  const handleNavigateTemplate = () => {
    navigateToTemplateDetails(templateId);
  };

  useEffect(() => {
    fetchEmailTemplateDetail(templateId);
  }, [fetchEmailTemplateDetail, templateId]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={emailTemplateDetail?.title}
      confirmLabel={t("activeList.previewEmailTemplateModal.confirmButton")}
      confirmColor="main"
      onConfirmClick={handleNavigateTemplate}
      cancelLabel={t("activeList.previewEmailTemplateModal.cancelButton")}
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
