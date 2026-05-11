import { Body, Modal } from "@bsport/kaizen-primitive-core";

import type { TagRuleWithTag } from "#src/api/use-tag-rules";
import { useTranslation } from "#src/utils/i18n";

import { useDeleteTagRule } from "./use-delete-tag-rule";

type DeleteTagRuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  smartlistId: string;
  tagRule: TagRuleWithTag;
};

export const DeleteTagRuleModal: React.FC<DeleteTagRuleModalProps> = ({
  isOpen,
  onClose,
  smartlistId,
  tagRule,
}: DeleteTagRuleModalProps) => {
  const { t } = useTranslation("details");

  const { deleteTagRule, isDeleting } = useDeleteTagRule();

  const handleDelete = () => {
    deleteTagRule({ smartlistId, tagRuleId: tagRule.id });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("automation.tagRules.deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isDeleting,
      }}
      cancelButton={{
        label: t("automation.tagRules.deleteModal.buttons.cancel"),
        onClick: onClose,
      }}
      title={t("automation.tagRules.deleteModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <Body htmlVariant="p" size="lg" color="default" weight="weak">
        {t("automation.tagRules.deleteModal.description", {
          tagName: tagRule.tagName,
          tagGroupName: tagRule.tagGroupName,
        })}
      </Body>
    </Modal>
  );
};
