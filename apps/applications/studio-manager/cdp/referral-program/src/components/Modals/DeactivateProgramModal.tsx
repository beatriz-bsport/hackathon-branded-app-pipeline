import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  isOpen: boolean;
  toggleReferralProgram: ({
    is_referral_program_activated,
  }: {
    is_referral_program_activated: boolean;
  }) => void;
  onClose: () => void;
};

export const DeactivateReferralProgramModal: React.FC<Props> = ({
  isOpen,
  toggleReferralProgram,
  onClose,
}: Props) => {
  const { t } = useTranslation("settings");

  const handleDeactivate = () => {
    toggleReferralProgram({
      is_referral_program_activated: false,
    });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t("active.deactivateReferralModal.title")}
      confirmButton={{
        label: t("active.deactivateReferralModal.confirmButton.label"),
        color: "critical",
        onClick: handleDeactivate,
      }}
      cancelButton={{
        label: t("active.deactivateReferralModal.cancelButton.label"),
        onClick: onClose,
      }}
      size="md"
    >
      <Body htmlVariant="p" size="lg" color="default" weight="weak">
        {t("active.deactivateReferralModal.description")}
      </Body>
    </Modal>
  );
};
