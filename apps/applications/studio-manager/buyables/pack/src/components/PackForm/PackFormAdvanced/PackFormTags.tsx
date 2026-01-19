import React, { useCallback, useMemo } from "react";

import { FormField } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
  Body,
  ColorIndicator,
  type MenuOption,
  Title,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";
import { useTags } from "#src/utils/stores-interface";

type PackFormTagsProps = {
  fieldIdPrefix: string;
};

export const PackFormTags: React.FC<PackFormTagsProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  const { tagGroups, tagIdToTagMap, tagIdToTagGroup } = useTags();

  const tagGroupOptions: Array<{ title: string; options: Array<MenuOption> }> =
    useMemo(() => {
      return tagGroups.map((tagGroup) => {
        return {
          title: tagGroup.name,
          options: tagGroup.tags
            .map((tagId) => {
              const tag = tagIdToTagMap[tagId];

              if (!tag) return null;

              return {
                id: String(tag.id),
                label: tag.name,
                rightSlot: (
                  <ColorIndicator color={tag.color} size="sm" type="block" />
                ),
              };
            })
            .filter((tag) => !!tag),
        };
      });
    }, [tagIdToTagMap, tagGroups]);

  /**
   * Custom toggling logic to apply in the Autocomplete
   */
  const onToggleItem = useCallback(
    ({
      prev,
      toggledItem,
    }: {
      prev: string[];
      toggledItem: string;
    }): string[] => {
      // Case 1: Item was present => unchecked it
      if (prev.includes(toggledItem)) {
        return prev.filter((id) => id !== toggledItem);
      }

      const tagGroup = tagIdToTagGroup[parseInt(toggledItem, 10)];

      // Case 2: Item is not in a group => check it
      if (!tagGroup) {
        return [...prev, toggledItem].sort();
      }

      // Case 3: Item is in a group => check it and uncheck other tags from same group
      return [
        ...prev.filter((id) => !tagGroup.tags.includes(parseInt(id, 10))),
        toggledItem,
      ].sort();
    },
    [tagIdToTagGroup],
  );

  return (
    <div>
      <Title htmlVariant="h5" weight="strong">
        {t("formFields.advancedSection.tagsSelector.title")}
      </Title>

      <Body weight="weak" size="sm" className="mb-xs">
        {t("formFields.advancedSection.tagsSelector.helperText")}
      </Body>

      <FormField<
        PackFormData,
        "tags_on_consumer_item_creation",
        AutocompleteProps
      >
        name="tags_on_consumer_item_creation"
        mapProps={({ defaultProps, form }) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { statusText: _, ...otherProps } = defaultProps;
          return {
            ...otherProps,
            onSelect: (values: string[]) => {
              form.setValue(
                "tags_on_consumer_item_creation",
                values.map((stringId) => parseInt(stringId, 10)),
                { shouldDirty: true },
              );
            },
            defaultSelectedIds: (
              form.formState.defaultValues?.tags_on_consumer_item_creation ?? []
            )
              .filter((id) => id !== undefined)
              .map((id) => id.toString())
              .sort(),
          };
        }}
      >
        <Autocomplete
          key={`${fieldIdPrefix}-tag-selector`}
          className="max-w-[320px]"
          multiSelect
          popoverPlacement="bottom-right"
          items={tagGroupOptions}
          textfieldProps={{
            id: `${fieldIdPrefix}-tag-selector-textfield`,
            placeholder: t(
              "formFields.advancedSection.tagsSelector.placeholder",
            ),
            iconRight: "chevron-down",
          }}
          searchMode="local"
          debounceValue={100}
          onToggleItem={onToggleItem}
          showSelectedItemsInBase
        />
      </FormField>
    </div>
  );
};
