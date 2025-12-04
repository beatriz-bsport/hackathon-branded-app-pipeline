import { FC, useId } from "react";

import { ControlledForm, UseFormControllerOutput } from "@bsport/form";

import { SessionDetails } from "#src/components/SessionForm/Details/SessionDetails";
import { SessionSettings } from "#src/components/SessionForm/Settings/SessionSettings";
import { SessionCreationFormSchema } from "#src/components/SessionForm/schemas";

export const ConfigureSessionStep: FC<{
  methods: UseFormControllerOutput<SessionCreationFormSchema>;
}> = ({ methods }) => {
  const formId = `session-form-create-${useId()}`;

  return (
    // TODO: Replace console.log with actual submit handler
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={() => console.log}
      className="w-full"
    >
      <SessionDetails fieldIdPrefix={formId} />
      <SessionSettings fieldIdPrefix={formId} />
    </ControlledForm>
  );
};
