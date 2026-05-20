import { useSuspenseQueries } from "@tanstack/react-query";
import { useId, useMemo } from "react";

import { TagRuleKind } from "@bsport/api-cdp/smartlist";
import {
  type Tag,
  type TagGroup,
  fetchTagGroupsQueryOptions,
  fetchTagsQueryOptions,
} from "@bsport/api-cdp/tags";
import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
import {
  Body,
  Chip,
  Select,
  type SelectProps,
} from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { type AutomationTagRuleFormData } from "./types";

type AutomationTagRuleFormProps = Omit<
  ControlledFormProps<AutomationTagRuleFormData>,
  "children"
>;

function combine([tags, tagGroups]: [
  { data: Array<Tag> },
  { data: Array<TagGroup> },
]) {
  const tagsById = tags.data.reduce<{ [id: string]: Tag }>((result, tag) => {
    result[tag.id] = tag;
    return result;
  }, {});

  const groupsById = tagGroups.data.reduce<{ [id: string]: TagGroup }>(
    (result, group) => {
      result[group.id] = group;
      return result;
    },
    {},
  );

  return {
    tagsById,
    groupsById,
  } as const;
}

export const AutomationTagRuleForm = ({
  id,
  onSubmit,
  ...methods
}: AutomationTagRuleFormProps) => {
  const { t } = useTranslation("details");
  const { tagsById, groupsById } = useSuspenseQueries({
    queries: [fetchTagsQueryOptions(fetch), fetchTagGroupsQueryOptions(fetch)],
    combine,
  });

  const formIdPrefix = useId();
  const ids = {
    fields: {
      kind: `${formIdPrefix}-field-kind`,
      tag: `${formIdPrefix}-field-tag`,
    },
  };

  const selectedKind = methods.watch("kind");
  const selectedTagId = methods.watch("tagIds")[0];

  const selectedTag = tagsById[selectedTagId];

  const selectedTagLabel = useMemo(() => {
    if (!selectedTag) {
      return null;
    }

    const tagGroupName = groupsById[selectedTag?.group]?.name;

    return tagGroupName
      ? `${tagGroupName}: ${selectedTag.name}`
      : selectedTag.name;
  }, [selectedTag, groupsById]);

  const descriptionByKind: Record<TagRuleKind, string> = {
    [TagRuleKind.TAG_ON_JOIN_AND_UNTAG_ON_LEFT]: t(
      "actions.createAutomationModal.tagRuleForm.trigger.descriptions.present",
    ),
    [TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG]: t(
      "actions.createAutomationModal.tagRuleForm.trigger.descriptions.enter",
    ),
    [TagRuleKind.TAG_ON_LEFT]: t(
      "actions.createAutomationModal.tagRuleForm.trigger.descriptions.leave",
    ),
  };

  const triggerOptions: SelectProps["items"] = [
    {
      id: String(TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG),
      label: t(
        "actions.createAutomationModal.tagRuleForm.trigger.options.join",
      ),
      iconLeft: "log-in-03",
    },
    {
      id: String(TagRuleKind.TAG_ON_LEFT),
      label: t(
        "actions.createAutomationModal.tagRuleForm.trigger.options.leave",
      ),
      iconLeft: "log-out-01",
    },
    {
      id: String(TagRuleKind.TAG_ON_JOIN_AND_UNTAG_ON_LEFT),
      label: t(
        "actions.createAutomationModal.tagRuleForm.trigger.options.present",
      ),
      iconLeft: "users-check",
    },
  ];

  return (
    <ControlledForm
      id={id}
      className="flex flex-col gap-sm"
      onSubmit={onSubmit}
      {...methods}
    >
      <FormField<AutomationTagRuleFormData, "kind", SelectProps>
        name="kind"
        mapProps={({ field, form }) => ({
          value: String(field.value),
          onChange: (nextValue: string) => {
            const parsedValue = Number(nextValue);

            if (
              parsedValue !== TagRuleKind.TAG_ON_JOIN_AND_UNTAG_ON_LEFT &&
              parsedValue !== TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG &&
              parsedValue !== TagRuleKind.TAG_ON_LEFT
            ) {
              return;
            }

            form.setValue("kind", parsedValue, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        })}
      >
        <Select
          id={ids.fields.kind}
          label={t("actions.createAutomationModal.tagRuleForm.trigger.label")}
          required
          fullWidth
          items={triggerOptions}
        />
      </FormField>

      <Body size="sm" color="weak">
        {descriptionByKind[selectedKind]}
      </Body>

      <div className="flex flex-col gap-2xs">
        <Body htmlVariant="p" size="md" weight="strong">
          {t("actions.createAutomationModal.tagRuleForm.tag.label")}
        </Body>
        <TagSelector<AutomationTagRuleFormData>
          id={ids.fields.tag}
          fieldName="tagIds"
          placeholder={t(
            "actions.createAutomationModal.tagRuleForm.tag.placeholder",
          )}
          fetch={fetch}
          clearOnSelect
          multiSelect={false}
          withSelectedInBase={false}
          loadingMessage={t(
            "actions.createAutomationModal.tagRuleForm.tag.loading",
          )}
        />
        {selectedTag && selectedTagLabel ? (
          <div className="mt-2 flex flex-wrap gap-2xs">
            <Chip
              dismissible
              type="weak"
              color="default"
              customColor={selectedTag.color}
              size="lg"
              rounded="lg"
              label={selectedTagLabel}
              onClick={() => {
                methods.setValue("tagIds", [], {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </div>
        ) : null}
      </div>
    </ControlledForm>
  );
};
