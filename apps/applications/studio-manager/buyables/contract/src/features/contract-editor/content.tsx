import type { FC } from "react";

import { DetailsLayout, Title } from "@bsport/kaizen-primitive-core";

import { ContractFormAutoRenewal } from "#src/features/contract-form/components/contract-form-auto-renewal";
import { ContractFormBillingCycle } from "#src/features/contract-form/components/contract-form-billing-cycle";
import { ContractFormCommitmentPeriod } from "#src/features/contract-form/components/contract-form-commitment-period";
import { ContractFormDescription } from "#src/features/contract-form/components/contract-form-description";
import { ContractFormDuration } from "#src/features/contract-form/components/contract-form-duration";
import { ContractFormJoinFee } from "#src/features/contract-form/components/contract-form-join-fee";
import { ContractFormName } from "#src/features/contract-form/components/contract-form-name";
import { ContractFormRecurringAmount } from "#src/features/contract-form/components/contract-form-recurring-amount";
import { ContractFormTax } from "#src/features/contract-form/components/contract-form-tax";
import { ContractFormTerms } from "#src/features/contract-form/components/contract-form-terms";
import type { ContractFormMethods } from "#src/features/contract-form/types";
import { useTranslation } from "#src/utils/i18n";

type ContractEditorContentProps = {
  isRevampedContract: boolean;
  formId: string;
  methods: ContractFormMethods;
  readonly?: boolean;
};

export const ContractEditorContent: FC<ContractEditorContentProps> = ({
  isRevampedContract,
  formId,
  methods,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");
  return (
    <DetailsLayout.Content className="flex flex-col gap-md">
      <ContractFormName formId={formId} readonly={readonly} />
      <ContractFormDescription formId={formId} readonly={readonly} />

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.price")}
        </Title>
        <ContractFormRecurringAmount formId={formId} readonly={readonly} />
        <ContractFormJoinFee formId={formId} readonly={readonly} />
        <ContractFormTax
          formId={formId}
          watch={methods.watch}
          isRevampedContract={isRevampedContract}
          readonly={readonly}
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.billingCycle")}
        </Title>
        <ContractFormBillingCycle
          formId={formId}
          methods={methods}
          readonly // Why force to true ? Because once set on a Contract, it's not editable
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4">{t("formSections.contractLength")}</Title>
        <ContractFormDuration
          formId={formId}
          methods={methods}
          readonly={readonly}
        />
        <ContractFormAutoRenewal
          formId={formId}
          methods={methods}
          readonly={readonly}
        />
      </section>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.termsAndConditions")}
        </Title>
        <ContractFormCommitmentPeriod
          formId={formId}
          methods={methods}
          readonly={readonly}
        />
        <ContractFormTerms formId={formId} readonly={readonly} />
      </section>
    </DetailsLayout.Content>
  );
};
