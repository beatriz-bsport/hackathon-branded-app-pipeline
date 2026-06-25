import type { FieldErrors, UseFormSetValue } from "@bsport/form";
import { Body, Button, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";
import { useTranslation } from "#src/utils/i18n";

import { SubFiltersCardSections } from "../../shared/sub-filters-card-sections";
import {
  type PaymentMethodSubFilterField,
  type PaymentMethodSubFilterId,
  paymentMethodSubFilterFieldMap,
} from "../sub-filters/payment-method-sub-filter-id";
import { REGISTERED_PAYMENT_METHOD_SUB_FILTERS } from "../sub-filters/registry";
import type { PaymentMethodFilterFormValue } from "../types";

type PaymentMethodSubFiltersAreaProps = {
  fieldIds: Record<PaymentMethodSubFilterField, string>;
  watchedFilterValue: PaymentMethodFilterFormValue;
  errors: FieldErrors<PaymentMethodFilterFormValue>;
  setValue: UseFormSetValue<PaymentMethodFilterFormValue>;
};

/**
 * Renders the "filter specifications" region for the saved payment method filter.
 */
export const PaymentMethodSubFiltersArea = ({
  fieldIds,
  watchedFilterValue,
  errors,
  setValue,
}: PaymentMethodSubFiltersAreaProps) => {
  const { t } = useTranslation("filters");

  const availableSubFilters = REGISTERED_PAYMENT_METHOD_SUB_FILTERS.filter(
    (subFilterModule) =>
      !watchedFilterValue.subFilters.includes(subFilterModule.id),
  );

  const addSubFilter = (subFilterId: PaymentMethodSubFilterId) => {
    if (watchedFilterValue.subFilters.includes(subFilterId)) {
      return;
    }
    setValue("subFilters", [...watchedFilterValue.subFilters, subFilterId], {
      shouldDirty: true,
    });
  };

  const removeSubFilter = (subFilterId: PaymentMethodSubFilterId) => {
    setValue(
      "subFilters",
      watchedFilterValue.subFilters.filter((item) => item !== subFilterId),
      { shouldDirty: true },
    );
    const fieldToReset = paymentMethodSubFilterFieldMap[subFilterId];
    setValue(fieldToReset, createDefaultDateFilterValue(), {
      shouldDirty: true,
    });
  };

  const subFilterSections = watchedFilterValue.subFilters.flatMap(
    (subFilterId) => {
      const subFilterModule = REGISTERED_PAYMENT_METHOD_SUB_FILTERS.find(
        (registeredModule) => registeredModule.id === subFilterId,
      );
      if (!subFilterModule) {
        return [];
      }
      const Section = subFilterModule.Section;
      const sectionId =
        fieldIds[paymentMethodSubFilterFieldMap[subFilterId]] ??
        `${subFilterId}-section`;

      return [
        {
          key: sectionId,
          content: (
            <Section
              id={sectionId}
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
        {t("filters.600.fields.filterSpecifications")}
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
                label={t("filters.600.actions.addSubFilter")}
                onClick={() => setIsPopoverOpened(true)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content placement="bottom-left">
            {({ setIsPopoverOpened }) => (
              <Menu
                items={availableSubFilters.map((subFilterModule) => ({
                  id: subFilterModule.id,
                  label: t(
                    subFilterModule.labelKey as "filters.600.subFilters.expirationDate",
                  ),
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
