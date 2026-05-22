import { useSuspenseQueries } from "@tanstack/react-query";
import { useId } from "react";

import {
  fetchTagGroupsQueryOptions,
  fetchTagsQueryOptions,
} from "@bsport/api-cdp/tags";
import { useFormController } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Divider,
  Toggle,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useDeleteTagFilterMutation } from "#src/api/use-delete-tag-filter-mutation";
import { useUpsertTagFilterMutation } from "#src/api/use-upsert-tag-filter-mutation";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { buildTagFilterDirtyPatch } from "../mappers/build-dirty-patch";
import { createTagFilterPayload } from "../mappers/form-value-to-create-payload";
import { tagFilterFormSchema } from "../schema";
import type {
  TagFilterCardProps,
  TagFilterTagCatalogEntry,
  TagFilterTagGroupCatalogEntry,
} from "../types";
import { TagFilterCardSkeleton } from "./tag-filter-card-skeleton";
import { TagFilterItemsSearch } from "./tag-filter-items-search";

export const TagFilterCard = ({
  smartlistId,
  filterValue,
  onDeleteUnsavedFilter,
  onSaveSuccess,
}: TagFilterCardProps) => {
  const { t } = useTranslation("filters");
  const baseId = useId();
  const fieldIds = {
    includeToggle: `${baseId}-include-toggle`,
    excludeToggle: `${baseId}-exclude-toggle`,
    includeSearch: `${baseId}-include-tags`,
    excludeSearch: `${baseId}-exclude-tags`,
  };

  const [tagsQuery, tagGroupsQuery] = useSuspenseQueries({
    queries: [fetchTagsQueryOptions(fetch), fetchTagGroupsQueryOptions(fetch)],
  });

  const methods = useFormController({
    mode: "onBlur",
    schema: tagFilterFormSchema,
    defaultValues: filterValue,
  });
  const watchedValue = methods.watch();
  const { errors, dirtyFields } = methods.formState;

  const tagRequirementErrorMessage =
    errors.tagsIncluded?.message === "atLeastOneTagRequired"
      ? t("filters.11.validation.atLeastOneTagRequired")
      : undefined;

  const { upsertTagFilterMutate, isLoading: isSaving } =
    useUpsertTagFilterMutation(smartlistId, {
      onSuccess: () => {
        toast({
          status: "default",
          icon: "check-circle",
          title: t("filters.11.toasts.saveSuccess"),
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
          title: error.message || t("filters.11.toasts.saveError"),
          buttonIcon: "x-close",
        });
      },
    });

  const { deleteTagFilterMutate, isLoading: isDeleting } =
    useDeleteTagFilterMutation(smartlistId, {
      onError: (error) => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: error.message || t("filters.11.toasts.deleteError"),
          buttonIcon: "x-close",
        });
      },
    });

  const isDirty = Object.keys(dirtyFields).length > 0;

  const handleSave = methods.handleSubmit(
    (value) => {
      if (!value.id) {
        upsertTagFilterMutate({
          createPayload: createTagFilterPayload(value),
        });
        return;
      }

      const dirtyPatchPayload = buildTagFilterDirtyPatch(value, filterValue);
      if (Object.keys(dirtyPatchPayload).length === 0) {
        return;
      }

      upsertTagFilterMutate({
        filterId: value.id,
        updatePayload: dirtyPatchPayload,
      });
    },
    () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("filters.11.toasts.invalidFilter"),
        buttonIcon: "x-close",
      });
    },
  );

  const handleDelete = () => {
    if (!watchedValue.id) {
      onDeleteUnsavedFilter?.();
      return;
    }

    deleteTagFilterMutate(watchedValue.id);
  };

  const setIncludeSectionEnabled = (nextEnabled: boolean) => {
    methods.setValue("includeSectionEnabled", nextEnabled, {
      shouldDirty: true,
    });
    if (!nextEnabled) {
      methods.setValue("tagsIncluded", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    void methods.trigger();
  };

  const setExcludeSectionEnabled = (nextEnabled: boolean) => {
    methods.setValue("excludeSectionEnabled", nextEnabled, {
      shouldDirty: true,
    });
    if (!nextEnabled) {
      methods.setValue("tagsExcluded", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    void methods.trigger();
  };

  const tags: TagFilterTagCatalogEntry[] = tagsQuery.data ?? [];
  const tagGroups: TagFilterTagGroupCatalogEntry[] = tagGroupsQuery.data ?? [];

  return (
    <QueryBoundary loadingFallback={<TagFilterCardSkeleton />}>
      <Card className="w-full" padding="default">
        <div className="flex flex-col gap-sm">
          <div className="flex items-start justify-between gap-sm">
            <Body size="lg" weight="stronger">
              {t("filters.11.title")}
            </Body>
            <Button
              kind="icon-button"
              icon="trash-01"
              size="md"
              label={t("filters.11.actions.deleteFilter")}
              intent="flat"
              color="default"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              loading={isDeleting}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <div className="flex items-start justify-between gap-sm">
              <Toggle
                id={fieldIds.includeToggle}
                direction="end"
                label={t("filters.11.include.title")}
                helperText={t("filters.11.include.description")}
                checked={watchedValue.includeSectionEnabled}
                disabled={isSaving || isDeleting}
                onToggleChange={setIncludeSectionEnabled}
              />
            </div>
            {watchedValue.includeSectionEnabled ? (
              <TagFilterItemsSearch
                id={fieldIds.includeSearch}
                tags={tags}
                tagGroups={tagGroups}
                value={watchedValue.tagsIncluded}
                onChange={(nextIds) => {
                  methods.setValue("tagsIncluded", nextIds, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                disabled={isSaving || isDeleting}
                searchPlaceholder={t("filters.11.fields.searchPlaceholder")}
                emptySelectionLabel={t("filters.11.fields.emptySelection")}
              />
            ) : null}
          </div>

          <Divider />

          <div className="flex flex-col gap-xs">
            <div className="flex items-start justify-between gap-sm">
              <Toggle
                id={fieldIds.excludeToggle}
                direction="end"
                label={t("filters.11.exclude.title")}
                helperText={t("filters.11.exclude.description")}
                checked={watchedValue.excludeSectionEnabled}
                disabled={isSaving || isDeleting}
                onToggleChange={setExcludeSectionEnabled}
              />
            </div>
            {watchedValue.excludeSectionEnabled ? (
              <TagFilterItemsSearch
                id={fieldIds.excludeSearch}
                tags={tags}
                tagGroups={tagGroups}
                value={watchedValue.tagsExcluded}
                onChange={(nextIds) => {
                  methods.setValue("tagsExcluded", nextIds, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                disabled={isSaving || isDeleting}
                searchPlaceholder={t("filters.11.fields.searchPlaceholder")}
                emptySelectionLabel={t("filters.11.fields.emptySelection")}
              />
            ) : null}
          </div>

          {tagRequirementErrorMessage ? (
            <Body size="sm" color="critical">
              {tagRequirementErrorMessage}
            </Body>
          ) : null}
          <div className="flex justify-end">
            <Button
              label={t("filters.11.actions.save")}
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
    </QueryBoundary>
  );
};
