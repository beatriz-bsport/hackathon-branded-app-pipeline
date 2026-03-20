import { useState } from "react";

import { Body, Modal, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type {
  EmailDesignContent,
  EmailDesignEditorAction,
} from "./email-design-editor-types";

export const EmailDesignEditorActionsModal = ({
  open,
  actions,
  content,
  onClose,
}: {
  open: boolean;
  actions: EmailDesignEditorAction[];
  content: EmailDesignContent;
  onClose: () => void;
}) => {
  const { t } = useTranslation("campaign");
  const [selectedActionId, setSelectedActionId] = useState<string>(
    actions[0]?.id ?? "",
  );

  const actionById = new Map(actions.map((action) => [action.id, action]));

  const options = actions.map((action) => ({
    label: action.label,
    helperText: action.helperText,
    value: action.id,
  }));

  const handleSave = async () => {
    const selected = actionById.get(selectedActionId);
    if (!selected) return;

    await selected.run({
      content,
      context: {
        close: onClose,
      },
    });
  };

  return (
    <Modal
      open={open}
      size="md"
      title={t("email.creation.form.emailTemplateEditor.saveActionModal.title")}
      confirmButton={{
        label: t(
          "email.creation.form.emailTemplateEditor.saveActionModal.confirmButtonLabel",
        ),
        onClick: handleSave,
      }}
      onClose={onClose}
    >
      <div className="flex flex-col gap-xs">
        <Body htmlVariant="p" size="md" weight="weak">
          {t(
            "email.creation.form.emailTemplateEditor.saveActionModal.description",
          )}
        </Body>
        <RadioGroup
          id="email-design-editor-action"
          options={options}
          value={selectedActionId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedActionId(event.target.value);
          }}
        />
      </div>
    </Modal>
  );
};
