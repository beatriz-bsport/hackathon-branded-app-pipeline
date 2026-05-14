import { type FC } from "react";

import { Divider } from "@bsport/kaizen-primitive-core";

import { EditBasicInfoSection } from "#src/components/class-editor/sections/edit-basic-info-section";
import { AutomaticCancellationSection } from "#src/components/class-form/booking-rules-step/automatic-cancellation-section";
import { BookingWindowSection } from "#src/components/class-form/booking-rules-step/booking-window-section";

export const ClassEditorForm: FC = () => {
  return (
    <div className="flex flex-col gap-xl">
      <EditBasicInfoSection />
      <Divider orientation="horizontal" weight="thin" />
      <BookingWindowSection />
      <Divider orientation="horizontal" weight="thin" />
      <AutomaticCancellationSection />
    </div>
  );
};
