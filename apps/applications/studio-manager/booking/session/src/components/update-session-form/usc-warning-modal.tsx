import { FC } from "react";
import { useNavigate } from "react-router";

import { SessionWithActivity } from "@bsport/api-book";
import { Alert, Body, Modal } from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { TFunction, Trans, useTranslation } from "#src/utils/i18n";

type USCWarningModalProps = {
  session: SessionWithActivity;
  isOpen: boolean;
  onClose: () => void;
};

export const USCWarningModal: FC<USCWarningModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("sessionEdit");

  const navigate = useNavigate();
  const { getIndexUrl } = useUrls();

  const onCancel = () => {
    navigate(getIndexUrl());
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("USCWarningModal.title")}
      onClose={onClose}
      confirmButton={{
        label: t("USCWarningModal.confirmButton"),
        color: "main",
        onClick: onClose,
      }}
      cancelButton={{
        label: t("USCWarningModal.cancelButton"),
        onClick: onCancel,
      }}
    >
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md" weight="weak">
          {t("USCWarningModal.description")}
        </Body>
        <Alert status="critical">
          <Trans
            t={t as TFunction}
            i18nKey="USCWarningModal.alert"
            ns="sessionEdit"
            count={session.nb_bookings}
            components={{
              strong: <strong />,
            }}
          />
        </Alert>
      </div>
    </Modal>
  );
};
