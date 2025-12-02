import { FC, HTMLAttributes, useState } from "react";

import Modal from "#src/components/Modal";
import TextArea from "#src/components/TextArea";
import { toast } from "#src/components/Toast";
import { useTranslation } from "#src/i18n";

export type CrashReportModalProps = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: ({ feedbackContent }: { feedbackContent: string }) => void;
};

/**
 * Internal component used to display a crash report form when the frontend is crashing unexpectedly and the user wants to fill in a report to let us know.
 * @param props.isOpen boolean indicating if the modal is open.
 * @param props.onClose Controller to close the modal.
 * @param props.onConfirm Optional. Function to trigger when the user confirms them feedback.
 * @link  https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-crashreportmodal--docs
 */
const CrashReportModal: FC<CrashReportModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}: CrashReportModalProps) => {
  const { t } = useTranslation("default");
  const [feedbackContent, setFeedbackContent] = useState("");
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onCloseButtonClick={onClose}
      cancelButton={{
        label: t("modal.cancel"),
        onClick: onClose,
      }}
      confirmButton={{
        label: t("crashReportModal.confirmButtonLabel"),
        onClick: () => {
          try {
            onConfirm({ feedbackContent });
            toast({
              icon: "upload-01",
              status: "positive",
              title: t("crashReportModal.toast.success"),
              buttonIcon: "x",
            });
          } catch (error) {
            toast({
              icon: "alert-triangle",
              status: "critical",
              title: t("crashReportModal.toast.failure"),
              buttonIcon: "x",
            });
            console.error("An error occured when sending a Feedback : ", error);
          }
          onClose();
        },
      }}
      size="md"
      title={t("crashReportModal.title")}
    >
      <TextArea
        id="feedback-content"
        value={feedbackContent}
        placeholder={t("crashReportModal.feedbackContentPlaceholder")}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setFeedbackContent(event.target?.value);
        }}
      />
    </Modal>
  );
};

CrashReportModal.displayName = "KaizenCrashReportModal";

export default CrashReportModal;
