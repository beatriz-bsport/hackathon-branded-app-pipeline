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
  const [showCadencesModal, setShowCadencesModal] = useState(false);

  const { deleteSmartlist, isDeleting } = useDelete({
    onSuccess: () => {
      onDelete?.();
      onClose();
    },
    onFailure: () => {
      onClose();
    },
    onCadencesError: () => {
      setShowCadencesModal(true);
    },
  });

  const handleDelete = () => {
    deleteSmartlist({ id: smartlist.id });
  };

  if (showCadencesModal) {
    return (
      <CadencesModal
        isOpen
        smartlistId={smartlist.id}
        onClose={() => {
          setShowCadencesModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("deleteModal.buttons.delete"),
        color: "critical",
        onClick: handleDelete,
        disabled: isDeleting,
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
          <Trans
            i18nKey={"deleteModal.warning"}
            values={{ name: smartlist.name }}
            components={{
              b: <b></b>,
            }}
          />
        </Body>
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("deleteModal.audienceWarning")}
        </Body>
      </div>
    </Modal>
  );
};
