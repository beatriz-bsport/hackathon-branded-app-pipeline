import { type FC } from "react";
import { z } from "zod";

import { ControlledForm, type UseFormControllerOutput } from "@bsport/form";
import { Divider } from "@bsport/kaizen-primitive-core";

import type { ClassFormValues } from "#src/utils/class-form";

import { AutomaticCancellationSection } from "./automatic-cancellation-section";
import { BookingWindowSection } from "./booking-window-section";
import { ClassDetailsSection } from "./class-details-section";
import { CustomRestrictionsSection } from "./custom-restrictions-section";
import { TypeSection } from "./type-section";

export const ClassForm: FC<{
  formId: string;
  methods: UseFormControllerOutput<z.ZodType<ClassFormValues>>;
  onSubmit: (data: ClassFormValues) => void;
}> = ({ formId, methods, onSubmit }) => {
  return (
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
    >
      <TypeSection />
      <Divider weight="thin" />
      <ClassDetailsSection />
      <Divider weight="thin" />
      <BookingWindowSection />
      <Divider weight="thin" />
      <CustomRestrictionsSection />
      <Divider weight="thin" />
      <AutomaticCancellationSection />
    </ControlledForm>
  );
};
