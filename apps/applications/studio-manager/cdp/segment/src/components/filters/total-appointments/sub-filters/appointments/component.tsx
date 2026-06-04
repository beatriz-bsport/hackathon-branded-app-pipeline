import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useAppointmentsQuery } from "#src/api/use-appointments-query";
import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";
import { useTranslation } from "#src/utils/i18n";

import type { TotalAppointmentsSubFilterSectionProps } from "../total-appointments-sub-filter-section-props";

/**
 * Multi-select sub-filter for scoping total appointments to specific appointment types.
 */
export const AppointmentsSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalAppointmentsSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const appointmentLabel = t("filters.26.subFilters.appointment");
  const { data } = useAppointmentsQuery({ includeDisabled: true });
  const appointmentOptions = (data ?? []).map((appointment) => ({
    id: appointment.id,
    name: appointment.name,
  }));

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {appointmentLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.26.actions.removeSubFilter", {
            subFilterLabel: appointmentLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <ItemsSearchFilter
        id={id}
        options={appointmentOptions}
        value={value.appointment.selectedAppointmentIds}
        onChange={(nextSelectedIds) => {
          setValue(
            "appointment",
            {
              selectAllAppointments: false,
              selectedAppointmentIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
        searchPlaceholder={t("filters.26.fields.appointment.searchPlaceholder")}
        emptySelectionLabel={t("filters.26.fields.appointment.emptySelection")}
        errorText={
          errors.appointment?.selectedAppointmentIds?.message
            ? String(errors.appointment.selectedAppointmentIds.message)
            : undefined
        }
      />
    </Card>
  );
};
