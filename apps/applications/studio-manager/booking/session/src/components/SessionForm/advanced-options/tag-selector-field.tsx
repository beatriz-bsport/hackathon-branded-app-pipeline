import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Autocomplete,
  AutocompleteProps,
  ColorIndicator,
  MenuOption,
} from "@bsport/kaizen-primitive-core";

import { useGroupedTags } from "#src/hooks/tags/use-grouped-tags";
import { SessionCreationFormAdvancedOptionsData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { Label } from "../label";

export type TagSelectorProps = {
  id: string;
  label: string;
  name: "whitelist_tags" | "blacklist_tags";
};

export const TagSelectorField: FC<TagSelectorProps> = ({ id, label, name }) => {
  const { t } = useTranslation("sessionCreation");
  const { watch } = useFormContext<SessionCreationFormAdvancedOptionsData>();

  const groupedTags = useGroupedTags();

  // Get the opposite field's selected tags to exclude them
  const oppositeFieldName =
    name === "whitelist_tags" ? "blacklist_tags" : "whitelist_tags";
  const excludedTagIds = watch(oppositeFieldName);
  const excludedTagIdsSet = new Set(excludedTagIds ?? []);

  const items: { title: string; options: MenuOption[] }[] = groupedTags
    .map((group) => ({
      title: group.name,
      options: group.tags
        .filter((tag) => !excludedTagIdsSet.has(tag.id))
        .map((tag) => ({
          label: tag.name,
          id: String(tag.id),
          rightSlot: (
            <ColorIndicator color={tag.color} size="sm" type="block" />
          ),
        })),
    }))
    .filter((group) => group.options.length > 0);

  return (
    <div className="flex flex-col gap-xs">
      <Label text={label} isRequired={false} />
      <FormField<
        SessionCreationFormAdvancedOptionsData,
        "whitelist_tags" | "blacklist_tags",
        AutocompleteProps
      >
        name={name}
        mapProps={({ form: { setValue, formState } }) => ({
          defaultSelectedIds: formState.defaultValues?.[name]?.map(String),
          onSelect: (values: string[]) => {
            setValue(
              name,
              values.map((stringId) => Number(stringId)),
              { shouldDirty: true, shouldValidate: true },
            );
          },
        })}
      >
        <Autocomplete
          key={id}
          className="w-full max-w-component-select"
          fullWidth
          multiSelect
          popoverPlacement="bottom-right"
          items={items}
          textfieldProps={{
            placeholder: t(
              "addSessionModal.steps.advancedOptions.tags.addTags",
            ),
            iconRight: "chevron-down",
            id: `${id}-textfield`,
          }}
        />
      </FormField>
    </div>
  );
};
