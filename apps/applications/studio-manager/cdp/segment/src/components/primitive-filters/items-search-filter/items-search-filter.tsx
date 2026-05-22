import { useEffect, useMemo, useRef, useState } from "react";

import {
  Body,
  Button,
  Card,
  Divider,
  type Item,
  List,
  Menu,
  type MenuOption,
  Popover,
  TextField,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SELECT_ALL_FILTERED_OPTION_ID } from "./constants";
import type {
  ItemsSearchFilterMenuOptionView,
  ItemsSearchFilterOption,
  ItemsSearchFilterProps,
  ItemsSearchFilterSelectedListItemProps,
  ItemsSearchFilterValue,
} from "./types";
import {
  filterOptionsByQuery,
  sanitizeSelectedIds,
  updateSelectionOrder,
} from "./utils";

/**
 * Renders one selected item row with a remove action.
 */
const SelectedOptionRow = ({
  optionId,
  option,
  onRemove,
  selectedOptionFormatter,
  removeLabel,
}: ItemsSearchFilterSelectedListItemProps) => (
  <div className="flex w-full items-center justify-between px-sm py-xs border-b-stroke-thin border-b-stroke-divider">
    <div className="min-w-0">
      {selectedOptionFormatter ? (
        selectedOptionFormatter(option)
      ) : (
        <div className="min-w-0">
          <Body size="md" weight="strong" color="default">
            {option.name}
          </Body>
          {option.description ? (
            <Body size="sm" color="weak">
              {option.description}
            </Body>
          ) : null}
        </div>
      )}
    </div>

    <Button
      kind="icon-button"
      label={removeLabel}
      icon="x-close"
      intent="flat"
      color="default"
      size="md"
      onClick={() => onRemove(optionId)}
    />
  </div>
);

/**
 * Item search primitive filter with searchable multiselect and selected values panel.
 */
