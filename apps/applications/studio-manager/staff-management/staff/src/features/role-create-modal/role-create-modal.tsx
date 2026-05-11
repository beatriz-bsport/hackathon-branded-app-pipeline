import type { FC } from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type RoleCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RoleCreateModal: FC<RoleCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("role-form");

  const steps = [
    {
      label: t("steps.roleSetup.label"),
      content: <div>{t("steps.roleSetup.placeholder")}</div>,
    },
    {
      label: t("steps.navigationPermissions.label"),
      content: <div>{t("steps.navigationPermissions.placeholder")}</div>,
    },
    {
      label: t("steps.featurePermissions.label"),
      content: <div>{t("steps.featurePermissions.placeholder")}</div>,
    },
  ];

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={t("title")}
      steps={steps}
      onClose={onClose}
      onClickOutside={onClose}
      confirmButton={{
        label: t("buttons.confirm"),
        onClick: () => undefined,
      }}
      cancelButton={{
        label: t("buttons.cancel"),
        onClick: onClose,
      }}
    />
  );
};
