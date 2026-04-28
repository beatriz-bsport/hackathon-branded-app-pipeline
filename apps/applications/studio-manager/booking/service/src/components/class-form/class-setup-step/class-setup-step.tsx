import { type FC, useEffect } from "react";
import { useFormState, useWatch } from "react-hook-form";

import { useFormContext } from "@bsport/form";

import { type ClassFormValues, STEP_1_FIELDS } from "#src/utils/class-form";

import { BasicInfoSection } from "./basic-info-section";

type ClassSetupStepProps = {
  onValidityChange?: (valid: boolean) => void;
};

export const ClassSetupStep: FC<ClassSetupStepProps> = ({
  onValidityChange,
}) => {
  const { control, getFieldState } = useFormContext<ClassFormValues>();
  const formState = useFormState<ClassFormValues>({
    control,
    name: STEP_1_FIELDS,
  });
  const [isWorkshop, name, SCT, description] = useWatch({
    control,
    name: STEP_1_FIELDS,
  });

  const isValid =
    !getFieldState("is_workshop", formState).error &&
    !getFieldState("name", formState).error &&
    !getFieldState("SCT", formState).error &&
    !getFieldState("description", formState).error &&
    isWorkshop !== null &&
    name.trim().length > 0 &&
    SCT.length > 0 &&
    description.trim().length > 0;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <div className="flex flex-col gap-md w-full">
      <BasicInfoSection />
    </div>
  );
};
