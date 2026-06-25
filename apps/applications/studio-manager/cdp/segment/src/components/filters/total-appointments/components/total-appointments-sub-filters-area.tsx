import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../constants";
import {
  REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS,
  REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import {
  TOTAL_APPOINTMENTS_SUB_FILTER_IDS,
  type TotalAppointmentsSubFilterField,
  type TotalAppointmentsSubFilterId,
  totalAppointmentsSubFilterFieldMap,
} from "../sub-filters/total-appointments-sub-filter-id";
import type { TotalAppointmentsNumberFilterFormValue } from "../types";

type TotalAppointmentsSubFiltersAreaProps = {
  fieldIds: Record<TotalAppointmentsSubFilterField, string>;
  companyId: number;
  watchedFilterValue: TotalAppointmentsNumberFilterFormValue;
  errors: FieldErrors<TotalAppointmentsNumberFilterFormValue>;
  setValue: UseFormSetValue<TotalAppointmentsNumberFilterFormValue>;
};

type SubFilterFormValueMap = {
  [K in TotalAppointmentsSubFilterId]: TotalAppointmentsNumberFilterFormValue[K];
};

const SUB_FILTER_VALUE_MAP: SubFilterFormValueMap = {
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate]:
    createDefaultDateFilterValue(),
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange]: {
    hour: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
    hourSecond: APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
  },
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach]: {
    selectAllCoaches: false,
    selectedCoachIds: [],
  },
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment]: {
    selectAllEstablishments: false,
    selectedEstablishmentIds: [],
    atHome: false,
  },
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass]: {
    selectAllAppointmentPasses: false,
    selectedAppointmentPassIds: [],
  },
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment]: {
    selectAllAppointments: false,
    selectedAppointmentIds: [],
  },
};

export const TotalAppointmentsSubFiltersArea = ({
  fieldIds,
  companyId,
  watchedFilterValue,
  errors,
  setValue,
}: TotalAppointmentsSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const SUB_FILTER_LABEL_MAP = {
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate]: t(
      "filters.26.subFilters.appointmentDate",
    ),
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange]: t(
      "filters.26.subFilters.appointmentHourRange",
    ),
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach]: t("filters.26.subFilters.coach"),
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment]: t(
      "filters.26.subFilters.establishment",
    ),
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass]: t(
      "filters.26.subFilters.appointmentPass",
    ),
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment]: t(
      "filters.26.subFilters.appointment",
    ),
  };

  const addSubFilter = (subFilterId: TotalAppointmentsSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
    const fieldToSet = totalAppointmentsSubFilterFieldMap[subFilterId];
    setValue(fieldToSet, SUB_FILTER_VALUE_MAP[subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: TotalAppointmentsSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = totalAppointmentsSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, SUB_FILTER_VALUE_MAP[subFilterId], {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule =
        REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS_BY_ID[subFilterId];
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[totalAppointmentsSubFilterFieldMap[subFilterId]] ??
        `${subFilterId}-section`;

      return [
        {
          key: sectionId,
          content: (
            <Section
              id={sectionId}
              companyId={companyId}
              value={watchedFilterValue}
              errors={errors}
              setValue={setValue}
              onRemove={() => removeSubFilter(subFilterId)}
            />
          ),
        },
      ];
    },
  );

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.26.fields.filterSpecifications")}
      </Body>

      <SubFiltersCardSections sections={subFilterSections} />

      {availableSubFilters.length > 0 ? (
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                iconLeft="plus"
                size="sm"
                intent="flat"
                color="default"
                label={t("filters.26.actions.addSubFilter") as string}
                onClick={() => setIsPopoverOpened(true)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content placement="bottom-left">
            {({ setIsPopoverOpened }) => (
              <Menu
                items={availableSubFilters.map((subFilterModule) => ({
                  id: subFilterModule.id,
                  label: SUB_FILTER_LABEL_MAP[subFilterModule.id],
                }))}
                onSelectOption={(selectedId) => {
                  const matchedModule = availableSubFilters.find(
                    (subFilterModule) => subFilterModule.id === selectedId,
                  );
                  if (!matchedModule) {
                    return;
                  }
                  addSubFilter(matchedModule.id);
                  setIsPopoverOpened(false);
                }}
              />
            )}
          </Popover.Content>
        </Popover>
      ) : null}
    </>
  );
};
