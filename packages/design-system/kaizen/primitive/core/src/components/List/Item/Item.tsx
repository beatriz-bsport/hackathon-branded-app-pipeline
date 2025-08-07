import { VariantProps } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useMemo } from "react";

import Avatar, { type AvatarProps } from "#src/components/Avatar";
import Button from "#src/components/Button";
import Checkbox from "#src/components/Checkbox";
import Chip from "#src/components/Chip";
import ColorIndicator from "#src/components/ColorIndicator";
import DropdownMenu from "#src/components/DropdownMenu";
import Icon, { IconName } from "#src/components/Icon";
import { ListItemChipsProps, listItem } from "#src/components/List";
import { type WithTooltip, withTooltip } from "#src/components/Tooltip";
import withLink from "#src/components/private/withLink";
import { useCheckboxContext } from "#src/contexts/CheckboxContext";
import useSplitActionsByDisplayOrder, {
  type ActionButton,
  type ActionsDropdownConfig,
} from "#src/hooks/use-split-actions-by-display-order";

type Props = {
  id: string;
  title: string;
  rightTitle?: string;
  description?: string;
  isSelectable?: boolean;
  isActive?: boolean;
  onCheckboxChange?: (value: boolean) => void;
  icon?: IconName;
  avatar?: WithTooltip<AvatarProps>;
  color?: string;
  chips?: WithTooltip<
    | [ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps, ListItemChipsProps]
  >;
  chipsDirection?: "start" | "end";
  buttons?: WithTooltip<ActionButton[]>;
  dropdownConfig?: ActionsDropdownConfig;
  link?: string;
  className?: string;
  onItemClick?: () => void;
  compactMode?: boolean;
};

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> &
  VariantProps<typeof listItem> &
  Props;

const ChipWithTooltip = withTooltip(Chip);

const ButtonWithTooltip = withTooltip(Button);

const AvatarWithTooltip = withTooltip(Avatar);

const BaseItem: React.FC<
  Props & {
    checkboxState: "checked" | "unchecked";
    handleChange: (value: boolean) => void;
  }
> = withLink(
  ({
    title,
    rightTitle,
    description,
    isSelectable,
    icon,
    avatar,
    color,
    chipsDirection,
    buttons,
    id,
    checkboxState,
    handleChange,
    chips,
    dropdownConfig,
  }) => {
    const { actions, dropdownMenuProps } = useSplitActionsByDisplayOrder({
      actions: buttons || [],
      dropdownConfig: dropdownConfig,
    });

    const renderedChips = useMemo(
      () =>
        chips ? (
          <div className="flex items-center gap-2xs">
            {chips.map((chip) => (
              <ChipWithTooltip key={chip.label} {...chip} />
            ))}
          </div>
        ) : null,
      [chips],
    );

    return (
      <>
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
          {/* Left column with title and description */}
          <div className="flex items-center gap-xs text-onsurface-default">
            {color && (
              <ColorIndicator
                color={color}
                type="line"
                size="xs"
                className="absolute left-0"
              />
            )}
            {isSelectable && (
              <Checkbox id={id} value={checkboxState} onChange={handleChange} />
            )}
            {(avatar && <AvatarWithTooltip {...avatar} />) ||
              (icon && <Icon icon={icon} size="md" />) ||
              null}
            <div className="flex-1 min-w-0">
              <span className="block text-onsurface-default text-body-lg leading-md truncate break-word">
                {title}
              </span>
              {description && (
                <span className="block text-onsurface-weak text-body-md leading-sm truncate break-word">
                  {description}
                </span>
              )}
            </div>
          </div>

          {/* Right column with actions */}
          <div className="flex justify-end gap-sm">
            {chipsDirection === "start" && renderedChips}
            {rightTitle && (
              <span className="text-onsurface-default text-body-lg leading-md">
                {rightTitle}
              </span>
            )}
            {chipsDirection === "end" && renderedChips}
            {actions &&
              actions.map((action) => (
                <ButtonWithTooltip
                  key={action.id}
                  {...action}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    action.onClick?.();
                  }}
                  label={action?.label}
                />
              ))}
            {dropdownMenuProps && <DropdownMenu {...dropdownMenuProps} />}
          </div>
        </div>
      </>
    );
  },
);

/**
 * A list item component that displays a title, optional description, and various widgets
 * like checkboxes, avatars, icons, chips, and buttons. Used to construct a list with
 * customizable behavior for each item.
 * @param props.className Classname to add to the list item container.
 * @param props.title The main title of the list item.
 * @param props.rightTitle An additional title displayed on the right side of the item.
 * @param props.description An optional description displayed below the title.
 * @param props.onCheckboxChange Callback triggered when the checkbox value changes.
 * @param props.icon Name of the icon to display within the item.
 * @param props.avatar Configuration for the avatar component within the item.
 * @param props.color Color value used to display an indicator on the left side of the item. Accepts any valid CSS color value (hex, rgb, etc).
 * @param props.chips An array of chips to display, up to 3, with details about their labels and styles.
 * @param props.chipsDirection Direction for displaying the chips: "start" or "end".
 * @param props.buttons An array of button configurations, up to 3, displayed within the item.
 * @param props.dropdownConfig An optionnal object, dropdown config such as the max number of actions displayed inline or the dropdown component fields.
 * @param props.link The URL to navigate to when the item is clicked.
 * If provided, the entire item may act as a clickable link.
 * @param props.id The id of the item.
 * @param props.onItemClick Callback triggered when the user is clicking on the item.
 */
const Item: React.FC<ListItemProps> = ({
  id,
  className,
  onCheckboxChange,
  link,
  title,
  rightTitle,
  description,
  isSelectable = false,
  isActive = false,
  icon,
  avatar,
  color,
  chipsDirection = "start",
  buttons,
  chips,
  dropdownConfig,
  onItemClick,
  compactMode = false,
  ...props
}) => {
  const { toggleCheckbox, getCheckboxState } = useCheckboxContext();

  const checkboxState = getCheckboxState(id);

  const handleChange = useCallback(
    (value: boolean) => {
      toggleCheckbox(id);
      onCheckboxChange?.(value);
    },
    [onCheckboxChange, id, toggleCheckbox],
  );

  return (
    <li
      id={id}
      className={classNames(
        listItem({
          className,
          selected: checkboxState === "checked" || isActive,
          isLink: !!link,
          compactMode,
        }),
      )}
      onClick={onItemClick}
      tabIndex={0}
      {...props}
    >
      <BaseItem
        link={link}
        handleChange={handleChange}
        checkboxState={checkboxState}
        className="flex w-full justify-between items-center gap-xs self-stretch"
        id={id}
        title={title}
        rightTitle={rightTitle}
        description={description}
        isSelectable={isSelectable}
        icon={icon}
        avatar={avatar}
        color={color}
        chipsDirection={chipsDirection}
        buttons={buttons}
        chips={chips}
        dropdownConfig={dropdownConfig}
      />
    </li>
  );
};

Item.displayName = "KaizenListItem";

export default Item;
