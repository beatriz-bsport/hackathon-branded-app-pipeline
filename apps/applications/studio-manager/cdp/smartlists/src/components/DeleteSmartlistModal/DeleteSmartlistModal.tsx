import { useState } from "react";

import { Body, Modal } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { Trans, useTranslation } from "#src/utils/i18n";

import { CadencesModal } from "./CadencesModal";
import { useDelete } from "./use-delete";

type DeleteSmartlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  smartlist: Smartlist;
};

export const DeleteSmartlistModal: React.FC<DeleteSmartlistModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  smartlist,
}: DeleteSmartlistModalProps) => {
  const { t } = useTranslation("list");
  const [currentCadences, setCurrentCadences] = useState<number[]>([]);

  const { deleteSmartlist } = useDelete({
    onSuccess: () => {
      onDelete?.();
      onClose();
    },
    onFailure: () => {
      onClose();
    },
    onCadencesFound: (cadences) => {
      setCurrentCadences(cadences);
    },
  });

  const handleDelete = () => {
    deleteSmartlist({ id: smartlist.id });
  };

  if (currentCadences.length > 0) {
    return (
      <CadencesModal isOpen cadenceIds={currentCadences} onClose={onClose} />
    );
  }

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
      }}
      cancelButton={{
        label: t("deleteModal.buttons.cancel"),
        onClick: onClose,
      }}
      title={t("deleteModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <div className="flex flex-col gap-xl">
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          <Trans
            i18nKey={"deleteModal.description"}
            values={{ name: smartlist.name }}
            components={{
              b: <b></b>,
            }}
          />
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("deleteModal.warning")}
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("deleteModal.audienceWarning")}
        </Body>
      </div>
    </Modal>
  );
};
