import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteReferredMemberFilterMutation } from "#src/api/use-delete-referred-member-filter-mutation";
import { useUpsertReferredMemberFilterMutation } from "#src/api/use-upsert-referred-member-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { defaultNumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/utils";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { isReferredStatusToApi } from "../constants";
import { mapReferredMemberFilterToFormValue } from "../mappers/api-to-form-value";
import { buildReferredMembersFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createReferredMembersFilterPayload } from "../mappers/form-value-to-create-payload";
import { referredMembersFilterSchema } from "../schema";
import type { ReferredMembersFilterCardProps } from "../types";
import { ReferredMembersSubFiltersArea } from "./referred-members-sub-filters-area";
import { ReferredStatusRadioGroup } from "./referred-status-radio-group";

/**
 * Single referred member filter card. Owns form lifecycle (create / patch / delete).
 */
export const ReferredMembersFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: ReferredMembersFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    referredStatus: `${baseId}-referred-status`,
    moneyObtained: `${baseId}-money-obtained`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: referredMembersFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertReferredMemberFilterMutate, isLoading: isSaving } =
    useUpsertReferredMemberFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.30.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapReferredMemberFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.30.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteReferredMemberFilterMutate, isLoading: isDeleting } =
    useDeleteReferredMemberFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.30.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);
  const isReferredMember = isReferredStatusToApi(
    watchedFilterValue.referredStatus,
  );

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertReferredMemberFilterMutate({
          createPayload: createReferredMembersFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildReferredMembersFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertReferredMemberFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.30.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteReferredMemberFilterMutate(watchedFilterValue.id);
  };

  const handleReferredStatusChange = (
    nextStatus: typeof watchedFilterValue.referredStatus,
  ) => {
    methods.setValue("referredStatus", nextStatus, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!isReferredStatusToApi(nextStatus)) {
      methods.setValue("subFilters", [], { shouldDirty: true });
      methods.setValue("moneyObtained", defaultNumericComparatorFilterValue, {
        shouldDirty: true,
      });
    }
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.30.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.30.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <ReferredStatusRadioGroup
          id={fieldIds.referredStatus}
          value={watchedFilterValue.referredStatus}
          disabled={isSaving || isDeleting}
          onChange={handleReferredStatusChange}
        />

        {isReferredMember ? (
          <ReferredMembersSubFiltersArea
            fieldIds={fieldIds}
            watchedFilterValue={watchedFilterValue}
            errors={errors}
            setValue={methods.setValue}
          />
        ) : null}

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
