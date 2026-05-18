import type { FieldErrors, UseFormSetValue } from "react-hook-form";

import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "../sub-filters/registry";
import {
  TOTAL_BOOKING_SUB_FILTER_IDS,
  type TotalBookingSubFilterField,
  type TotalBookingSubFilterId,
  totalBookingSubFilterFieldMap,
} from "../sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "../types";

type TotalBookingSubFiltersAreaProps = {
  fieldIds: Record<TotalBookingSubFilterField, string>;
  watchedFilterValue: TotalBookingNumberFilterFormValue;
  errors: FieldErrors<TotalBookingNumberFilterFormValue>;
  setValue: UseFormSetValue<TotalBookingNumberFilterFormValue>;
  activityOptions: {
    id: number;
    name: string;
  }[];
  establishmentOptions: {
    id: number;
    name: string;
  }[];
};

const ACTIVITY_DEFAULT_VALUE = {
  selectAllActivities: true,
  selectedMetaActivityIds: [],
};
const ESTABLISHMENT_DEFAULT_VALUE = {
  selectAllEstablishments: true,
  selectedEstablishmentIds: [],
};

const SUB_FILTER_DEFAULT_VALUE_MAP: {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: typeof ACTIVITY_DEFAULT_VALUE;
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: typeof ESTABLISHMENT_DEFAULT_VALUE;
} = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: ACTIVITY_DEFAULT_VALUE,
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: ESTABLISHMENT_DEFAULT_VALUE,
};

const SUB_FILTER_INITIAL_VALUE_MAP: {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: typeof ACTIVITY_DEFAULT_VALUE;
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: typeof ESTABLISHMENT_DEFAULT_VALUE;
} = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: {
    selectAllActivities: false,
    selectedMetaActivityIds: [],
  },
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: {
    selectAllEstablishments: false,
    selectedEstablishmentIds: [],
  },
};

const SUB_FILTER_FIELD_MAP = {
  [TOTAL_BOOKING_SUB_FILTER_IDS.activity]: "activity",
  [TOTAL_BOOKING_SUB_FILTER_IDS.establishment]: "establishment",
} as const;

export const TotalBookingSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
  activityOptions,
  establishmentOptions,
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
  };

  const addSubFilter = (subFilterId: TotalBookingSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
    const fieldToSet = SUB_FILTER_FIELD_MAP[subFilterId];
    setValue(fieldToSet, SUB_FILTER_INITIAL_VALUE_MAP[subFilterId], {
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
    const fieldToReset = SUB_FILTER_FIELD_MAP[subFilterId];
    setValue(fieldToReset, SUB_FILTER_DEFAULT_VALUE_MAP[subFilterId], {
      shouldDirty: true,
    });
  };

  return (
    <>
      <Body size="md" color="weak" weight="strong">
        {t("filters.19.fields.filterSpecifications")}
      </Body>

      {watchedFilterValue.subFilters.map((subFilterId) => {
        const subFilterModule = REGISTERED_TOTAL_BOOKING_SUB_FILTERS.find(
          (registeredModule) => registeredModule.id === subFilterId,
        );
        if (!subFilterModule) {
          return null;
        }
        const Section = subFilterModule.Section;
        const sectionId =
          fieldIds[totalBookingSubFilterFieldMap[subFilterId]] ??
          `${subFilterId}-section`;

        return (
          <Section
            key={subFilterId}
            id={sectionId}
            value={watchedFilterValue}
            errors={errors}
            setValue={setValue}
            activityOptions={activityOptions}
            establishmentOptions={establishmentOptions}
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
                label={t("filters.19.actions.addSubFilter")}
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
