import { type FC } from "react";

import { Divider, type SelectProps } from "@bsport/kaizen-primitive-core";

import { VenueFormFields } from "#src/components/venue-form-fields/venue-form-fields";
import { SpotSchedulingSection } from "#src/components/venue-spot-scheduling/spot-scheduling-section";

type VenueEditorTabProps = {
  multiLocalization: boolean;
  groupItems: SelectProps["items"];
};

export const VenueEditorTab: FC<VenueEditorTabProps> = ({
  multiLocalization,
  groupItems,
}) => (
  <div className="flex flex-col gap-xl">
    <VenueFormFields
      multiLocalization={multiLocalization}
      groupItems={groupItems}
    />
    <Divider orientation="horizontal" weight="thin" />
    <SpotSchedulingSection />
  </div>
);
