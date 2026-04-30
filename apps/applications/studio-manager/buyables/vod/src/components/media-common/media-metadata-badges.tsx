import type { FC } from "react";

import { Chip } from "@bsport/kaizen-primitive-core";

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
        <Chip
          size="lg"
          color="default"
          type="weak"
          label={durationLabel}
          iconLeft="clock"
        />
      ) : null}
      {levelLabel ? (
        <Chip
          size="lg"
          color="default"
          type="weak"
          label={levelLabel}
          iconLeft="graduation-hat-02"
        />
      ) : null}
      {categoryLabel ? (
        <Chip
          size="lg"
          color="default"
          type="weak"
          label={categoryLabel}
          iconLeft="tag-01"
        />
      ) : null}
      {rentalDaysLabel ? (
        <Chip
          size="lg"
          color="default"
          type="weak"
          label={rentalDaysLabel}
          iconLeft="play-circle-solid"
        />
      ) : null}
    </div>
  );
};
