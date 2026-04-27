import { type FC, useEffect } from "react";
import { useFormState } from "react-hook-form";

import { useFormContext } from "@bsport/form";
import { Divider } from "@bsport/kaizen-primitive-core";

import { type ClassFormValues } from "#src/utils/class-form";

import { AutomaticCancellationSection } from "./automatic-cancellation-section";
import { BookingWindowSection } from "./booking-window-section";

type BookingRulesStepProps = {
  onValidityChange?: (valid: boolean) => void;
};

export const BookingRulesStep: FC<BookingRulesStepProps> = ({
  onValidityChange,
}) => {
  const { control } = useFormContext<ClassFormValues>();
  const { isValid } = useFormState<ClassFormValues>({
    control,
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <div className="flex flex-col gap-md w-full">
      <BookingWindowSection />
      <Divider weight="thin" />
      <AutomaticCancellationSection />
    </div>
  );
};
