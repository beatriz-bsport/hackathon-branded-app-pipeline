import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type TagRuleLimitReachedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const TagRuleLimitReachedModal = ({
  isOpen,
  onClose,
}: TagRuleLimitReachedModalProps) => {
  const { t } = useTranslation("details");

  return (
    <>
      <Modal
        open={isOpen}
        size="md"
        title={t("automation.tagRules.limitReachedModal.title", {
          ns: "details",
        })}
        onClose={onClose}
      >
        <div className="flex flex-col gap-xs">
          <Body htmlVariant="p" weight="weak">
            {t("automation.tagRules.limitReachedModal.description")}
          </Body>
          <Body htmlVariant="p" size="sm" weight="weak" color="weak">
            {t("automation.tagRules.limitReachedModal.disclaimer")}
          </Body>
        </div>
      </Modal>
    </>
  );
};
