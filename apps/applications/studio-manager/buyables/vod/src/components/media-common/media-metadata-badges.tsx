import type { FC } from "react";

import { Badge } from "@bsport/kaizen-primitive-core";

type MediaMetadataBadgesProps = {
  durationLabel?: string;
  levelLabel?: string;
  categoryLabel?: string;
  rentalDaysLabel?: string;
};

export const MediaMetadataBadges: FC<MediaMetadataBadgesProps> = ({
  durationLabel,
  levelLabel,
  categoryLabel,
  rentalDaysLabel,
}) => {
  if (!durationLabel && !levelLabel && !categoryLabel && !rentalDaysLabel) {
    return null;
  }

  return (
    <div className="mt-md flex flex-wrap items-center gap-xs">
      {durationLabel ? (
        <Badge size="lg" color="default" text={durationLabel} icon="clock" />
      ) : null}
      {levelLabel ? (
        <Badge
          size="lg"
          color="default"
          text={levelLabel}
          icon="graduation-hat-02"
        />
      ) : null}
      {categoryLabel ? (
        <Badge size="lg" color="default" text={categoryLabel} icon="tag-01" />
      ) : null}
      {rentalDaysLabel ? (
        <Badge
          size="lg"
          color="default"
          text={rentalDaysLabel}
          icon="play-circle-solid"
        />
      ) : null}
    </div>
  );
};
