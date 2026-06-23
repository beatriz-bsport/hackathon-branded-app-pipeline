import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteMemberDateJoinedFilterMutation } from "#src/api/use-delete-member-date-joined-filter-mutation";
import { useUpsertMemberDateJoinedFilterMutation } from "#src/api/use-upsert-member-date-joined-filter-mutation";
import { FilterCardSaveButton } from "#src/components/filters/shared/filter-card-save-button";
import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapMemberDateJoinedFilterToFormValue } from "../mappers/api-to-form-value";
import { buildDirtyPatchPayload } from "../mappers/build-dirty-patch";
import { toCreatePayload } from "../mappers/form-value-to-create-payload";
import { memberSignUpDateFilterSchema } from "../schema";
import type { MemberSignUpDateFilterCardProps } from "../types";

/**
 * Single member sign-up date filter card. Reuses the shared date primitive with
 * no sub-filters; create/update/delete follow the smartlist filter contract.
 */
export const MemberSignUpDateFilterCard = ({
  smartlistId,
  filterValue,
  cleanDraftComponent,
}: MemberSignUpDateFilterCardProps) => {
  const baseId = useId();
  const signUpDateFieldId = `${baseId}-sign-up-date`;
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: memberSignUpDateFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);
  const isSavedFilter = Boolean(watchedFilterValue.id);

  const { upsertMemberDateJoinedFilterMutate, isLoading: isSaving } =
    useUpsertMemberDateJoinedFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.18.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapMemberDateJoinedFilterToFormValue(savedFilter));
        cleanDraftComponent?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.18.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteMemberDateJoinedFilterMutate, isLoading: isDeleting } =
    useDeleteMemberDateJoinedFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.18.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertMemberDateJoinedFilterMutate({
          createPayload: toCreatePayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildDirtyPatchPayload(dirtyFields, value);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertMemberDateJoinedFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.18.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      cleanDraftComponent?.();
      return;
    }

    deleteMemberDateJoinedFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.18.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.18.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        <DateFilter
          id={signUpDateFieldId}
          value={watchedFilterValue.signUpDate}
          onChange={(nextValue) =>
            methods.setValue("signUpDate", nextValue, { shouldDirty: true })
          }
          disabled={isSaving || isDeleting}
          errors={{
            absoluteFromDate:
              errors.signUpDate?.absolute?.fromDate?.message?.toString(),
            absoluteToDate:
              errors.signUpDate?.absolute?.toDate?.message?.toString(),
            relativeFirstDays:
              errors.signUpDate?.relative?.firstDays?.message?.toString(),
            relativeSecondDays:
              errors.signUpDate?.relative?.secondDays?.message?.toString(),
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
