import { cx } from "class-variance-authority";
import { type ReactElement, useId, useMemo } from "react";

import { BodyColor } from "#src/components/Body";
import type {
  DropdownMenuItemProps,
  DropdownMenuTextProps,
  DropdownMenuTitleProps,
} from "#src/components/DropdownMenu";
import type { TextFieldProps } from "#src/components/TextField";
import { Label } from "#src/components/label";
import type { Placement } from "#src/hooks";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import { Body, Button, DropdownMenu, Loader } from "#src/index";

import { type ChipItem, ChipList } from "../chip-list";

type ItemOption<OptionProps extends Record<string, unknown>> = {
  type?: "item";
} & DropdownMenuItemProps &
  OptionProps;

type DividerOption = { type: "divider"; id: string };

type TitleOption = { type: "title"; id: string } & DropdownMenuTitleProps;

type TextOption = { type: "text"; id: string } & DropdownMenuTextProps;

type Option<OptionProps extends Record<string, unknown>> =
  | ItemOption<OptionProps>
  | DividerOption
  | TitleOption
  | TextOption;

const isItemOption = <OptionProps extends Record<string, unknown>>(
  option: Option<OptionProps>,
): option is ItemOption<OptionProps> =>
  option.type === undefined || option.type === "item";

export type DropdownMultiSelectProps<
  OptionProps extends Record<string, unknown>,
> = {
  value: string[];
  onChange: (values: string[]) => void;
  options: Array<Option<OptionProps>>;
  isLoading?: boolean;
  mapOptionToChip: (option: ItemOption<OptionProps>) => ChipItem;
  label?: string;
  anchorLabel: string;
  anchorClassName?: string;
  popoverClassName?: string;
  popoverPlacement?: Placement;
  required?: boolean;
  disabled?: boolean;
  status?: TextFieldProps["status"];
  statusText?: string;
  withChips?: boolean;
  withSelectAll?: boolean;
  withSearch?: boolean;
  className?: string;
};

export const DropdownMultiSelect = <
  OptionProps extends Record<string, unknown>,
>({
  value,
  onChange,
  options,
  anchorLabel,
  label,
  mapOptionToChip,
  isLoading = false,
  withSearch = true,
  withChips = true,
  withSelectAll = true,
  anchorClassName = "min-w-component-popover-min max-w-full",
  popoverClassName = "w-component-popover-min",
  popoverPlacement = "bottom-right",
  className = "",
  required,
  disabled,
  status = "default",
  statusText,
}: DropdownMultiSelectProps<OptionProps>): ReactElement => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const selectableItems = useMemo(
    () => options.filter(isItemOption),
    [options],
  );

  const optionsMap = useMemo(
    () =>
      selectableItems.reduce((prev, next) => {
        return prev.set(next.id, next);
      }, new Map<string, ItemOption<OptionProps>>()),
    [selectableItems],
  );

  const selectedChips = value
    .map((id) => optionsMap.get(id))
    .filter((item) => !!item)
    .map(mapOptionToChip);

  const selectedIds = new Set(value);

  const isAllSelected =
    selectableItems.length > 0 &&
    selectableItems.every((option) => selectedIds.has(option.id));

  const handleToggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(selectableItems.map((option) => option.id));
    }
  };

  const handleDismissChip = (chipId: string) => {
    onChange(value.filter((id) => id !== chipId));
  };

  const selectAllId = `select-all-${useId()}`;

  return (
    <div className={cx("flex flex-col gap-2xs", className)}>
      {label && <Label label={label} required={required} />}

      <DropdownMenu
        onSelectItem={(id: string) => {
          if (id === selectAllId) {
            handleToggleAll();
            return;
          }

          const newSelectedIds = new Set(selectedIds);
          if (newSelectedIds.has(id)) {
            newSelectedIds.delete(id);
          } else {
            newSelectedIds.add(id);
          }

          onChange(Array.from(newSelectedIds));
          return;
        }}
        selectedValues={value}
        multiSelect
        onSelectedValuesChange={() => {}}
      >
        <DropdownMenu.Trigger>
          {({ setIsOpen, isOpen }) => (
            <div
              className={cx(
                "flex flex-row items-center gap-xs",
                anchorClassName,
              )}
            >
              <Button
                intent="default"
                color="main"
                label={anchorLabel}
                size="md"
                iconRight="chevron-down"
                className="justify-between w-full"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          placement={popoverPlacement}
          popoverContentClassName={popoverClassName}
        >
          {isLoading && <Loader size="md" className="w-full" />}

          {!isLoading && (
            <>
              {withSearch && <DropdownMenu.Search />}

              {withSelectAll && (
                <DropdownMenu.Item id={selectAllId}>
                  {isAllSelected
                    ? t("actions.selectNone")
                    : t("actions.selectAll")}
                </DropdownMenu.Item>
              )}

              {(withSearch || withSelectAll) && <DropdownMenu.Divider />}

              {options.map((option) => {
                if (option.type === "divider") {
                  return <DropdownMenu.Divider key={`divider-${option.id}`} />;
                }
                if (option.type === "title") {
                  return (
                    <DropdownMenu.Title key={`title-${option.id}`}>
                      {option.children}
                    </DropdownMenu.Title>
                  );
                }
                if (option.type === "text") {
                  const { type: _type, ...textProps } = option;
                  return (
                    <DropdownMenu.Text
                      key={`text-${option.id}`}
                      {...textProps}
                    />
                  );
                }
                const { type: _type, id, ...itemProps } = option;
                return (
                  <DropdownMenu.Item
                    key={`item-${id}`}
                    id={id}
                    {...itemProps}
                  />
                );
              })}
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>

      {statusText && (
        <Body size="sm" color={getStatusText(status)}>
          {statusText}
        </Body>
      )}

      {withChips && (
        <ChipList
          chips={selectedChips}
          handleDismissChip={handleDismissChip}
          disabled={disabled}
          className="mt-2xs"
        />
      )}
    </div>
  );
};

function getStatusText(status: TextFieldProps["status"]): BodyColor {
  if (status === "error") {
    return "critical";
  }
  if (status === "positive") {
    return "positive";
  }
  return "weak";
}
