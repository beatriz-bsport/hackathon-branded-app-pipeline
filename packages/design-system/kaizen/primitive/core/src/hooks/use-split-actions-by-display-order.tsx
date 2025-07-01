import Button, { type ButtonProps } from "#src/components/Button";
import type { DropdownMenuProps } from "#src/components/DropdownMenu";
import type { MenuOption } from "#src/components/Menu/types";

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
  dropdownMenuProps: DropdownMenuProps | null;
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
  const visibleActionsDisplayLimit =
    dropdownConfig?.visibleActionsDisplayLimit ??
    BASE_MAXIMUM_NUMBER_OF_PRIMARY_ACTIONS;
  const dropdownTargetProps = dropdownConfig?.dropdownTargetProps || {
    id: "dropdown-menu-button",
    size: "md",
    intent: "flat",
    color: "default",
    iconLeft: "dots-horizontal",
  };

  const transformButtonPropsIntoDropdownMenuItems = (
    actionsToRefine: ActionButton[],
  ): MenuOption[] => {
    return actionsToRefine.map((action) => ({
      id: action.id,
      label: action.label || "",
      iconLeft: action.iconLeft,
    }));
  };

  const getInlineActionsSetup = (): [
    ActionButton[],
    DropdownMenuProps | null,
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

      const dropdownMenuBaseSetup: DropdownMenuProps = {
        items: dropdownMenuItems,
        placement: "bottom-right",
        onSelectOption: ({ id }) => {
          effectByActionIdMap.find((action) => action.id === id)?.onClick?.();
        },
        target: ({ setIsPopoverOpened }) => (
          <Button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
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
