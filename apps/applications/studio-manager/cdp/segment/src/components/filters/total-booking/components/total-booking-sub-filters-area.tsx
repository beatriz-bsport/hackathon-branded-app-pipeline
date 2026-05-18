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
};

const ACTIVITY_DEFAULT_VALUE = {
  selectAllActivities: true,
  selectedMetaActivityIds: [],
};

export const TotalBookingSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
  activityOptions,
}: TotalBookingSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_TOTAL_BOOKING_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: TotalBookingSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });

    if (subFilterId === TOTAL_BOOKING_SUB_FILTER_IDS.activity) {
      setValue(
        "activity",
        {
          selectAllActivities: false,
          selectedMetaActivityIds: [],
        },
        { shouldDirty: true, shouldValidate: true },
      );
    }
  };

  const removeSubFilter = (subFilterId: TotalBookingSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true, shouldValidate: true },
    );

    if (subFilterId === TOTAL_BOOKING_SUB_FILTER_IDS.activity) {
      setValue("activity", ACTIVITY_DEFAULT_VALUE, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
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
                  label:
                    subFilterModule.id === TOTAL_BOOKING_SUB_FILTER_IDS.activity
                      ? t("filters.22.subFilters.activity")
                      : t("filters.22.subFilters.subFilterFallback", {
                          subFilterId: subFilterModule.id,
                        }),
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
