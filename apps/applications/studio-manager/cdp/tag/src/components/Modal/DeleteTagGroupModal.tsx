import { useMemo, useState } from "react";

import {
  Alert,
  Body,
  Checkbox,
  Modal,
  type TooltipProps,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { Tag, TagGroup, TagUsage } from "@bsport/store-cdp-tag";

import { useDeleteTagGroup } from "#src/hooks/api/use-delete-tag-group";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tagGroupToDelete: TagGroup;
  tagsMap: Record<number, Tag>;
  tagUsagesMap: Record<number, TagUsage>;
} & ModalProps;

type ModalProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const DeleteTagGroupModal: React.FC<Props> = ({
  isOpen,
  tagGroupToDelete,
  tagsMap,
  tagUsagesMap,
  onClose,
  onSuccess,
  onFailure,
}: Props) => {
  const [acceptWarning, setAcceptWarning] = useState(false);
  const { t } = useTranslation("tags");

  const confirmButtonTooltipProps: TooltipProps = {
    label: t(
      "deleteMainTagModal.alerts.tagInUse.confirmCheckbox.confirmButtonTooltip",
    ),
    placement: "bottom-left",
  };

  const usedTags = useMemo(
    () => tagGroupToDelete.tags.map((tagId) => tagsMap[tagId]).filter(Boolean),
    [tagsMap, tagGroupToDelete.tags],
  );

  // @debt (1, 1, 1): Do not reproduce this pattern please, this is a temporary solution
  // Normally the backend should check is the tags are deletable or not, this is completely a fallback solution
  // Just to notify users and prevent them to accidentally delete tags that are in use and that are
  // applied to members
  // Tech debt ticket : https://linear.app/bsport/issue/CDP-697/tag-no-check-to-prevent-user-to-delete-a-tag-that-is-in-use
  const impactedUsersNumber = useMemo(
    () =>
      usedTags.reduce((total, tag) => {
        const memberCount = tagUsagesMap[tag.id]?.member_count || 0;
        return total + memberCount;
      }, 0),
    [usedTags, tagUsagesMap],
  );

  const isTagGroupUsedInMembers = impactedUsersNumber > 0;

  const { deleteTagGroup } = useDeleteTagGroup({
    onFailure: () => {
      toast({
        title: t("deleteMainTagModal.result.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onFailure?.();
      onClose();
    },
    onSuccess: () => {
      toast({
        title: t("deleteMainTagModal.result.success.title"),
        status: "default",
        icon: "trash-01",
        buttonIcon: "x-close",
      });
      onSuccess?.();
      onClose();
    },
  });

  const handleDelete = () => {
    if (isTagGroupUsedInMembers && !acceptWarning) {
      return;
    }
    deleteTagGroup({ id: tagGroupToDelete.id });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("deleteMainTagModal.title")}
      confirmButton={{
        color: "critical",
        onClick: handleDelete,
        label: t("deleteMainTagModal.actions.confirm"),
        disabled: isTagGroupUsedInMembers && !acceptWarning,
        tooltipProps: isTagGroupUsedInMembers
          ? confirmButtonTooltipProps
          : undefined,
      }}
      cancelButton={{
        label: t("deleteMainTagModal.actions.cancel"),
        onClick: onClose,
      }}
      size="md"
    >
      <div className="flex flex-col gap-sm">
        <Body htmlVariant="p">
          {t("deleteMainTagModal.description", {
            number: impactedUsersNumber,
          })}
        </Body>
        {isTagGroupUsedInMembers ? (
          <div className="flex flex-col gap-sm">
            <Alert status="critical">
              {t("deleteMainTagModal.alerts.tagInUse.description")}
            </Alert>
            <div>
              <Body size="md" htmlVariant="p">
                {t("deleteMainTagModal.alerts.tagInUse.confirmCheckbox.label")}
              </Body>
              <Checkbox
                id="accept-deletion-warning"
                label={t(
                  "deleteMainTagModal.alerts.tagInUse.confirmCheckbox.description",
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
