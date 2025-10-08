import React, { useMemo } from "react";

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

  const { tagGroups, tagIdToTagMap } = useTags();

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

  return (
    <>
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
              );
            },
          };
        }}
      >
        <Autocomplete
          id={`${fieldIdPrefix}-tag-selector`}
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
        />
      </FormField>
    </>
  );
};
