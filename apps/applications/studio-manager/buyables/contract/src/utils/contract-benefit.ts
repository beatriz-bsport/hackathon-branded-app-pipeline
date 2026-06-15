import { useTranslation } from "./i18n";

export type BenefitKind = "pass" | "appointment-pass" | "universal-pass";

export const BENEFIT_KIND = {
  PASS: "pass",
  APPOINTMENT_PASS: "appointment-pass",
  UNIVERSAL_PASS: "universal-pass",
} as const satisfies Record<string, BenefitKind>;

export function getBenefitKind({
  hasPass,
  hasAppointmentPass,
}: {
  hasPass: boolean;
  hasAppointmentPass: boolean;
}) {
  if (hasPass && hasAppointmentPass) {
    return BENEFIT_KIND.UNIVERSAL_PASS;
  }
  if (hasAppointmentPass) {
    return BENEFIT_KIND.APPOINTMENT_PASS;
  }
  return BENEFIT_KIND.PASS;
}

export const useBenefitKindName = (benefitKind: BenefitKind) => {
  const { t } = useTranslation("contract-features");

  if (benefitKind === BENEFIT_KIND.UNIVERSAL_PASS) {
    return t("benefitsCard.kinds.universalPass");
  }
  if (benefitKind === BENEFIT_KIND.APPOINTMENT_PASS) {
    return t("benefitsCard.kinds.appointmentPass");
  }
  if (benefitKind === BENEFIT_KIND.PASS) {
    return t("benefitsCard.kinds.pass");
  }
  const _exhaustive: never = benefitKind;
  return _exhaustive;
};
