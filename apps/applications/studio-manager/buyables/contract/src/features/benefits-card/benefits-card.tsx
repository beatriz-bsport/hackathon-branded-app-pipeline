import type { FC } from "react";

import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import type { BenefitKind } from "#src/utils/contract-benefit";
import { useBenefitKindName } from "#src/utils/contract-benefit";
import { useTranslation } from "#src/utils/i18n";

type BenefitsCardProps = {
  credits: number | null | undefined;
  kind: BenefitKind;
  hasAccessToOnDemand: boolean;
  onEditClick?: () => void;
};

export const BenefitsCard: FC<BenefitsCardProps> = ({
  kind,
  credits,
  hasAccessToOnDemand,
  onEditClick,
}) => {
  const { t } = useTranslation("contract-features");

  const kindTranslation = useBenefitKindName(kind);

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
    <Card className="flex flex-row justify-between items-center">
      <div>
        <Body weight="strong">{kindTranslation}</Body>
        <Body weight="weak" size="md" className="mt-xs">
          {description}
        </Body>
      </div>
      {onEditClick && (
        <Button
          color="default"
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
