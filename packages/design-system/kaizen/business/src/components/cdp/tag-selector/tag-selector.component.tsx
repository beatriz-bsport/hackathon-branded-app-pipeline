import type { ReactElement } from "react";

import type { TagGroup } from "@bsport/api-cdp/tags";
import type { Fetch } from "@bsport/fetch";
import { type FieldValues, FormField } from "@bsport/form";
import {
  AutocompleteControlled,
  type AutocompleteControlledProps,
} from "@bsport/kaizen-primitive-core";

import type { NumberListFieldPath } from "#src/utils/form-types";

import { useGroupedTagsQuery } from "../hooks/use-grouped-tags";
import { useTagOptions } from "../hooks/use-tags-options";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<AutocompleteControlledProps> = {
  debounceValue: 10,
  popoverPlacement: "bottom-right",
  withSelectedInBase: true,
  className: "max-w-component-select",
  searchMode: "local",
  withChips: true,
  fullWidth: true,
};

export type TagSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  placeholder: string;
  fetch: Fetch;
  loadingMessage?: string;
  hasOneTagPerCategoryLimit?: boolean;
} & Partial<
  Omit<
    AutocompleteControlledProps,
    "items" | "textfieldProps" | "loadingProps" | "value" | "onChange"
  >
>;

function limitToOneTagPerCategory({
  prev,
  toggledItem,
  multiSelect,
  tagIdToTagGroupRecord,
}: {
  prev: string[];
  toggledItem: string;
  multiSelect: boolean;
  tagIdToTagGroupRecord: Record<string, TagGroup>;
}): string[] {
  // Case 1: Item was present => unchecked it
  if (prev.includes(toggledItem)) {
    return prev.filter((id) => id !== toggledItem);
  }

  // Case 2: If single select, return the new item
  if (!multiSelect) {
    return [toggledItem];
  }

  const tagGroup = tagIdToTagGroupRecord[parseInt(toggledItem, 10)];

  // Case 3: Item is not in a group => check it
  if (!tagGroup) {
    return [...prev, toggledItem].sort();
  }

  // Case 4: Item is in a group => check it and uncheck other tags from same group
  return [
    ...prev.filter((id) => !tagGroup.tags.includes(parseInt(id, 10))),
    toggledItem,
  ].sort();
}

export const TagSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  id,
  fieldName,
  placeholder,
  fetch,
  multiSelect,
  loadingMessage,
  hasOneTagPerCategoryLimit,
  ...autocompleteProps
}: TagSelectorProps<TFormValues, TFieldName>): ReactElement => {
  const { tagGroups, tagIdToTagGroupRecord, tagIdToTagRecord, isLoading } =
    useGroupedTagsQuery(fetch);

  const tagOptions = useTagOptions({
    tagGroups: tagGroups ?? [],
    tagIdToTagRecord,
  });

  return (
    <FormField<TFormValues, TFieldName, AutocompleteControlledProps>
      name={fieldName}
      mapProps={({ defaultProps, form }) => {
        const { statusText, status, value, ...otherProps } = defaultProps;

        const textfieldProps = {
          id: `${id}-textfield`,
          placeholder,
          iconRight: "chevron-down" as const,
          status,
          statusText,
        };

        const onChange: AutocompleteControlledProps["onChange"] = (
          selection,
          toggledItem,
        ) => {
          const finalList =
            hasOneTagPerCategoryLimit && multiSelect && toggledItem
              ? limitToOneTagPerCategory({
                  multiSelect,
                  prev: value.map((id: number) => String(id)),
                  tagIdToTagGroupRecord,
                  toggledItem,
                })
              : selection;

          form.setValue(
            fieldName,
            finalList.map((stringId) =>
              parseInt(stringId, 10),
            ) as TFormValues[TFieldName],
            { shouldDirty: true, shouldValidate: true },
          );
        };

        return {
          ...otherProps,
          value: value.map((id: number) => String(id)),
          onChange,
          multiSelect,
          textfieldProps,
        };
      }}
    >
      {/** @ts-expect-error Props are provided by the wrapper */}
      <AutocompleteControlled
        key={id}
        items={tagOptions}
        {...DEFAULT_PROPS}
        {...autocompleteProps}
        loadingProps={{
          isLoading,
          message: loadingMessage,
        }}
      />
    </FormField>
  );
};

TagSelector.displayName = "KaizenTagSelector";
