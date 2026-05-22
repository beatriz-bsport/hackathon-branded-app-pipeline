import { useId } from "react";

import { useFormController } from "@bsport/form";
import { Body, Button, Card, toast } from "@bsport/kaizen-primitive-core";

import { useDeleteMemberDateJoinedFilterMutation } from "#src/api/use-delete-member-date-joined-filter-mutation";
import { useUpsertMemberDateJoinedFilterMutation } from "#src/api/use-upsert-member-date-joined-filter-mutation";
import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

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
  onDeleteUnsavedFilter,
  onSaveSuccess,
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
  const { errors, dirtyFields } = methods.formState;

  const { upsertMemberDateJoinedFilterMutate, isLoading: isSaving } =
    useUpsertMemberDateJoinedFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.18.toasts.saveSuccess"),
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

  const isDirty = Object.keys(dirtyFields).length > 0;

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
      onDeleteUnsavedFilter?.();
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
            absoluteFromDate: errors.signUpDate?.absolute?.fromDate?.message
              ? String(errors.signUpDate.absolute.fromDate.message)
              : undefined,
            absoluteToDate: errors.signUpDate?.absolute?.toDate?.message
              ? String(errors.signUpDate.absolute.toDate.message)
              : undefined,
            relativeFirstDays: errors.signUpDate?.relative?.firstDays?.message
              ? String(errors.signUpDate.relative.firstDays.message)
              : undefined,
            relativeSecondDays: errors.signUpDate?.relative?.secondDays?.message
              ? String(errors.signUpDate.relative.secondDays.message)
              : undefined,
          }}
        />

        <div className="flex justify-end">
          <Button
            label={t("filters.18.actions.save")}
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || isDeleting || !isDirty}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
