import React from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { Trans, useTranslation } from "#src/utils/i18n";

import { useDuplicate } from "./use-duplicate";

type DuplicateSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  smartlist: Smartlist;
  onDuplicate?: () => void;
};

export const DuplicateSmartlistModal: React.FC<
  DuplicateSmartlistModalProps
> = ({
  isOpen,
  onClose,
  onDuplicate,
  smartlist,
}: DuplicateSmartlistModalProps) => {
  const { t } = useTranslation("list");

  const { duplicateSmartlist } = useDuplicate({
    onSuccess: () => {
      onDuplicate?.();
      onClose();
    },
    onFailure: () => {
      onClose();
    },
  });

  const handleDuplicate = () => {
    duplicateSmartlist({ id: smartlist.id });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("duplicateModal.buttons.duplicate"),
        onClick: handleDuplicate,
      }}
      cancelButton={{
        label: t("duplicateModal.buttons.cancel"),
        onClick: onClose,
      }}
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
      </div>
    </Modal>
  );
};
