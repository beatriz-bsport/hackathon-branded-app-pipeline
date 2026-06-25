import { Body, Button } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { InternalNotesSubFilterSectionProps } from "../internal-notes-sub-filter-section-props";

/**
 * Renders the note creation date sub-filter using the shared date primitive.
 */
export const NoteCreationDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: InternalNotesSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {t("filters.104.subFilters.noteCreationDate")}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.104.actions.removeSubFilter", {
            subFilterLabel: t("filters.104.subFilters.noteCreationDate"),
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>
      <DateFilter
        id={id}
        value={value.noteCreationDate}
        onChange={(nextValue) =>
          setValue("noteCreationDate", nextValue, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        errors={{
          absoluteFromDate: errors.noteCreationDate?.absolute?.fromDate?.message
            ? String(errors.noteCreationDate.absolute.fromDate.message)
            : undefined,
          absoluteToDate: errors.noteCreationDate?.absolute?.toDate?.message
            ? String(errors.noteCreationDate.absolute.toDate.message)
            : undefined,
          relativeFirstDays: errors.noteCreationDate?.relative?.firstDays
            ?.message
            ? String(errors.noteCreationDate.relative.firstDays.message)
            : undefined,
          relativeSecondDays: errors.noteCreationDate?.relative?.secondDays
            ?.message
            ? String(errors.noteCreationDate.relative.secondDays.message)
            : undefined,
        }}
      />
    </div>
  );
};
