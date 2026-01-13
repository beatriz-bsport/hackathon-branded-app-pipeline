import type { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EstablishmentSelectorField } from "./establishment-selector-field";
import { RoomBlueprintSelectorField } from "./room-blueprint-selector-field";
import { TeacherPaymentRuleSelectorField } from "./teacher-payment-rule-selector-field";
import { TeacherSelectorField } from "./teacher-selector-field";

export const SessionTeacherAndEstablishment: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");
  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t(
          "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.title",
        )}
      </Title>
      <TeacherSelectorField fieldIdPrefix={fieldIdPrefix} />
      <TeacherPaymentRuleSelectorField fieldIdPrefix={fieldIdPrefix} />
      <EstablishmentSelectorField fieldIdPrefix={fieldIdPrefix} />
      <RoomBlueprintSelectorField fieldIdPrefix={fieldIdPrefix} />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
