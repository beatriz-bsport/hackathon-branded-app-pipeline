import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { useAppointmentPassesQuery } from "#src/api/use-appointment-passes-query";
import { PassSelectionField } from "#src/components/filters/passes-filter/components/pass-selection-field";
import { useTranslation } from "#src/utils/i18n";

import type { TotalAppointmentsSubFilterSectionProps } from "../total-appointments-sub-filter-section-props";
import { mapAppointmentPassToPassOption } from "./map-appointment-pass-to-pass-option";

/**
 * Multi-select sub-filter for scoping total appointments to specific appointment passes.
 */
export const AppointmentPassSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalAppointmentsSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const appointmentPassLabel = t("filters.26.subFilters.appointmentPass");
  const { data } = useAppointmentPassesQuery("", { includeDisabled: true });
  const passOptions = (data?.results ?? []).map(mapAppointmentPassToPassOption);

  return (
    <Card className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {appointmentPassLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.26.actions.removeSubFilter", {
            subFilterLabel: appointmentPassLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <PassSelectionField
        id={id}
        value={value.appointmentPass.selectedAppointmentPassIds}
        passOptions={passOptions}
        errorText={
          errors.appointmentPass?.selectedAppointmentPassIds?.message
            ? String(errors.appointmentPass.selectedAppointmentPassIds.message)
            : undefined
        }
        onChange={(nextSelectedIds) => {
          setValue(
            "appointmentPass",
            {
              selectAllAppointmentPasses: false,
              selectedAppointmentPassIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
      />
    </Card>
  );
};
