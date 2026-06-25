import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  BOOKING_HOUR_RANGE_DEFAULT_HOUR,
  BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
} from "../constants";
import {
  REGISTERED_TOTAL_BOOKING_SUB_FILTERS,
  REGISTERED_TOTAL_BOOKING_SUB_FILTERS_BY_ID,
} from "../sub-filters/registry";
import {
  TOTAL_BOOKING_SUB_FILTER_IDS,
  type TotalBookingSubFilterField,
  type TotalBookingSubFilterId,
  totalBookingSubFilterFieldMap,
} from "../sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "../types";

type TotalBookingSubFiltersAreaProps = {
  fieldIds: Record<TotalBookingSubFilterField, string>;
  companyId: number;
  watchedFilterValue: TotalBookingNumberFilterFormValue;
  errors: FieldErrors<TotalBookingNumberFilterFormValue>;
  setValue: UseFormSetValue<TotalBookingNumberFilterFormValue>;
};

type SubFilterFormValueMap = {
  [K in TotalBookingSubFilterId]: TotalBookingNumberFilterFormValue[K];
};

const SUB_FILTER_VALUE_MAP: SubFilterFormValueMap = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: {
    selectAllActivities: false,
    selectedMetaActivityIds: [],
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.attendanceMode]: {
    attendance: true,
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: {
    selectAllEstablishments: false,
    selectedEstablishmentIds: [],
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.coach]: {
    selectAllCoaches: false,
    selectedCoachIds: [],
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack]: {
    selectAllPaymentPacks: false,
    selectedPaymentPackIds: [],
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate]: {
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
  [TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange]: {
    hour: BOOKING_HOUR_RANGE_DEFAULT_HOUR,
    hourSecond: BOOKING_HOUR_RANGE_DEFAULT_HOUR_SECOND,
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.level]: {
    selectedLevelIds: [],
  },
};

export const TotalBookingSubFiltersArea = ({
  fieldIds,
  companyId,
  watchedFilterValue,
  errors,
  setValue,
}: TotalBookingSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_TOTAL_BOOKING_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const SUB_FILTER_LABEL_MAP = {
    [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: t(
      "filters.22.subFilters.activity",
    ),
    [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: t(
      "filters.22.subFilters.establishment",
    ),
    [TOTAL_BOOKING_SUB_FILTER_IDS.coach]: t("filters.22.subFilters.coach"),
    [TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack]: t(
      "filters.22.subFilters.passes",
    ),
    [TOTAL_BOOKING_SUB_FILTER_IDS.level]: t("filters.22.subFilters.level"),
    [TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate]: t(
      "filters.22.subFilters.bookingDate",
    ),
    [TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange]: t(
      "filters.22.subFilters.bookingHourRange",
    ),
    [TOTAL_BOOKING_SUB_FILTER_IDS.attendanceMode]: t(
      "filters.22.subFilters.attendanceMode",
    ),
  };

  const addSubFilter = (subFilterId: TotalBookingSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
    const fieldToSet = totalBookingSubFilterFieldMap[subFilterId];
    setValue(fieldToSet, SUB_FILTER_VALUE_MAP[subFilterId], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeSubFilter = (subFilterId: TotalBookingSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true, shouldValidate: true },
    );
    const fieldToReset = totalBookingSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, SUB_FILTER_VALUE_MAP[subFilterId], {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule =
        REGISTERED_TOTAL_BOOKING_SUB_FILTERS_BY_ID[subFilterId];
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[totalBookingSubFilterFieldMap[subFilterId]] ??
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
        {t("filters.22.fields.filterSpecifications")}
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
                label={t("filters.22.actions.addSubFilter") as string}
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
