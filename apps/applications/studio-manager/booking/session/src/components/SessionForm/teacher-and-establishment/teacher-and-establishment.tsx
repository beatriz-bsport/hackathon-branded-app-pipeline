import type { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

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
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
