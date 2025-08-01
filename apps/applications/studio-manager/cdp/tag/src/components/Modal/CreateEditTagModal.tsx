import { useMemo } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal, toast } from "@bsport/kaizen-primitive-core";
import type { Tag, TagGroup } from "@bsport/store-cdp-tag";

import { CreateEditTagForm } from "#src/components/Form/CreateEditTagForm";
import { useCreateTag } from "#src/hooks/api/use-create-tag";
import { useUpdateTag } from "#src/hooks/api/use-update-tag";
import {
  TAG_LIST_ITEM_ID,
  TAG_NAME_ALREADY_EXIST_ERROR_CODE,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { createEditTagSchema } from "#src/utils/schemas/create-edit-tag.schema";
import type { CreateEditTagData } from "#src/utils/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tagDraft: Tag | null;
  tagGroupList: TagGroup[];
  preselectedTagGroupId: number | null;
} & ModalProps;

type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const CreateEditTagModal: React.FC<Props> = ({
  isOpen,
  tagDraft,
  tagGroupList,
  preselectedTagGroupId,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const formId = tagDraft ? "edit-tag-form" : "create-tag-form";
  const { t } = useTranslation("tags");

  const methods = useFormController({
    mode: "onBlur",
    schema: createEditTagSchema,
    defaultValues: {
      tagName: tagDraft?.name ?? "",
      tagGroup: tagDraft?.group ?? preselectedTagGroupId ?? 0,
      color: tagDraft?.color ?? "#FFFFFF",
    },
  });

  const tagGroupOptions = tagGroupList.map((tagGroup) => ({
    id: `tag-group-option-${tagGroup.id}`,
    label: tagGroup.name,
  }));

  const tagGroupMapByName: Record<string, number> = useMemo(
    () =>
      tagGroupList.reduce(
        (acc, tagGroup) => ({
          ...acc,
          [tagGroup.name]: tagGroup.id,
        }),
        {},
      ),
    [tagGroupList],
  );

  const handleFailure = (error: Error) => {
    if (error.name === TAG_NAME_ALREADY_EXIST_ERROR_CODE) {
      methods.setError("tagName", {
        type: "manual",
        message: t("tagModal.formField.tagName.errors.alreadyInUse"),
      });
    } else {
      toast({
        title: tagDraft
          ? t("tagModal.result.updateFailure.title")
          : t("tagModal.result.createFailure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onFailure?.();
      onClose();
    }
  };

  const { createTag } = useCreateTag({
    onFailure: handleFailure,
    onSuccess: (createdTag: Tag) => {
      toast({
        title: t("tagModal.result.createSuccess.title"),
        status: "default",
        icon: "save",
        buttonLabel: t("tagModal.actions.goTo"),
        onButtonClick: () => {
          const tagListId = TAG_LIST_ITEM_ID(createdTag.id);
          const tagElement = document.getElementById(tagListId);
          if (tagElement) {
            tagElement.scrollIntoView({
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
  const { updateTag } = useUpdateTag({
    onFailure: handleFailure,
    onSuccess: () => {
      onSuccess?.();
      toast({
        title: t("tagModal.result.updateSuccess.title"),
        status: "default",
        icon: "save",
        buttonIcon: "x-close",
      });
      onClose();
    },
  });

  const handleSubmit = (data: CreateEditTagData) => {
    if (tagDraft) {
      updateTag({
        ...tagDraft,
        name: data.tagName,
        group: data.tagGroup,
        color: data.color,
      });
    } else {
      createTag({
        name: data.tagName,
        group: data.tagGroup,
        color: data.color,
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={tagDraft ? t("tagModal.title.update") : t("tagModal.title.create")}
      confirmButton={{
        form: formId,
        type: "submit",
        label: tagDraft
          ? t("tagModal.actions.update")
          : t("tagModal.actions.create"),
      }}
      cancelButton={{
        label: t("tagModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <CreateEditTagForm
          isEdition={!tagDraft}
          tagGroupMapByName={tagGroupMapByName}
          tagGroupOptions={tagGroupOptions}
          {...methods}
        />
      </ControlledForm>
    </Modal>
  );
};
