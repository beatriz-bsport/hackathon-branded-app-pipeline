import { FC } from "react";

import { FormField } from "@bsport/form";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";

import { LevelSelector, type LevelSelectorProps } from "./level-selector";

export const LevelSelectorField: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  return (
    <FormField<SessionCreationFormData, "level", LevelSelectorProps>
      name="level"
      mapProps={({ form: { setValue } }) => ({
        onLevelSelect: (levelId: number) => {
          setValue("level", levelId);
        },
      })}
    >
      <LevelSelector fieldIdPrefix={fieldIdPrefix} />
    </FormField>
  );
};
