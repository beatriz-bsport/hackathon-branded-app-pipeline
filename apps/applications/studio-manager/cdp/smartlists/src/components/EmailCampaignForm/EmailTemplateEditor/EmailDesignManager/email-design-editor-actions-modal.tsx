import { useState } from "react";

import { Alert, Body, Modal, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type SaveAction = "onTheFly" | "createNew" | "overwrite";

export const EmailDesignEditorActionsModal = ({
  open,
  canOverwrite,
  isFranchiseTemplate,
  onOnTheFly,
  onCreateNew,
  onOverwrite,
  onClose,
}: {
  open: boolean;
  /** Whether the template is a franchise template. */
  isFranchiseTemplate: boolean;
  /** Whether the "overwrite existing template" option is available. False when no template is selected. */
  canOverwrite: boolean;
  onOnTheFly: () => void;
  onCreateNew: () => void;
  onOverwrite: () => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation("campaign");
  const [selected, setSelected] = useState<SaveAction>("onTheFly");

  const handleSave = () => {
    if (selected === "onTheFly") {
      onOnTheFly();
    } else if (selected === "createNew") {
      onCreateNew();
    } else if (selected === "overwrite") {
      onOverwrite();
    }
  };

  const options = [
    {
      value: "onTheFly" as SaveAction,
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.onTheFlyTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.onTheFlyTemplate.helperText",
      ),
    },
    {
      value: "createNew" as SaveAction,
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.createNewTemplate.helperText",
      ),
    },
    {
      value: "overwrite" as SaveAction,
      label: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.label",
      ),
      helperText: t(
        "email.creation.form.emailTemplateEditor.saveActionModal.options.overwriteExistingTemplate.helperText",
      ),
      disabled: !canOverwrite,
    },
  ];

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
          value={selected}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelected(event.target.value as SaveAction);
          }}
        />
        {isFranchiseTemplate && (
          <Alert status="default" customIcon="info-circle">
            {t(
              "email.creation.form.emailTemplateEditor.saveActionModal.franchiseTemplateAlert.description",
            )}
          </Alert>
        )}
      </div>
    </Modal>
  );
};
