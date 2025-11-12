import { useState } from "react";

import {
  Alert,
  Body,
  Checkbox,
  Modal,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { Tag, TagUsage } from "@bsport/store-cdp-tag";

import { useDeleteTag } from "#src/hooks/api/use-delete-tag";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tagToDelete: Tag;
  tagUsage: TagUsage;
} & ModalProps;

type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const DeleteTagModal: React.FC<Props> = ({
  isOpen,
  tagToDelete,
  tagUsage,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const [acceptWarning, setAcceptWarning] = useState(false);
  const { t } = useTranslation("tags");

  // @debt (1, 1, 1): Do not reproduce this pattern please, this is a temporary solution
  // Normally the backend should check is the tags are deletable or not, this is completely a fallback solution
  // Just to notify users and prevent them to accidentally delete tags that are in use and that are
  // applied to members
  // Tech debt ticket : https://linear.app/bsport/issue/CDP-697/tag-no-check-to-prevent-user-to-delete-a-tag-that-is-in-use
  const isTagUsedInMembers = tagUsage?.member_count > 0;

  const { deleteTag } = useDeleteTag({
    onFailure: () => {
      onFailure?.();
      toast({
        title: t("deleteSubTagModal.result.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onClose();
    },
    onSuccess: () => {
      toast({
        title: t("deleteSubTagModal.result.success.title"),
        status: "default",
        icon: "trash-01",
        buttonIcon: "x-close",
      });
      onSuccess?.();
      onClose();
    },
  });

  const handleDelete = () => {
    if (isTagUsedInMembers && !acceptWarning) {
      return;
    }
    deleteTag({ id: tagToDelete.id });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("deleteSubTagModal.title")}
      confirmButton={{
        color: "critical",
        onClick: handleDelete,
        label: t("deleteSubTagModal.actions.confirm"),
        disabled: isTagUsedInMembers && !acceptWarning,
      }}
      cancelButton={{
        label: t("deleteSubTagModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-sm">
        <Body htmlVariant="p">
          {t("deleteSubTagModal.description", {
            number: tagUsage.member_count,
          })}
        </Body>
        {isTagUsedInMembers ? (
          <div className="flex flex-col gap-sm">
            <Alert status="critical">
              {t("deleteSubTagModal.alerts.tagInUse.description")}
            </Alert>
            <div>
              <Body size="md" htmlVariant="p">
                {t("deleteSubTagModal.alerts.tagInUse.confirmCheckbox.label")}
              </Body>
              <Checkbox
                id="accept-deletion-warning"
                label={t(
                  "deleteSubTagModal.alerts.tagInUse.confirmCheckbox.description",
                  { number: tagUsage.member_count },
                )}
                value={acceptWarning ? "checked" : "unchecked"}
                onChange={(checked) => setAcceptWarning(checked)}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
