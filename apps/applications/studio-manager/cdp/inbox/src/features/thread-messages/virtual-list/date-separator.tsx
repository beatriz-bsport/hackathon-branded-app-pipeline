import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Divider } from "@bsport/kaizen-primitive-core";

export type DateSeparatorProps = {
  /** ISO timestamp of any message in the day group; only the date is shown. */
  iso: string;
};

/**
 * A centered day label flanked by dividers, marking the boundary between two
 * calendar-day groups in the message feed. Presentational only.
 */
export function DateSeparator({ iso }: DateSeparatorProps) {
  const label = formatDateTime(iso, DATETIME_FORMATS.FULL_DATE);

  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-sm px-sm py-xs"
    >
      <Divider className="flex-1" />
      <Body
        htmlVariant="span"
        color="weak"
        weight="strong"
        className="shrink-0 text-body-xs uppercase"
      >
        {label}
      </Body>
      <Divider className="flex-1" />
    </div>
  );
}
