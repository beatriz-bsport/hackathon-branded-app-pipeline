import React, { useCallback, useMemo } from "react";
import { VariantProps } from "class-variance-authority";
import classNames from "classnames";
import Avatar, { AvatarProps } from "#src/components/Avatar";
import Button, { ButtonProps } from "#src/components/Button";
import Checkbox from "#src/components/Checkbox";
import Chip from "#src/components/Chip";
import Icon, { IconName } from "#src/components/Icon";
import withLink from "#src/components/private/withLink";
import { listItem, ListItemChipsProps } from "#src/components/List";
import { useCheckboxContext } from "#src/contexts/CheckboxContext";

type Props = {
  id: string;
  title: string;
  rightTitle?: string;
  description?: string;
  isSelectable?: boolean;
  onCheckboxChange?: (value: boolean) => void;
  icon?: IconName;
  avatar?: AvatarProps;
  chips?:
    | [ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps, ListItemChipsProps];
  chipsDirection?: "start" | "end";
  buttons?:
    | [ButtonProps]
    | [ButtonProps, ButtonProps]
    | [ButtonProps, ButtonProps, ButtonProps];
  link?: string;
  className?: string;
};

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> &
  VariantProps<typeof listItem> &
  Props;

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
    isSelectable = false,
    icon,
    avatar,
    chipsDirection = "start",
    buttons,
    id,
    checkboxState,
    handleChange,
    chips,
  }) => {
    const renderedChips = useMemo(
      () =>
        chips ? (
          <div className="flex items-center gap-2xs">
            {chips.map((chip) => (
              <Chip key={chip.label} {...chip} />
            ))}
          </div>
        ) : null,
      [chips],
    );
    return (
      <>
        <div className="flex items-center gap-xs text-onsurface-default">
          {isSelectable && (
            <Checkbox id={id} value={checkboxState} onChange={handleChange} />
          )}
          {(avatar && <Avatar {...avatar} />) ||
            (icon && <Icon icon={icon} size="md" />) ||
            null}
          <div className="flex flex-col items-start gap-2xs max-w-[500px]">
            <span className="text-onsurface-default text-body-lg leading-md">
              {title}
            </span>
            {description && (
              <span className="text-onsurface-weak text-body-md leading-sm">
                {description}
              </span>
            )}
          </div>
          {chipsDirection === "start" && renderedChips}
        </div>
        <div className="flex items-center gap-sm">
          {rightTitle && (
            <span className="text-onsurface-default text-body-lg leading-md">
              {rightTitle}
            </span>
          )}
          {chipsDirection === "end" && renderedChips}
          {buttons && (
            <div className="flex items-center gap-sm">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  {...button}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event bubbling
                    e.preventDefault(); // Prevents the link from triggering if needed
                    button.onClick?.(e);
                  }}
                >
                  {button?.label}
                </Button>
              ))}
            </div>
          )}
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
 * @param props.chips An array of chips to display, up to 3, with details about their labels and styles.
 * @param props.chipsDirection Direction for displaying the chips: "start" or "end".
 * @param props.buttons An array of button configurations, up to 3, displayed within the item.
 * @param props.link The URL to navigate to when the item is clicked.
 * If provided, the entire item may act as a clickable link.
 * @param props.id The id of the item.
 */
const Item: React.FC<ListItemProps> = ({
  id,
  className,
  onCheckboxChange,
  link,
  ...props
}) => {
  const { toggleCheckbox, getCheckboxState } = useCheckboxContext();

  const checkboxState = getCheckboxState(id);

  const handleChange = useCallback(
    (value: boolean) => {
      toggleCheckbox(id);
      onCheckboxChange?.(value);
    },
    [onCheckboxChange],
  );

  return (
    <li
      className={classNames(
        listItem({
          className,
          selected: checkboxState === "checked",
          isLink: !!link,
        }),
      )}
      {...props}
    >
      <BaseItem
        link={link}
        handleChange={handleChange}
        checkboxState={checkboxState}
        className="flex w-full justify-between items-center gap-xs self-stretch"
        id={id}
        {...props}
      />
    </li>
  );
};

Item.displayName = "KaizenListItem";

export default Item;
