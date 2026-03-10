import { FC, useId } from "react";

import { ControlledForm, UseFormControllerOutput } from "@bsport/form";
import { Divider } from "@bsport/kaizen-primitive-core";

import { NameAndDescription } from "#src/components/SessionForm/Details/name-and-description";
import { SessionSettings } from "#src/components/SessionForm/Settings/SessionSettings";
import { SessionTimeAndDate } from "#src/components/SessionForm/TimeAndDate/SessionTimeAndDate";
import { SessionCreationFormSchema } from "#src/components/SessionForm/schemas";
import { SessionTeacherAndEstablishment } from "#src/components/SessionForm/teacher-and-establishment/teacher-and-establishment";

export const ConfigureSessionStep: FC<{
  methods: UseFormControllerOutput<SessionCreationFormSchema>;
}> = ({ methods }) => {
  const formId = `session-form-create-${useId()}`;

  return (
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={() => console.log}
      className="w-full"
    >
      <NameAndDescription fieldIdPrefix={formId} />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
      <SessionTimeAndDate fieldIdPrefix={formId} />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
      <SessionTeacherAndEstablishment fieldIdPrefix={formId} />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
      <SessionSettings fieldIdPrefix={formId} />
    </ControlledForm>
  );
};
