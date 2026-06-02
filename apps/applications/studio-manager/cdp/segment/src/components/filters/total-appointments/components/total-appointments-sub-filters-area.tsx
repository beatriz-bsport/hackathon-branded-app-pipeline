import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import { useTranslation } from "#src/utils/i18n";

import {
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR,
  APPOINTMENT_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../constants";
import { REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS } from "../sub-filters/registry";
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
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate]: {
    dateType: DATE_FILTER_TYPES.absolute,
    absolute: {
      operator: ABSOLUTE_DATE_OPERATORS.onOrBefore,
      fromDate: null,
      toDate: null,
    },
    relative: {
      operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
      firstDays: null,
      secondDays: null,
    },
  },
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
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass]: {
    selectAllPrivatePasses: false,
    selectedPrivatePassIds: [],
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
    [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.privatePass]: t(
      "filters.26.subFilters.appointmentPass",
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
      shouldValidate: true,
    });
  };

  const removeSubFilter = (subFilterId: TotalAppointmentsSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true, shouldValidate: true },
    );
    const fieldToReset = totalAppointmentsSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, SUB_FILTER_VALUE_MAP[subFilterId], {
      shouldDirty: true,
    });
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.26.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const subFilterModule = REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS.find(
          (registeredModule) => registeredModule.id === subFilterId,
        );
        if (!subFilterModule) {
          return null;
        }
        const Section = subFilterModule.Section;
        const sectionId =
          fieldIds[totalAppointmentsSubFilterFieldMap[subFilterId]] ??
          `${subFilterId}-section`;

        return (
          <Section
            key={subFilterId}
            id={sectionId}
            companyId={companyId}
            value={watchedFilterValue}
            errors={errors}
            setValue={setValue}
            onRemove={() => removeSubFilter(subFilterId)}
          />
        );
      })}

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
