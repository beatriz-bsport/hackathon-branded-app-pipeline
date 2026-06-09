import type { FC } from "react";

import type { AppointmentPass } from "@bsport/api-buyables/appointment-pass";
import type { Pass } from "@bsport/api-buyables/pass";
import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type BenefitsCardProps = {
  passBenefit?: Pass | null;
  appointmentPassBenefit?: AppointmentPass | null;
  onEditClick?: () => void;
};

export const BenefitsCard: FC<BenefitsCardProps> = ({
  passBenefit,
  appointmentPassBenefit,
  onEditClick,
}) => {
  const { t } = useTranslation("contract-features");

  let kind = "";
  let credits: number | null = null;
  let hasAccessToOnDemand: boolean = false;

  const hasPass = passBenefit != null;
  const hasAppointmentPass = appointmentPassBenefit != null;

  if (hasPass && hasAppointmentPass) {
    kind = t("benefitsCard.kinds.universalPass");
    credits = passBenefit.credits ?? appointmentPassBenefit.credits;
    hasAccessToOnDemand =
      passBenefit.full_vod_access ?? appointmentPassBenefit.full_vod_access;
  } else if (hasAppointmentPass) {
    kind = t("benefitsCard.kinds.appointmentPass");
    credits = appointmentPassBenefit.credits;
    hasAccessToOnDemand = appointmentPassBenefit.full_vod_access;
  } else if (hasPass) {
    kind = t("benefitsCard.kinds.pass");
    credits = passBenefit.credits;
    hasAccessToOnDemand = passBenefit.full_vod_access;
  }

  const creditsTranslation =
    credits == null
      ? t("benefitsCard.credits.unlimited")
      : t("benefitsCard.credits.nbOfCredits", { count: credits });
  const onDemandTranslation = hasAccessToOnDemand
    ? t("benefitsCard.hasAccessToOnDemand")
    : null;
  const description = onDemandTranslation
    ? `${creditsTranslation} - ${onDemandTranslation}`
    : creditsTranslation;

  return (
    <Card className="flex flex-row justify-between">
      <div>
        <Body weight="strong">{kind}</Body>
        <Body weight="weak" size="md" className="mt-xs">
          {description}
        </Body>
      </div>
      {onEditClick && (
        <Button
          color="main"
          intent="flat"
          label={t("benefitsCard.editBenefit")}
          size="md"
          icon="pencil-02"
          kind="icon-button"
          onClick={onEditClick}
        />
      )}
    </Card>
  );
};
