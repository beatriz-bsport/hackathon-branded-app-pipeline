import type { FC } from "react";

import {
  Alert,
  Body,
  DetailsLayout,
  Title,
} from "@bsport/kaizen-primitive-core";

import { BenefitsCard } from "#src/features/benefits-card";
import { ContractFormAutoRenewal } from "#src/features/contract-form/components/contract-form-auto-renewal";
import { ContractFormBillingCycle } from "#src/features/contract-form/components/contract-form-billing-cycle";
import { ContractFormCommitmentPeriod } from "#src/features/contract-form/components/contract-form-commitment-period";
import { ContractFormDescription } from "#src/features/contract-form/components/contract-form-description";
import { ContractFormDuration } from "#src/features/contract-form/components/contract-form-duration";
import { ContractFormJoinFee } from "#src/features/contract-form/components/contract-form-join-fee";
import { ContractFormRecurringAmount } from "#src/features/contract-form/components/contract-form-recurring-amount";
import { ContractFormTax } from "#src/features/contract-form/components/contract-form-tax";
import { ContractFormTerms } from "#src/features/contract-form/components/contract-form-terms";
import type { ContractFormMethods } from "#src/features/contract-form/types";
import { useDisclosure } from "#src/hooks/utils/use-disclosure";
import { BENEFIT_KIND } from "#src/utils/contract-benefit";
import { useTranslation } from "#src/utils/i18n";

import { ContractEditBenefitModal } from "./edit-benefit-modal";

type ContractEditorContentProps = {
  formId: string;
  methods: ContractFormMethods;
  isFromMigration: boolean;
  isShared: boolean;
};

export const ContractEditorContent: FC<ContractEditorContentProps> = ({
  formId,
  methods,
  isFromMigration,
  isShared,
}) => {
  const { t } = useTranslation("contract-details");

  const {
    isOpen: isEditBenefitsModalOpen,
    onClose: onCloseEditBenefitsModal,
    onOpen: onOpenEditBenefitsModal,
  } = useDisclosure();

  const benefitKind = methods.watch("benefitKind");
  const sharedDetails = methods.watch("shared_details");
  const passDetails = methods.watch("payment_pack_details");
  const appointmentPassDetails = methods.watch("private_pass_details");

  let hasAccessToOnDemand: boolean = false;
  if (benefitKind === BENEFIT_KIND.UNIVERSAL_PASS) {
    hasAccessToOnDemand =
      passDetails?.full_vod_access ||
      appointmentPassDetails?.full_vod_access ||
      false;
  } else if (benefitKind === BENEFIT_KIND.APPOINTMENT_PASS) {
    hasAccessToOnDemand = appointmentPassDetails?.full_vod_access || false;
  } else if (benefitKind === BENEFIT_KIND.PASS) {
    hasAccessToOnDemand = passDetails?.full_vod_access || false;
  }

  return (
    <DetailsLayout.Content className="flex flex-col gap-md">
      {(isShared || isFromMigration) && (
        <Alert status="info" layout="banner" customIcon="lock-04">
          {isShared ? (
            <Body color="inherit">{t("alerts.sharedContract")}</Body>
          ) : (
            ""
          )}
          {isFromMigration ? (
            <Body color="inherit">{t("alerts.migratedContract")}</Body>
          ) : (
            ""
          )}
        </Alert>
      )}
      <ContractFormDescription formId={formId} readonly={isShared} />

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.price")}
        </Title>
        <ContractFormRecurringAmount formId={formId} readonly={isShared} />
        <ContractFormJoinFee formId={formId} readonly={isShared} />
        <ContractFormTax
          formId={formId}
          watch={methods.watch}
          readonly={isShared}
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.benefits")}
        </Title>
        <BenefitsCard
          kind={benefitKind}
          onEditClick={onOpenEditBenefitsModal}
          credits={sharedDetails?.credits}
          hasAccessToOnDemand={hasAccessToOnDemand}
        />
        <ContractEditBenefitModal
          benefitKind={benefitKind}
          formId={formId}
          isOpen={isEditBenefitsModalOpen}
          methods={methods}
          onClose={onCloseEditBenefitsModal}
          isFromMigration={isFromMigration}
          isShared={isShared}
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.billingCycle")}
        </Title>
        <ContractFormBillingCycle
          formId={formId}
          methods={methods}
          readonly={true} // Why force to true ? Because once set on a Contract, it's not editable
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4">{t("formSections.contractLength")}</Title>
        <ContractFormDuration
          formId={formId}
          methods={methods}
          readonly={isShared || isFromMigration}
        />
        <ContractFormAutoRenewal
          formId={formId}
          methods={methods}
          isFromMigration={isFromMigration}
          isShared={isShared}
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.termsAndConditions")}
        </Title>
        <ContractFormCommitmentPeriod
          formId={formId}
          methods={methods}
          readonly={isShared}
        />
        <ContractFormTerms formId={formId} readonly={isShared} />
      </section>
    </DetailsLayout.Content>
  );
};
