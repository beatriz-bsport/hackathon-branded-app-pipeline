import { useId } from "react";

import { useFormController } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Divider,
  Toggle,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useDeleteMarketingNotificationFilterMutation } from "#src/api/use-delete-marketing-notification-filter-mutation";
import { useUpsertMarketingNotificationFilterMutation } from "#src/api/use-upsert-marketing-notification-filter-mutation";
import { useRegisterSavedFilterDraft } from "#src/hooks/use-register-saved-filter-draft";
import { useTranslation } from "#src/utils/i18n";

import { mapMarketingNotificationFilterToFormValue } from "../mappers/api-to-form-value";
import { buildMarketingNotificationFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createMarketingNotificationFilterPayload } from "../mappers/form-value-to-create-payload";
import { marketingNotificationFilterSchema } from "../schema";
import type { MarketingNotificationFilterCardProps } from "../types";
import { CombineModeSelect } from "./combine-mode-select";
import { ConsentRadioGroup } from "./consent-radio-group";

/**
 * Single marketing notification consent filter card. Owns its form lifecycle
 * (create / dirty patch / delete) and delegates channel controls to child fields.
 */
export const MarketingNotificationFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: MarketingNotificationFilterCardProps) => {
  const baseId = useId();
  const fieldIds = {
    combineMode: `${baseId}-combine-mode`,
    smsToggle: `${baseId}-sms-toggle`,
    smsConsent: `${baseId}-sms-consent`,
    emailToggle: `${baseId}-email-toggle`,
    emailConsent: `${baseId}-email-consent`,
  };
  const { t } = useTranslation("filters");

  const methods = useFormController({
    mode: "onBlur",
    schema: marketingNotificationFilterSchema,
    defaultValues: filterValue,
  });
  const watchedFilterValue = methods.watch();
  const { errors, dirtyFields, isDirty } = methods.formState;
  useRegisterSavedFilterDraft(watchedFilterValue.id, isDirty);

  const { upsertMarketingNotificationFilterMutate, isLoading: isSaving } =
    useUpsertMarketingNotificationFilterMutation(smartlistId, {
      onSuccess: (savedFilter) => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.103.toasts.saveSuccess"),
          buttonIcon: "x-close",
        });
        methods.reset(mapMarketingNotificationFilterToFormValue(savedFilter));
        onSaveSuccess?.();
      },
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.103.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteMarketingNotificationFilterMutate, isLoading: isDeleting } =
    useDeleteMarketingNotificationFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.103.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isSavedFilter = Boolean(watchedFilterValue.id);
  const showCombineModeSelect =
    watchedFilterValue.smsFilterActive && watchedFilterValue.emailFilterActive;

  const channelValidationError =
    errors.smsFilterActive?.message === "atLeastOneChannelRequired"
      ? t("filters.103.validation.atLeastOneChannelRequired")
      : undefined;

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertMarketingNotificationFilterMutate({
          createPayload: createMarketingNotificationFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildMarketingNotificationFilterDirtyPatch(
        dirtyFields,
        value,
      );
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertMarketingNotificationFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.103.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedFilterValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteMarketingNotificationFilterMutate(watchedFilterValue.id);
  };

  return (
    <Card className="w-full" padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex items-start justify-between">
          <Body size="lg" weight="stronger">
            {t("filters.103.title")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="md"
            label={t("filters.103.actions.deleteFilter")}
            intent="flat"
            color="default"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            loading={isDeleting}
          />
        </div>

        {showCombineModeSelect ? (
          <CombineModeSelect
            id={fieldIds.combineMode}
            value={watchedFilterValue.combineMode}
            disabled={isSaving || isDeleting}
            onChange={(nextValue) =>
              methods.setValue("combineMode", nextValue, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        ) : null}

        <div className="flex flex-col gap-xs">
          <Toggle
            id={fieldIds.smsToggle}
            direction="end"
            label={t("filters.103.fields.sms.toggle")}
            helperText={t("filters.103.fields.sms.description")}
            checked={watchedFilterValue.smsFilterActive}
            disabled={isSaving || isDeleting}
            onToggleChange={(nextActive) =>
              methods.setValue("smsFilterActive", nextActive, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {watchedFilterValue.smsFilterActive ? (
            <ConsentRadioGroup
              id={fieldIds.smsConsent}
              value={watchedFilterValue.smsConsent}
              disabled={isSaving || isDeleting}
              onChange={(nextValue) =>
                methods.setValue("smsConsent", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          ) : null}
        </div>

        <Divider />

        <div className="flex flex-col gap-xs">
          <Toggle
            id={fieldIds.emailToggle}
            direction="end"
            label={t("filters.103.fields.email.toggle")}
            helperText={t("filters.103.fields.email.description")}
            checked={watchedFilterValue.emailFilterActive}
            disabled={isSaving || isDeleting}
            onToggleChange={(nextActive) =>
              methods.setValue("emailFilterActive", nextActive, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {watchedFilterValue.emailFilterActive ? (
            <ConsentRadioGroup
              id={fieldIds.emailConsent}
              value={watchedFilterValue.emailConsent}
              disabled={isSaving || isDeleting}
              onChange={(nextValue) =>
                methods.setValue("emailConsent", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          ) : null}
        </div>

        {channelValidationError ? (
          <Body size="sm" color="critical">
            {channelValidationError}
          </Body>
        ) : null}

        <div className="flex justify-end">
          <Button
            label={
              isSavedFilter
                ? t("filters.103.actions.update")
                : t("filters.103.actions.save")
            }
            iconLeft="check"
            size="sm"
            color="main"
            intent="default"
            loading={isSaving}
            disabled={isSaving || isDeleting || (isSavedFilter && !isDirty)}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Card>
  );
};
