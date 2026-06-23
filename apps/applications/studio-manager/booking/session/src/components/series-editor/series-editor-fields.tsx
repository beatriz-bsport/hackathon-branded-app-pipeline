import { type FC } from "react";

import { Divider } from "@bsport/kaizen-primitive-core";

import {
  SeriesDetailsBookingRuleField,
  SeriesDetailsGuestBookingUnavailableInfo,
  SeriesDetailsLevelField,
  SeriesDetailsNameField,
  SeriesDetailsServiceSection,
  SeriesDetailsTagsSection,
  SeriesDetailsVisibilitySection,
} from "#src/components/series-details-form/series-details-fields";

type SeriesEditorBaseProps = {
  canEdit: boolean;
  fieldIdPrefix: string;
};

type SeriesEditorPanelContentProps = SeriesEditorBaseProps & {
  activity?: {
    alt_cover_main?: string;
    cover_main?: string;
    name?: string;
  };
};

export const SeriesEditorBasicsSection: FC<SeriesEditorBaseProps> = ({
  canEdit,
  fieldIdPrefix,
}) => (
  <section className="flex flex-col gap-lg">
    <SeriesDetailsNameField disabled={!canEdit} fieldIdPrefix={fieldIdPrefix} />
    <SeriesDetailsLevelField
      disabled={!canEdit}
      fieldIdPrefix={fieldIdPrefix}
    />
    <SeriesDetailsBookingRuleField
      disabled={!canEdit}
      fieldIdPrefix={fieldIdPrefix}
    />
    <SeriesDetailsGuestBookingUnavailableInfo />
  </section>
);

export const SeriesEditorVisibilitySection: FC<SeriesEditorBaseProps> = ({
  canEdit,
  fieldIdPrefix,
}) => (
  <SeriesDetailsVisibilitySection
    disabled={!canEdit}
    fieldIdPrefix={fieldIdPrefix}
  />
);

export const SeriesEditorDetailsSection: FC<
  Pick<SeriesEditorPanelContentProps, "activity" | "fieldIdPrefix">
> = ({ activity, fieldIdPrefix }) => (
  <SeriesDetailsServiceSection
    activity={activity}
    fieldIdPrefix={fieldIdPrefix}
  />
);

export const SeriesEditorTagsSection: FC<SeriesEditorBaseProps> = ({
  canEdit,
  fieldIdPrefix,
}) => (
  <SeriesDetailsTagsSection disabled={!canEdit} fieldIdPrefix={fieldIdPrefix} />
);

export const SeriesEditorPanelContent: FC<SeriesEditorPanelContentProps> = ({
  activity,
  canEdit,
  fieldIdPrefix,
}) => (
  <div className="flex flex-col gap-lg pb-xl">
    <SeriesEditorVisibilitySection
      canEdit={canEdit}
      fieldIdPrefix={fieldIdPrefix}
    />
    <Divider orientation="horizontal" weight="extra-thin" />
    <SeriesEditorDetailsSection
      activity={activity}
      fieldIdPrefix={fieldIdPrefix}
    />
    <Divider orientation="horizontal" weight="extra-thin" />
    <SeriesEditorTagsSection canEdit={canEdit} fieldIdPrefix={fieldIdPrefix} />
  </div>
);
