import { type FC } from "react";

import { Divider } from "@bsport/kaizen-primitive-core";

import { VenueFormFields } from "#src/components/venue-form-fields/venue-form-fields";
import { SpotSchedulingSection } from "#src/components/venue-spot-scheduling/spot-scheduling-section";

export const VenueEditorTab: FC = () => (
  <div className="flex flex-col gap-xl">
    <VenueFormFields />
    <Divider orientation="horizontal" weight="thin" />
    <SpotSchedulingSection />
  </div>
);
