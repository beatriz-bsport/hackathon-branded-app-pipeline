import type { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { TeacherSelectorField } from "#src/components/SessionForm/teacher-and-establishment/teacher-selector-field";
import { useTranslation } from "#src/utils/i18n";

import { TeacherPaymentRuleSelectorField } from "./teacher-payment-rule-selector-field";

export const TeacherSection: FC<{
  fieldIdPrefix: string;
  coach: number;
  coachPayrollRule: number | null;
}> = ({ fieldIdPrefix, coach, coachPayrollRule }) => {
  const { t } = useTranslation("sessionEdit");

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("editSessionForm.content.teacherSectionTitle")}
      </Title>
      <TeacherSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={coach}
      />
      <TeacherPaymentRuleSelectorField
        fieldIdPrefix={fieldIdPrefix}
        defaultSelectedId={coachPayrollRule}
      />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
