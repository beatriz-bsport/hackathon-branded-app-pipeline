import type { FC } from "react";

import { AccessControlToggle } from "@bsport/kaizen-business-components/buyables/access-control-toggle";
import {
  AppointmentPassFormCompatibleAppointmentsSelector,
  AppointmentPassFormTeacherFullPaymentToggle,
} from "@bsport/kaizen-business-components/buyables/appointment-pass-form";
import { CreditsInput } from "@bsport/kaizen-business-components/buyables/credits-input";
import {
  PassFormGuestBookingToggle,
  PassFormOnDemandToggle,
  PassFormTeacherPayRate,
  PassFormTeacherPayrollToggle,
  PassFormUnlimitedCreditControl,
} from "@bsport/kaizen-business-components/buyables/pass-form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { BENEFIT_KIND, type BenefitKind } from "#src/utils/contract-benefit";
import { fetch } from "#src/utils/fetch";

import type { ContractFormData, ContractFormMethods } from "../types";
import { ContractFormBenefitRestrictions } from "./contract-form-benefit-restrictions";
import { ContractFormPassMaximumUsage } from "./contract-form-pass-maximum-usage";
import { ContractFormPassPenalty } from "./contract-form-pass-penalty";
import { ContractFormPassTimePeriods } from "./contract-form-pass-time-periods";

type ContractFormBenefitConfigurationProps = {
  benefitKind: BenefitKind;
  formId: string;
  methods: ContractFormMethods;
  readonly?: boolean;
};

/**
 * Renders the benefit configuration controls for the chosen {@link BenefitKind}.
 * Each Kaizen business component is shown/hidden per the benefit kind and bound
 * to its `payment_pack_details` / `private_pass_details` / `shared_details` path.
 */
export const ContractFormBenefitConfiguration: FC<
  ContractFormBenefitConfigurationProps
> = ({ benefitKind, formId, methods, readonly }) => {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const features = dataAccessLayer.useCompanyFeatures();

  const isPass = benefitKind === BENEFIT_KIND.PASS;
  const isAppointmentPass = benefitKind === BENEFIT_KIND.APPOINTMENT_PASS;
  const isUniversal = benefitKind === BENEFIT_KIND.UNIVERSAL_PASS;
  const showPassConfig = isPass || isUniversal;
  const showAppointmentConfig = isAppointmentPass || isUniversal;

  const isUnlimited =
    isPass && !!methods.watch("payment_pack_details.hasUnlimitedCredits");
  const onlyVodAccess = !!methods.watch("payment_pack_details.only_vod_access");

  // A pass is access-control compatible only when it isn't VOD-only; the
  // appointment-pass benefit has no such restriction.
  const isObjectValidForAccessControl = showPassConfig ? !onlyVodAccess : true;

  return (
    <div className="flex flex-col gap-sm">
      {isPass && (
        <PassFormUnlimitedCreditControl<
          ContractFormData,
          "payment_pack_details.hasUnlimitedCredits"
        >
          formId={formId}
          fieldName="payment_pack_details.hasUnlimitedCredits"
          disabled={readonly}
        />
      )}

      {(!isUnlimited || showAppointmentConfig) && (
        <CreditsInput<ContractFormData, "shared_details.credits">
          id={`${formId}-credits`}
          fieldName="shared_details.credits"
          passCreditFactor={companyTheme?.pass_credit_factor}
          required
          disabled={readonly}
        />
      )}

      {isPass && isUnlimited && (
        <>
          <PassFormTeacherPayRate<
            ContractFormData,
            "payment_pack_details.theorical_margin_value"
          >
            formId={formId}
            fieldName="payment_pack_details.theorical_margin_value"
            required
            disabled={readonly}
          />

          <ContractFormPassPenalty formId={formId} readonly={readonly} />
        </>
      )}

      {showPassConfig && (
        <ContractFormBenefitRestrictions formId={formId} readonly={readonly} />
      )}

      {showAppointmentConfig && (
        <AppointmentPassFormCompatibleAppointmentsSelector<
          ContractFormData,
          "private_pass_details.private_service_ids",
          "private_pass_details.compatibility"
        >
          id={`${formId}-compatible-appointments`}
          fetch={fetch}
          privateServicesFieldName="private_pass_details.private_service_ids"
          compatibilityFieldName="private_pass_details.compatibility"
          disabled={readonly}
        />
      )}

      {showPassConfig && (
        <>
          <PassFormOnDemandToggle<
            ContractFormData,
            | "payment_pack_details.full_vod_access"
            | "payment_pack_details.only_vod_access"
          >
            formId={formId}
            enableFieldName="payment_pack_details.full_vod_access"
            restrictFieldName="payment_pack_details.only_vod_access"
            disabled={readonly}
          />

          <PassFormGuestBookingToggle<
            ContractFormData,
            "payment_pack_details.allow_guest_pass"
          >
            formId={formId}
            fieldName="payment_pack_details.allow_guest_pass"
            disabled={readonly}
          />
        </>
      )}

      <AccessControlToggle<
        ContractFormData,
        "shared_details.grants_door_access",
        "payment_pack_details.only_vod_access"
      >
        formId={formId}
        fieldName="shared_details.grants_door_access"
        onlyVodAccessFieldName={
          showPassConfig ? "payment_pack_details.only_vod_access" : undefined
        }
        features={features}
        isObjectValidForAccessControl={isObjectValidForAccessControl}
        disabled={readonly}
      />

      {showPassConfig && (
        <PassFormTeacherPayrollToggle<
          ContractFormData,
          "payment_pack_details.applies_for_payroll"
        >
          formId={formId}
          fieldName="payment_pack_details.applies_for_payroll"
          disabled={readonly}
        />
      )}

      {isPass && (
        <>
          <ContractFormPassMaximumUsage formId={formId} readonly={readonly} />

          <ContractFormPassTimePeriods formId={formId} readonly={readonly} />
        </>
      )}

      {showAppointmentConfig && (
        <AppointmentPassFormTeacherFullPaymentToggle<
          ContractFormData,
          "private_pass_details.on_behalf_of_teacher"
        >
          formId={formId}
          fieldName="private_pass_details.on_behalf_of_teacher"
          disabled={readonly}
        />
      )}
    </div>
  );
};
