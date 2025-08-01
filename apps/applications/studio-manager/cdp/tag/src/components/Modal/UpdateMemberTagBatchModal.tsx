import { Body, Loader, Modal, toast } from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";

import { useBatchUpdateMemberTag } from "#src/hooks/api/use-batch-update-member-tag";
import { useTranslation } from "#src/utils/i18n";

type UpdateMemberTagBatchModalProps = {
  isOpen: boolean;
  mode: "batch-tag-member" | "batch-untag-member";
  tag: Tag;
  totalImpactedMembers: number;
  onClose: () => void;
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const UpdateMemberTagBatchModal: React.FC<
  UpdateMemberTagBatchModalProps
> = ({
  isOpen,
  onClose,
  mode,
  tag,
  totalImpactedMembers,
  onSuccess,
  onFailure,
}: UpdateMemberTagBatchModalProps) => {
  const { t } = useTranslation("tags");

  const { tagAllMember, untagAllMember, isLoading } = useBatchUpdateMemberTag({
    onTagSuccess: () => {
      onSuccess?.();
      toast({
        title: t("updateMemberTagBatchModal.results.tag.success.title"),
        status: "default",
        icon: "user-plus-01",
        buttonIcon: "x-close",
      });

      onClose();
    },
    onTagFailure: () => {
      toast({
        title: t("updateMemberTagBatchModal.results.tag.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onFailure?.();
      onClose();
    },
    onUntagSuccess: () => {
      onSuccess?.();
      toast({
        title: t("updateMemberTagBatchModal.results.untag.success.title"),
        status: "default",
        icon: "user-minus-01",
        buttonIcon: "x-close",
      });
      onClose();
    },
    onUntagFailure: () => {
      onFailure?.();
      toast({
        title: t("updateMemberTagBatchModal.results.untag.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
      onClose();
    },
  });

  const translations =
    mode === "batch-tag-member"
      ? {
          title: t("updateMemberTagBatchModal.title.tag"),
          confirmButtonLabel: t("updateMemberTagBatchModal.actions.tag"),
          cancelButtonLabel: t("updateMemberTagBatchModal.actions.cancel"),
          loadingState: t("updateMemberTagBatchModal.loading.tag", {
            number: totalImpactedMembers,
          }),
          description: t("updateMemberTagBatchModal.description.tag", {
            tagName: tag.name,
            number: totalImpactedMembers,
          }),
        }
      : {
          title: t("updateMemberTagBatchModal.title.untag"),
          confirmButtonLabel: t("updateMemberTagBatchModal.actions.untag"),
          cancelButtonLabel: t("updateMemberTagBatchModal.actions.cancel"),
          loadingState: t("updateMemberTagBatchModal.loading.untag", {
            number: totalImpactedMembers,
          }),
          description: t("updateMemberTagBatchModal.description.untag", {
            tagName: tag.name,
            number: totalImpactedMembers,
          }),
        };

  const handleUpdateTagBatch = () => {
    if (mode === "batch-tag-member") {
      tagAllMember({ tagId: tag.id });
    } else {
      untagAllMember({ tagId: tag.id });
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translations.title}
      confirmButton={{
        color: mode === "batch-tag-member" ? "main" : "critical",
        disabled: isLoading,
        onClick: handleUpdateTagBatch,
        label: translations.confirmButtonLabel,
      }}
      cancelButton={{
        label: translations.cancelButtonLabel,
        onClick: onClose,
      }}
      size="md"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-sm">
          <Loader size="md" />
          <Body htmlVariant="p">{translations.loadingState}</Body>
        </div>
      ) : (
        <Body htmlVariant="p">{translations.description}</Body>
      )}
    </Modal>
  );
};
