import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { Modal, TextField, toast } from "@bsport/kaizen-primitive-core";
import { type TagGroup } from "@bsport/store-cdp-tag";

import { useCreateTagGroup } from "#src/hooks/api/use-create-tag-group";
import { useUpdateTagGroup } from "#src/hooks/api/use-update-tag-group";
import {
  BASE_TAG_GROUP_KIND,
  TAG_GROUP_LIST_HEADER_ID,
  TAG_GROUP_NAME_ALREADY_EXIST_ERROR_CODE,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { createEditTagGroupSchema } from "#src/utils/schemas/create-edit-tag-group.schema";
import { CreateEditTagGroupData } from "#src/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tagGroupDraft: TagGroup | null;
} & ModalProps;

type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const CreateEditTagGroupModal: React.FC<Props> = ({
  isOpen,
  tagGroupDraft,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const formId = tagGroupDraft
    ? "edit-tag-group-form"
    : "create-tag-group-form";
  const { t } = useTranslation("tags");

  const methods = useFormController({
    mode: "onBlur",
    schema: createEditTagGroupSchema,
    defaultValues: {
      tagGroupName: tagGroupDraft?.name || "",
    },
  });

  // Translation keys based on mode
  const translations = {
    modal: {
      title: t(`tagGroupModal.title.${tagGroupDraft ? "update" : "add"}`),
      confirmButton: t(
        `tagGroupModal.actions.${tagGroupDraft ? "update" : "add"}`,
      ),
      cancelButton: t("tagGroupModal.actions.cancel"),
    },
    textInput: {
      label: t(`tagGroupModal.formField.tagGroupName.label`),
      placeholder: t(`tagGroupModal.formField.tagGroupName.placeholder`),
      id: `${tagGroupDraft ? "edit" : "create"}-tag-group-name-input`,
    },
    toast: {
      success: {
        title: t("tagGroupModal.result.updateSuccess.title"),
      },
      failure: {
        title: tagGroupDraft
          ? t("tagGroupModal.result.updateFailure.title")
          : t("tagGroupModal.result.createFailure.title"),
      },
    },
  };

  const handleFailure = (error: Error) => {
    if (error.name === TAG_GROUP_NAME_ALREADY_EXIST_ERROR_CODE) {
      methods.setError("tagGroupName", {
        type: "manual",
        message: t("tagGroupModal.formField.tagGroupName.errors.alreadyInUse"),
      });
    } else {
      toast({
        title: translations.toast.failure.title,
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onFailure?.();
      onClose();
    }
  };

  const { createTagGroup } = useCreateTagGroup({
    onFailure: handleFailure,
    onSuccess: (createdTagGroup: TagGroup) => {
      toast({
        title: t("tagGroupModal.result.createSuccess.title"),
        status: "default",
        icon: "save",
        buttonLabel: t("tagGroupModal.actions.goTo"),
        onButtonClick: () => {
          const tagGroupHeaderId = TAG_GROUP_LIST_HEADER_ID(createdTagGroup.id);
          const tagGroupElement = document.getElementById(tagGroupHeaderId);
          if (tagGroupElement) {
            tagGroupElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        },
      });
      onSuccess?.();
      onClose();
    },
  });
  const { updateTagGroup } = useUpdateTagGroup({
    onFailure: handleFailure,
    onSuccess: () => {
      onSuccess?.();
      toast({
        title: translations.toast.success.title,
        status: "default",
        icon: "save",
        buttonIcon: "x-close",
      });
      onClose();
    },
  });

  const handleSubmit = (data: CreateEditTagGroupData) => {
    if (tagGroupDraft) {
      // Update existing tag group
      updateTagGroup({
        ...tagGroupDraft,
        name: data.tagGroupName,
      });
    } else {
      // Create new tag group
      createTagGroup({
        name: data.tagGroupName,
        kind: BASE_TAG_GROUP_KIND,
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translations.modal.title}
      confirmButton={{
        form: formId,
        type: "submit",
        label: translations.modal.confirmButton,
      }}
      cancelButton={{
        label: translations.modal.cancelButton,
        onClick: onClose,
      }}
      size="md"
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <FormField<CreateEditTagGroupData, "tagGroupName">
          name="tagGroupName"
          mapProps={({ defaultProps, form, field }) => ({
            ...defaultProps,
            onClear: () => {
              form.setValue("tagGroupName", "", { shouldDirty: true });
              field.onBlur();
            },
          })}
        >
          <TextField
            fullWidth
            id={translations.textInput.id}
            label={translations.textInput.label}
            placeholder={translations.textInput.placeholder}
            required
          />
        </FormField>
      </ControlledForm>
    </Modal>
  );
};