export const ItemsSearchFilter = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
  searchPlaceholder,
  emptySearchLabel,
  emptySelectionLabel,
  errorText,
  selectAllLabelBuilder,
  menuOptionFormatter,
  selectedOptionFormatter,
  selectedListItem: SelectedListItemComponent,
  searchIncludesDescription = false,
  groupFilteredOptions,
}: ItemsSearchFilterProps) => {
  const { t } = useTranslation("filters");
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<ItemsSearchFilterValue>(
    value ?? [],
  );
  const [searchValue, setSearchValue] = useState("");
  const searchFieldRef = useRef<HTMLDivElement | null>(null);
  const selectionOrderRef = useRef<number[]>([]);

  const optionsById = useMemo(
    () => new Map(options.map((option) => [option.id, option])),
    [options],
  );
  const validIds = useMemo(
    () => new Set(options.map((option) => option.id)),
    [options],
  );
  const filteredOptions = useMemo(
    () =>
      filterOptionsByQuery(options, searchValue, {
        includeDescription: searchIncludesDescription,
      }),
    [options, searchValue, searchIncludesDescription],
  );

  useEffect(() => {
    if (isControlled) {
      setLocalValue(value ?? []);
    }
  }, [isControlled, value]);

  const emitChange = (nextValue: ItemsSearchFilterValue) => {
    setLocalValue(nextValue);
    onChange?.(nextValue);
  };

  const sanitizedValue = useMemo(
    () => sanitizeSelectedIds(localValue ?? [], validIds),
    [localValue, validIds],
  );
  const selectedIdsSet = useMemo(
    () => new Set(sanitizedValue),
    [sanitizedValue],
  );

  useEffect(() => {
    if (sanitizedValue.length !== (localValue ?? []).length) {
      emitChange(sanitizedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedValue, localValue]);

  useEffect(() => {
    if (isControlled) {
      selectionOrderRef.current = updateSelectionOrder(
        selectionOrderRef.current,
        sanitizedValue,
      );
    }
  }, [isControlled, sanitizedValue]);

  const filteredIds = filteredOptions.map((option) => option.id);
  const areAllFilteredSelected =
    filteredIds.length > 0 &&
    filteredIds.every((filteredId) => selectedIdsSet.has(filteredId));
  const areAllOptionsSelected =
    options.length > 0 && sanitizedValue.length === options.length;

  const selectedListIds = areAllOptionsSelected
    ? options.map((option) => option.id)
    : selectionOrderRef.current.filter((selectedId) =>
        selectedIdsSet.has(selectedId),
      );
  const selectedListItems = selectedListIds
    .map((selectedId) => {
      const option = optionsById.get(selectedId);
      if (!option) return null;
      return { id: selectedId.toString(), optionId: selectedId, option };
    })
    .filter((item) => item !== null);
  const SelectedListItemRenderer =
    SelectedListItemComponent ?? SelectedOptionRow;

  const toMenuOption = (option: ItemsSearchFilterOption): MenuOption => {
    const formatted: ItemsSearchFilterMenuOptionView | undefined =
      menuOptionFormatter?.(option);

    return {
      id: option.id.toString(),
      label: formatted?.label ?? option.name,
      description: formatted?.description ?? option.description,
      leftSlot: formatted?.leftSlot,
      rightSlot: formatted?.rightSlot,
    };
  };

  const buildDropdownMenuItems = (): Item[] => {
    if (!groupFilteredOptions) {
      return filteredOptions.map(toMenuOption);
    }

    const slices = groupFilteredOptions(filteredOptions);
    const rows: Item[] = [];

    for (const slice of slices) {
      if (slice.heading.trim().length > 0) {
        rows.push({ type: "title", label: slice.heading });
      }
      rows.push(...slice.options.map(toMenuOption));
    }

    return rows;
  };

  const dropdownMenuItems = buildDropdownMenuItems();
  const searchPlaceholderLabel =
    searchPlaceholder ?? t("itemsSearch.fields.searchPlaceholder");
  const emptySearchMessage = emptySearchLabel ?? t("itemsSearch.empty.search");
  const emptySelectionMessage =
    emptySelectionLabel ?? t("itemsSearch.empty.selection");
  const removeLabel = t("itemsSearch.actions.remove");
  const selectAllLabel = selectAllLabelBuilder
    ? selectAllLabelBuilder(filteredIds.length)
    : t("itemsSearch.actions.selectAllFiltered", {
        count: filteredIds.length,
      });

  const toggleSelection = (optionId: number) => {
    if (disabled) return;

    if (selectedIdsSet.has(optionId)) {
      const nextSelectedIds = sanitizedValue.filter(
        (selectedId) => selectedId !== optionId,
      );
      selectionOrderRef.current = updateSelectionOrder(
        selectionOrderRef.current,
        nextSelectedIds,
      );
      emitChange(nextSelectedIds);
      return;
    }

    const nextSelectedIds = [...sanitizedValue, optionId];
    selectionOrderRef.current = updateSelectionOrder(
      selectionOrderRef.current,
      nextSelectedIds,
    );
    emitChange(nextSelectedIds);
  };

  const toggleSelectAllFiltered = () => {
    if (disabled || filteredIds.length === 0) return;

    if (areAllFilteredSelected) {
      const filteredSet = new Set(filteredIds);
      const nextSelectedIds = sanitizedValue.filter(
        (selectedId) => !filteredSet.has(selectedId),
      );
      selectionOrderRef.current = updateSelectionOrder(
        selectionOrderRef.current,
        nextSelectedIds,
      );
      emitChange(nextSelectedIds);
      return;
    }

    const nextSelectedIds = [...sanitizedValue];
    for (const filteredId of filteredIds) {
      if (!selectedIdsSet.has(filteredId)) {
        nextSelectedIds.push(filteredId);
      }
    }
    selectionOrderRef.current = updateSelectionOrder(
      selectionOrderRef.current,
      nextSelectedIds,
    );
    emitChange(nextSelectedIds);
  };

  const popoverWidth = searchFieldRef.current?.getBoundingClientRect().width;

  return (
    <div className={className}>
      <Card
        padding="none"
        className={errorText ? "w-full shadow-border-thin-critical" : "w-full"}
      >
        <Popover fullWidth>
          <Popover.Anchor>
            {({ setIsPopoverOpened, isPopoverOpened }) => (
              <div ref={searchFieldRef} className="p-xs">
                <TextField
                  id={`${id}-search`}
                  label={label}
                  type="text"
                  value={searchValue}
                  onChange={(event) => {
                    if (!isPopoverOpened) {
                      setIsPopoverOpened(true);
                    }
                    setSearchValue(event.target.value);
                  }}
                  onFocus={() => setIsPopoverOpened(true)}
                  onClick={() => setIsPopoverOpened(true)}
                  onClear={() => setSearchValue("")}
                  placeholder={searchPlaceholderLabel}
                  fullWidth
                  disabled={disabled}
                  status={errorText ? "error" : "default"}
                  statusText={errorText}
                />
              </div>
            )}
          </Popover.Anchor>

          <Popover.Content
            placement="bottom-left"
            minWidthPx={popoverWidth}
            maxWidthPx={popoverWidth}
          >
            {() => (
              <div className="w-full">
                <Menu
                  multiSelect
                  items={[
                    {
                      id: SELECT_ALL_FILTERED_OPTION_ID,
                      label: selectAllLabel,
                    },
                    { type: "divider" },
                    ...dropdownMenuItems,
                  ]}
                  selectedValues={
                    areAllFilteredSelected
                      ? [
                          ...sanitizedValue.map((selectedId) =>
                            selectedId.toString(),
                          ),
                          SELECT_ALL_FILTERED_OPTION_ID,
                        ]
                      : sanitizedValue.map((selectedId) =>
                          selectedId.toString(),
                        )
                  }
                  onSelectOption={(selectedId) => {
                    if (selectedId === SELECT_ALL_FILTERED_OPTION_ID) {
                      toggleSelectAllFiltered();
                      return;
                    }

                    const parsedSelectedId = Number(selectedId);
                    if (Number.isNaN(parsedSelectedId)) {
                      return;
                    }

                    toggleSelection(parsedSelectedId);
                  }}
                />
                {filteredOptions.length === 0 ? (
                  <Body size="sm" color="weak" className="px-xs py-2xs">
                    {emptySearchMessage}
                  </Body>
                ) : null}
              </div>
            )}
          </Popover.Content>
        </Popover>

        <Divider />

        <div>
          <List
            key={selectedListItems.length.toString()}
            id={`${id}-selected-list`}
            items={selectedListItems}
            ListItem={(itemProps) => (
              <SelectedListItemRenderer
                {...itemProps}
                onRemove={toggleSelection}
                selectedOptionFormatter={selectedOptionFormatter}
                removeLabel={removeLabel}
              />
            )}
            emptyStateProps={{
              isEmpty: selectedListItems.length === 0,
              emptyConfig: {
                title: emptySelectionMessage,
                className: "min-h-[200px]",
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
};
