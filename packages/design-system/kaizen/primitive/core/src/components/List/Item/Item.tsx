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
import Tooltip, { type WithTooltip } from "#src/components/Tooltip";

type Props = {
  id: string;
  title: string;
  rightTitle?: string;
  description?: string;
  isSelectable?: boolean;
  onCheckboxChange?: (value: boolean) => void;
  icon?: IconName;
  avatar?: WithTooltip<AvatarProps>;
  chips?: WithTooltip<
    | [ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps]
    | [ListItemChipsProps, ListItemChipsProps, ListItemChipsProps]
  >;
  chipsDirection?: "start" | "end";
  buttons?: WithTooltip<
    | [ButtonProps]
    | [ButtonProps, ButtonProps]
    | [ButtonProps, ButtonProps, ButtonProps]
  >;
  link?: string;
  className?: string;
};

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> &
  VariantProps<typeof listItem> &
  Props;

/**
 * A higher-order component (HOC) that wraps a given component with optional tooltip functionality.
 *
 * This HOC enhances the provided React component by allowing it to accept an additional
 * `tooltipProps` property. When `tooltipProps` is provided, the component is rendered within
 * a `<Tooltip>` wrapper; otherwise, it is rendered normally.
 */
const withTooltip = <P extends object>(Component: React.FC<P>) => {
  const WrappedComponent: React.FC<WithTooltip<P>> = ({
    tooltipProps,
    ...rest
  }) => {
    if (tooltipProps) {
      return (
        <Tooltip {...tooltipProps}>
          <Component {...(rest as P)} />
        </Tooltip>
      );
    }

    return <Component {...(rest as P)} />;
  };

  return WrappedComponent;
};

const ChipWithTooltip = withTooltip<WithTooltip<ListItemChipsProps>>(Chip);

const ButtonWithTooltip = withTooltip<WithTooltip<ButtonProps>>(Button);

const AvatarWithTooltip = withTooltip<WithTooltip<AvatarProps>>(Avatar);

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
    chipsDirection,
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
              <ChipWithTooltip key={chip.label} {...chip} />
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
          {(avatar && <AvatarWithTooltip {...avatar} />) ||
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
                <ButtonWithTooltip
                  key={index}
                  {...button}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents event bubbling
                    e.preventDefault(); // Prevents the link from triggering if needed
                    button.onClick?.(e);
                  }}
                  label={button?.label}
                />
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
  title,
  rightTitle,
  description,
  isSelectable = false,
  icon,
  avatar,
  chipsDirection = "start",
  buttons,
  chips,
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
        chipsDirection={chipsDirection}
        buttons={buttons}
        chips={chips}
      />
    </li>
  );
};

Item.displayName = "KaizenListItem";

export default Item;
