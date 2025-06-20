import React, {
  type ChangeEvent,
  type ComponentProps,
  useEffect,
  useId,
  useState,
} from "react";

import { Body, Checkbox, Modal, TextArea } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type FeedbackReason =
  | "slower"
  | "missingFeatures"
  | "hardToNavigate"
  | "dontLike"
  | "other";

type CheckboxValue = ComponentProps<typeof Checkbox>["value"];
type FeedbackReasonState = Record<FeedbackReason, CheckboxValue>;

const DEFAULT_SELECTED_REASONS: FeedbackReasonState = {
  slower: "unchecked",
  missingFeatures: "unchecked",
  hardToNavigate: "unchecked",
  dontLike: "unchecked",
  other: "unchecked",
};

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation("feedbackDialog");
  const baseId = useId();

  const [selectedReasons, setSelectedReasons] = useState<FeedbackReasonState>(
    DEFAULT_SELECTED_REASONS,
  );
  const handleReasonToggle = (reason: FeedbackReason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [reason]: prev[reason] === "checked" ? "unchecked" : "checked",
    }));
  };

  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalFeedback(event.target.value);
  };

  const handleConfirm = () => {
    // TODO: Handle feedback submission
    const selectedReasonsArray = Object.entries(selectedReasons)
      .filter(([, value]) => value === "checked")
      .map(([reason]) => reason as FeedbackReason);

    console.log("Feedback submitted:", {
      selectedReasons: selectedReasonsArray,
      additionalFeedback,
    });
    onClose();
    // TODO: navigate to the old UI
  };

  useEffect(() => {
    if (!open) {
      setSelectedReasons(DEFAULT_SELECTED_REASONS);
      setAdditionalFeedback("");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      size="md"
      title={t("title")}
      confirmButton={{
        label: t("confirm"),
        color: "critical",
        onClick: handleConfirm,
      }}
      cancelButton={{
        label: t("cancel"),
        onClick: onClose,
      }}
      onClose={onClose}
    >
      <div className="p-sm flex flex-col gap-xs">
        <div className="flex flex-col gap-md">
          <Body htmlVariant="p" size="md">
            {t("description")}
          </Body>

          <Body htmlVariant="p" size="md">
            {t("mainQuestion")}
          </Body>
        </div>

        <div className="flex flex-col gap-xs">
          {(Object.keys(DEFAULT_SELECTED_REASONS) as FeedbackReason[]).map(
            (reason) => (
              <Checkbox
                key={reason}
                id={`${baseId}-${reason}-checkbox`}
                value={selectedReasons[reason]}
                label={t(`reasons.${reason}`)}
                onChange={() => handleReasonToggle(reason)}
              />
            ),
          )}
        </div>

        <div className="flex flex-col gap-2xs">
          <Body htmlVariant="p" size="md">
            {t("additionalFeedbackQuestion")}
          </Body>
          <TextArea
            id={`${baseId}-additional-feedback`}
            status="default"
            value={additionalFeedback}
            onChange={handleTextAreaChange}
            placeholder={t("additionalFeedbackPlaceholder")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackDialog;

export const useFeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return { open, openDialog, closeDialog } as const;
};
