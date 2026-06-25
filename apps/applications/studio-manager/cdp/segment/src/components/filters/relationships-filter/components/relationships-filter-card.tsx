import { useEffect, useId, useRef } from "react";

import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";
import { useFormController } from "@bsport/form";
import {
  Alert,
  Body,
  Button,
  Card,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useDeleteRelationshipsFilterMutation } from "#src/api/use-delete-relationships-filter-mutation";
import { useUpsertRelationshipsFilterMutation } from "#src/api/use-upsert-relationships-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";
import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";
import { useTranslation } from "#src/utils/i18n";

import {
  isRelationshipsComparatorOperator,
  relationshipsComparatorToOperatorMap,
  relationshipsOperatorToComparatorMap,
} from "../constants";
import { buildRelationshipsFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { relationshipsFilterSchema } from "../schema";
import type { RelationshipsFilterCardProps } from "../types";
import { buildDeactivateDeprecatedSubFiltersPatch } from "../utils/deprecated-sub-filters";

/**
 * Relationships filter card (filter identifier 105).
 * Renders the primary relationship count comparator.
 */
export const RelationshipsFilterCard = ({
  smartlistId,
  filterValue,
  cleanDraftComponent,
}: RelationshipsFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const hasTriggeredDeprecatedSubFiltersDeactivation = useRef(false);
  const fieldIds = {
    comparator: `${baseId}-comparator`,
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: relationshipsFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  const isSavedFilter = Boolean(watchedFilterValue.id);
  const showDeprecatedSubFiltersAlert = Boolean(
    watchedFilterValue.hadDeprecatedSubFiltersAtHydration,
  );

  const { upsertRelationshipsFilterMutate, isLoading: isSaving } =
    useUpsertRelationshipsFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.105.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        const newValues = methods.getValues();
        methods.reset(newValues);
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.105.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteRelationshipsFilterMutate, isLoading: isDeleting } =
    useDeleteRelationshipsFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.105.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  useEffect(() => {
    if (
      !watchedFilterValue.id ||
      !watchedFilterValue.hadDeprecatedSubFiltersAtHydration ||
      hasTriggeredDeprecatedSubFiltersDeactivation.current
    ) {
      return;
    }

    hasTriggeredDeprecatedSubFiltersDeactivation.current = true;
    upsertRelationshipsFilterMutate({
      filterId: watchedFilterValue.id,
      updatePayload: buildDeactivateDeprecatedSubFiltersPatch(),
    });
  }, [
    upsertRelationshipsFilterMutate,
    watchedFilterValue.hadDeprecatedSubFiltersAtHydration,
    watchedFilterValue.id,
  ]);

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertRelationshipsFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildRelationshipsFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertRelationshipsFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.105.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteRelationshipsFilterMutate(watchedFilterValue.id);
  };

  const comparatorOperator =
    relationshipsComparatorToOperatorMap[
      watchedFilterValue.comparator_number_relations
    ] ??
    relationshipsComparatorToOperatorMap[SMARTLIST_RELATIONS_COMPARATOR.GTE];

  const comparatorValue: NumericComparatorFilterValue = {
    operator: comparatorOperator,
    firstValue: watchedFilterValue.value_number_relations,
    secondValue: watchedFilterValue.value_number_relations_second,
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.105.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.105.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        {showDeprecatedSubFiltersAlert ? (
          <Alert status="warning" type="weak">
            {t("filters.105.alerts.deprecatedSubFiltersDeactivated")}
          </Alert>
        ) : null}

        <NumericComparatorFilter
          id={fieldIds.comparator}
          value={comparatorValue}
          suffix={t("filters.105.fields.relationshipsSuffix", {
            count: watchedFilterValue.value_number_relations,
          })}
          errors={{
            operator: errors.comparator_number_relations?.message
              ? String(errors.comparator_number_relations.message)
              : undefined,
            firstValue: errors.value_number_relations?.message
              ? String(errors.value_number_relations.message)
              : undefined,
            secondValue: errors.value_number_relations_second?.message
              ? String(errors.value_number_relations_second.message)
              : undefined,
          }}
          onChange={(nextValue) => {
            if (!isRelationshipsComparatorOperator(nextValue.operator)) {
              return;
            }

            const nextComparator =
              relationshipsOperatorToComparatorMap[nextValue.operator];
            if (
              nextComparator !== watchedFilterValue.comparator_number_relations
            ) {
              methods.setValue("comparator_number_relations", nextComparator, {
                shouldDirty: true,
              });
            }

            const nextFirstValue = nextValue.firstValue ?? 0;
            if (nextFirstValue !== watchedFilterValue.value_number_relations) {
              methods.setValue("value_number_relations", nextFirstValue, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }

            if (nextValue.operator === NUMERIC_COMPARATOR_OPERATORS.between) {
              const nextSecondValue = nextValue.secondValue ?? 0;
              if (
                nextSecondValue !==
                watchedFilterValue.value_number_relations_second
              ) {
                methods.setValue(
                  "value_number_relations_second",
                  nextSecondValue,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              }
            }
          }}
        />

        <FilterCardSaveButton
          isSavedFilter={isSavedFilter}
          isDirty={isDirty}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onSave={handleSave}
        />
      </div>
    </Card>
  );
};
