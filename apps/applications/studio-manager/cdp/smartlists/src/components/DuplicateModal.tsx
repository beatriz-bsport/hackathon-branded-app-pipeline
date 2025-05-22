import React from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { Trans, useTranslation } from "#src/utils/i18n";

type DuplicateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  smartlist: Smartlist;
};

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  onClose,
  onDuplicate,
  smartlist,
}: DuplicateModalProps) => {
  const { t } = useTranslation("list");

  return (
    <Modal
      open={isOpen}
      onConfirmClick={onDuplicate}
      onCancelClick={onClose}
      confirmColor="main"
      confirmLabel={t("duplicateModal.buttons.duplicate")}
      cancelLabel={t("duplicateModal.buttons.cancel")}
      title={t("duplicateModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <div className="flex flex-col gap-xl">
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          <Trans
            i18nKey={"duplicateModal.description"}
            values={{ name: smartlist.name }}
            components={{
              b: <b></b>,
            }}
          />
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("duplicateModal.editAfter")}
        </Body>
      </div>
    </Modal>
  );
};
