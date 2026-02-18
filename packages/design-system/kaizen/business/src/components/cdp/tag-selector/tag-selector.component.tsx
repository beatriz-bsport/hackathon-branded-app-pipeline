import { type ReactElement, useCallback } from "react";

import type { Tag, TagGroup } from "@bsport/api-core";
import { type FieldValues, FormField } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
} from "@bsport/kaizen-primitive-core";

import type { NumberListFieldPath } from "#src/utils/form-types";

import { useTagAggregations, useTagOptions } from "./use-format-tag-options";

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_PROPS: Partial<AutocompleteProps> = {
  debounceValue: 10,
  popoverPlacement: "bottom-right",
  showSelectedItemsInBase: true,
  className: "max-w-component-select",
  searchMode: "local",
  hideChips: false,
  fullWidth: true,
};

export type TagSelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  placeholder: string;
  /** Control the default ids to inject in the Autocomplete. Else, it is delegated to form inference. */
  initialIds?: number[];
  /** @todo
   * These props will be removed when React Query will be used
   * internally to fetch the tags
   */
  tags: Tag[];
  tagGroups: TagGroup[];
} & Partial<
  Omit<
    AutocompleteProps,
    | "items"
    | "onToggleItem"
    | "textfieldProps"
    | "onSelect"
    | "defaultSelectedIds"
  >
>;

export const TagSelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
>({
  id,
  fieldName,
  placeholder,
  tags,
  tagGroups,
  multiSelect,
  initialIds,
  ...autocompleteProps
}: TagSelectorProps<TFormValues, TFieldName>): ReactElement => {
  const { tagIdToTagGroupRecord, tagIdToTagRecord } = useTagAggregations({
    tags,
    tagGroups,
  });
  const tagOptions = useTagOptions({ tagGroups, tagIdToTagRecord });

  /**
   * Custom toggle logic to apply in the Autocomplete
   * It makes sure that only when tag per category is selected
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
    },
    [tagIdToTagGroupRecord, multiSelect],
  );

  return (
    <FormField<TFormValues, TFieldName, AutocompleteProps>
      name={fieldName}
      mapProps={({ defaultProps, form, formState }) => {
        const { statusText: _, value: _value, ...otherProps } = defaultProps;

        // @ts-expect-error Too deep typing prevent nice typescript inference
        const defaultSelectedIds = (formState.defaultValues ?? {})[
          fieldName
        ] as number[];
        const selectedIds = (initialIds ?? defaultSelectedIds ?? [])
          .filter((id) => id !== undefined)
          .map((id) => id.toString())
          .sort();

        if (multiSelect) {
          return {
            ...otherProps,
            defaultSelectedIds: selectedIds,
            onSelect: (values: string[]) => {
              form.setValue(
                fieldName,
                values.map((stringId) =>
                  parseInt(stringId, 10),
                ) as TFormValues[TFieldName],
                { shouldDirty: true, shouldValidate: true },
              );
            },
            multiSelect: true,
          };
        }

        return {
          ...otherProps,
          defaultSelectedIds: selectedIds,
          onSelect: (value: string) => {
            form.setValue(
              fieldName,
              (value ? [parseInt(value, 10)] : []) as TFormValues[TFieldName],
              { shouldDirty: true, shouldValidate: true },
            );
          },
          multiSelect: false,
        };
      }}
    >
      {/** @ts-expect-error Props are provided by the wrapper */}
      <Autocomplete
        key={id}
        id={id}
        items={tagOptions}
        onToggleItem={onToggleItem}
        textfieldProps={{
          id: `${id}-textfield`,
          placeholder,
          iconRight: "chevron-down",
        }}
        {...DEFAULT_PROPS}
        {...autocompleteProps}
      />
    </FormField>
  );
};

TagSelector.displayName = "KaizenTagSelector";
