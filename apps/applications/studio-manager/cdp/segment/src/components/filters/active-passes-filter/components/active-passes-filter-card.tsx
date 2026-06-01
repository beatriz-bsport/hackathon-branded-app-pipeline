import { useId } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { useFormController } from "@bsport/form";
import {
  Alert,
  Body,
  Button,
  Card,
  Divider,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useAppointmentPassesQuery } from "#src/api/use-appointment-passes-query";
import { useDeleteActivePassesFilterMutation } from "#src/api/use-delete-active-passes-filter-mutation";
import { usePassesQuery } from "#src/api/use-passes-query";
import { useUpsertActivePassesFilterMutation } from "#src/api/use-upsert-active-passes-filter-mutation";
import { PassSelectorWithToggle } from "#src/components/filters/active-passes-filter/pass-selector-with-toggle";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useTranslation } from "#src/utils/i18n";

import { isActivePassesComparatorType } from "../constants";
import { buildActivePassesFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createActivePassesPayload } from "../mappers/form-value-to-create-payload";
import { activePassesFilterSchema } from "../schema";
import type {
  ActivePassesFilterCardProps,
  ActivePassesPassOption,
} from "../types";

/**
 * Formats a pass option price into a localized currency string.
 */
const getFormattedPassPrice = (
  price: ActivePassesPassOption["price"],
): string => {
  if (price === undefined) return getCurrencyDisplayWithPrice(0);
  if (typeof price === "number") return getCurrencyDisplayWithPrice(price);
  if (typeof price === "string")
    return getCurrencyDisplayWithPrice(parseFloat(price));
  return getCurrencyDisplayWithPrice(price.parsedValue);
};

/**
 * Converts pass catalog options into `ItemsSearchFilterOption` items.
 */
const toSearchOptions = (
  options: ActivePassesPassOption[],
  creditsLabel: string,
) =>
  options.map((option) => ({
    id: option.id,
    name: option.name,
    description:
      option.credits === null
        ? creditsLabel
        : `${option.credits} ${creditsLabel} - ${getFormattedPassPrice(option.price)}`,
  }));

/**
 * Active passes filter card (filter identifier 27).
 * Allows the user to set a count comparator for currently active group/private passes
 * and optionally narrow by specific pass definitions.
 */
export const ActivePassesFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: ActivePassesFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();

  const { data: passData } = usePassesQuery("");
  const { data: appointmentPassData } = useAppointmentPassesQuery("");

  const passOptions: ActivePassesPassOption[] = passData?.results ?? [];
  const appointmentPassOptions: ActivePassesPassOption[] =
    appointmentPassData?.results ?? [];

  const fieldIds = {
    comparator: `${baseId}-comparator`,
    paymentPacksSelector: `${baseId}-payment-packs`,
    privatePassesSelector: `${baseId}-private-passes`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: activePassesFilterSchema,
    defaultValues: filterValue,
  });

  const watchedValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;

  const { upsertActivePassesFilterMutate, isLoading: isSaving } =
    useUpsertActivePassesFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.27.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        const newValues = methods.getValues();
        methods.reset(newValues);
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.27.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteActivePassesFilterMutate, isLoading: isDeleting } =
    useDeleteActivePassesFilterMutation(smartlistId, {
      onError: (error: Error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.27.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleDelete = () => {
    if (!watchedValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }
    deleteActivePassesFilterMutate(watchedValue.id);
  };

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertActivePassesFilterMutate({
          createPayload: createActivePassesPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildActivePassesFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertActivePassesFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.27.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const comparatorValue: NumericComparatorFilterValue = {
    operator: watchedValue.comparatorType,
    firstValue: watchedValue.comparatorValue,
    secondValue: watchedValue.comparatorValueSecond,
  };

  const creditsLabel = t("filters.27.fields.sessionsSuffix");
  const passSearchOptions = toSearchOptions(passOptions, creditsLabel);
  const appointmentPassSearchOptions = toSearchOptions(
    appointmentPassOptions,
    creditsLabel,
  );

  const paymentPacksError = errors.paymentPacksSelector?.selectedIds?.message
    ? String(errors.paymentPacksSelector.selectedIds.message)
    : errors.paymentPacksSelector?.enabled?.message
      ? String(errors.paymentPacksSelector.enabled.message)
      : undefined;

  const privatePassesError = errors.privatePassesSelector?.selectedIds?.message
    ? String(errors.privatePassesSelector.selectedIds.message)
    : undefined;

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between gap-sm">
          <Body size="lg" weight="stronger">
            {t("filters.27.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.27.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <NumericComparatorFilter
          id={fieldIds.comparator}
          value={comparatorValue}
          suffix={t("filters.27.fields.countSuffix")}
          errors={{
            operator: errors.comparatorType?.message
              ? String(errors.comparatorType.message)
              : undefined,
            firstValue: errors.comparatorValue?.message
              ? String(errors.comparatorValue.message)
              : undefined,
            secondValue: errors.comparatorValueSecond?.message
              ? String(errors.comparatorValueSecond.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            if (!isActivePassesComparatorType(nextValue.operator)) {
              return;
            }
            methods.setValue("comparatorType", nextValue.operator, {
              shouldDirty: true,
            });
            methods.setValue("comparatorValue", nextValue.firstValue ?? 0, {
              shouldDirty: true,
              shouldValidate: true,
            });
            methods.setValue(
              "comparatorValueSecond",
              nextValue.operator === NUMERIC_COMPARATOR_OPERATORS.between
                ? nextValue.secondValue
                : null,
              { shouldDirty: true, shouldValidate: true },
            );
          }}
        />

        <Alert status="info" type="weak">
          {t("filters.27.info.countExplanation")}
        </Alert>

        <Body
          size="sm"
          weight="stronger"
          color="weak"
          className="uppercase tracking-wide"
        >
          {t("filters.27.fields.filterSpecifications")}
        </Body>

        <PassSelectorWithToggle
          id={fieldIds.paymentPacksSelector}
          label={t("filters.27.paymentPacks.title")}
          helperText={t("filters.27.paymentPacks.description")}
          options={passSearchOptions}
          value={watchedValue.paymentPacksSelector}
          onChange={(nextValue) => {
            methods.setValue("paymentPacksSelector", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          disabled={isSaving || isDeleting}
          errorText={paymentPacksError}
          searchPlaceholder={t("filters.27.paymentPacks.searchPlaceholder")}
          emptySelectionLabel={t("filters.27.paymentPacks.emptySelection")}
        />

        <Divider />

        <PassSelectorWithToggle
          id={fieldIds.privatePassesSelector}
          label={t("filters.27.privatePasses.title")}
          helperText={t("filters.27.privatePasses.description")}
          options={appointmentPassSearchOptions}
          value={watchedValue.privatePassesSelector}
          onChange={(nextValue) => {
            methods.setValue("privatePassesSelector", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          disabled={isSaving || isDeleting}
          errorText={privatePassesError}
          searchPlaceholder={t("filters.27.privatePasses.searchPlaceholder")}
          emptySelectionLabel={t("filters.27.privatePasses.emptySelection")}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.27.actions.save")}
            size="sm"
            color="main"
            intent="default"
            iconLeft="check"
            loading={isSaving}
            disabled={isSaving || isDeleting || !isDirty}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
