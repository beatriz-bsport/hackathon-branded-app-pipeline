import { useState } from "react";

import { Body, Button, Title } from "@bsport/kaizen-primitive-core";

import { useToggleReferralProgram } from "#src/hooks/actions/useToggleReferralProgram";
import { useTranslation } from "#src/utils/i18n";

import { DeactivateReferralProgramModal } from "../Modals/DeactivateProgramModal";

type Props = {
  isProgramActivated: boolean;
  companyId: number;
  onToggleSuccess: () => void;
};

export const ReferralProgramHelper: React.FC<Props> = ({
  isProgramActivated,
  companyId,
  onToggleSuccess,
}: Props) => {
  const [isDeactivatingProgram, setIsDeactivatingProgram] = useState(false);
  const { toggleReferralProgram } = useToggleReferralProgram({
    isProgramActivated,
    companyId,
    onSuccess: onToggleSuccess,
  });
  const { t } = useTranslation("settings");

  return (
    <>
      <div className="flex flex-row gap-lg justify-between">
        <div className="flex flex-col">
          <Title htmlVariant="h3" weight="strong">
            {t("referralProgramHelper.title")}
          </Title>
          <Body
            className="text-[14px] !text-onsurface-weak"
            htmlVariant="span"
            weight="weak"
          >
            {t("referralProgramHelper.description")}
          </Body>
        </div>
        <Button
          className="h-fit self-center"
          intent={isProgramActivated ? "default" : "call-to-action"}
          size="md"
          color="main"
          label={
            isProgramActivated
              ? t("referralProgramHelper.button.activated.label")
              : t("referralProgramHelper.button.deactivated.label")
          }
          onClick={() => {
            if (isProgramActivated) {
              setIsDeactivatingProgram(true);
            } else {
              toggleReferralProgram({
                is_referral_program_activated: !isProgramActivated,
              });
            }
          }}
        />
      </div>
      {isDeactivatingProgram ? (
        <DeactivateReferralProgramModal
          isOpen={true}
          toggleReferralProgram={toggleReferralProgram}
          onClose={() => setIsDeactivatingProgram(false)}
        />
      ) : null}
    </>
  );
};
