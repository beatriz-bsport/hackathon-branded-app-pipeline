import type { MouseEvent } from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import type { DropdownMenuManagedProps } from "#src/components/DropdownMenu";
import type { MenuOption } from "#src/components/Menu/types";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export type ActionButton = ButtonProps & {
  id: string;
  onClick?: () => void;
};

export type ActionsDropdownConfig = {
  dropdownTargetProps?: ButtonProps;
  visibleActionsDisplayLimit?: number;
};

export type UseActionsPlacementProps = {
  actions: ActionButton[] | null;
  dropdownConfig?: ActionsDropdownConfig;
};

export type UseActionsPlacementReturn = {
  actions: ActionButton[];
  dropdownMenuProps: DropdownMenuManagedProps | null;
};

const BASE_MAXIMUM_NUMBER_OF_PRIMARY_ACTIONS = 2;

/**
 * Hook that returns you list of buttons and dropdown menu setup to use when you
 * want to have an undefined amount of actions that you can setup in your components props.
 * @param actions list of actions that you want to refine.
 * @returns { actions: ActionButton[], dropdownMenuProps: DropdownMenuProps | null } object containing the list of buttons to render and the dropdown menu setup.
 */
const useSplitActionsByDisplayOrder = ({
  actions,
  dropdownConfig,
}: UseActionsPlacementProps): UseActionsPlacementReturn => {
  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n });

  const visibleActionsDisplayLimit =
    dropdownConfig?.visibleActionsDisplayLimit ??
    BASE_MAXIMUM_NUMBER_OF_PRIMARY_ACTIONS;
  const dropdownTargetProps = dropdownConfig?.dropdownTargetProps || {
    kind: "icon-button",
    label: t("actions.more"),
    icon: "dots-vertical",
    id: "dropdown-menu-button",
    size: "md" as const,
    intent: "flat" as const,
    color: "default" as const,
  };

  const transformButtonPropsIntoDropdownMenuItems = (
    actionsToRefine: ActionButton[],
  ): MenuOption[] => {
    return actionsToRefine.map((action) => ({
      id: action.id,
      label: action.label,
      iconLeft: "iconLeft" in action ? action.iconLeft : undefined,
      disabled: action.disabled,
    }));
  };

  const getInlineActionsSetup = (): [
    ActionButton[],
    DropdownMenuManagedProps | null,
  ] => {
    if (!actions) {
      return [[], null];
    }

    if (actions.length > visibleActionsDisplayLimit) {
      const firstActionsToDisplay = actions.slice(
        0,
        visibleActionsDisplayLimit,
      );
      const dropdownActionsList = actions.slice(visibleActionsDisplayLimit);
      const dropdownMenuItems =
        transformButtonPropsIntoDropdownMenuItems(dropdownActionsList);

      const effectByActionIdMap = dropdownActionsList.map((action) => ({
        id: action.id,
        onClick: action.onClick,
      }));

      const dropdownMenuBaseSetup: DropdownMenuManagedProps = {
        items: dropdownMenuItems,
        placement: "bottom-right",
        onSelectOption: ({
          id,
          setIsPopoverOpened,
        }: {
          id: string;
          setIsPopoverOpened: (value: boolean) => void;
        }) => {
          effectByActionIdMap.find((action) => action.id === id)?.onClick?.();
          setIsPopoverOpened(false);
        },
        target: ({
          setIsPopoverOpened,
        }: {
          isPopoverOpened: boolean;
          setIsPopoverOpened: (value: boolean) => void;
        }) => (
          <Button
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              event.stopPropagation();
              setIsPopoverOpened(true);
            }}
            {...dropdownTargetProps}
          />
        ),
      };

      return [firstActionsToDisplay, dropdownMenuBaseSetup];
    } else {
      return [actions, null];
    }
  };

  const [inlineActions, dropdownMenuProps] = getInlineActionsSetup();

  return {
    actions: inlineActions,
    dropdownMenuProps,
  };
};

export default useSplitActionsByDisplayOrder;
