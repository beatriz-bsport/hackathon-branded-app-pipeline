import React, { useMemo } from "react";

import {
  Body,
  Button,
  Loader,
  Modal,
  toast,
} from "@bsport/kaizen-primitive-core";
import {
  generateTemporaryPasswordAction,
  selectTemporaryPassword,
  useAuthStore,
} from "@bsport/store-auth";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type TemporaryPasswordDialogProps = {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const generateTemporaryPassword = generateTemporaryPasswordAction.bind(
  null,
  fetch,
);

export const TemporaryPasswordDialog: React.FC<
  TemporaryPasswordDialogProps
> = ({ isLoading, isOpen, onClose }) => {
  const { t } = useTranslation("features");

  const temporaryPassword = useAuthStore(selectTemporaryPassword);

  const confirmButton = temporaryPassword
    ? {
        label: t("temporaryPassword.buttons.close"),
        onClick: onClose,
      }
    : {
        label: t("temporaryPassword.buttons.generate"),
        onClick: () => generateTemporaryPassword(),
      };
  const cancelButton = temporaryPassword
    ? {
        label: t("temporaryPassword.buttons.close"),
        onClick: onClose,
      }
    : {
        label: t("temporaryPassword.buttons.close"),
        onClick: onClose,
      };

  const modalContent = useMemo(() => {
    if (!temporaryPassword)
      return <Body htmlVariant="p">{t("temporaryPassword.description")}</Body>;

    const copyPasswordToClipboard = () =>
      navigator.clipboard
        .writeText(temporaryPassword?.password ?? "")
        .then(() => {
          toast({
            status: "default",
            icon: "copy-07",
            title: t("temporaryPassword.generatedPassword.copiedToClipboard"),
            buttonIcon: "x-close",
          });
        }, console.error);

    return (
      <>
        <Body htmlVariant="p" weight="strong">
          {temporaryPassword?.password}
        </Body>
        <Button
          color="default"
          intent="flat"
          size="sm"
          iconLeft="copy-07"
          label={t("temporaryPassword.generatedPassword.copyToClipboard")}
          onClick={copyPasswordToClipboard}
          className="mt-xs mb-sm"
        />
        <Body htmlVariant="p" color="weak">
          {t("temporaryPassword.generatedPassword.validity", {
            expirationDate: temporaryPassword?.expirationDate,
          })}
        </Body>
      </>
    );
  }, [temporaryPassword, t]);

  return (
    <Modal
      title={t("temporaryPassword.title")}
      open={isOpen}
      onClose={onClose}
      size="md"
      confirmButton={confirmButton}
      cancelButton={cancelButton}
    >
      {isLoading ? (
        <div className="flex w-full flex-row justify-center">
          <Loader size="md" />
        </div>
      ) : (
        modalContent
      )}
    </Modal>
  );
};
