import type { FC } from "react";

import { Body, Icon, type IconName } from "@bsport/kaizen-primitive-core";

export type SeriesDetailMetadataItem = {
  icon: IconName;
  id: string;
  label?: string;
  value: string;
};

const SeriesDetailMetadataRow: FC<SeriesDetailMetadataItem> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex min-w-0 items-center gap-xs">
    <Icon icon={icon} size="sm" className="shrink-0 text-onsurface-weak" />
    <div className="flex min-w-0 items-baseline gap-2xs">
      {label ? (
        <Body htmlVariant="span" size="lg" weight="strong" className="shrink-0">
          {label}:
        </Body>
      ) : null}
      <Body htmlVariant="span" size="lg" className="min-w-0 truncate">
        {value}
      </Body>
    </div>
  </div>
);

type SeriesDetailMetadataProps = {
  rows: SeriesDetailMetadataItem[];
};

export const SeriesDetailMetadata: FC<SeriesDetailMetadataProps> = ({
  rows,
}) => (
  <div className="flex flex-col gap-md">
    {rows.map((row) => (
      <SeriesDetailMetadataRow key={row.id} {...row} />
    ))}
  </div>
);
