import { type VariantProps, cva } from "class-variance-authority";
import React, { useCallback, useMemo } from "react";

const defaultClasses = [
  "rounded-md",
  "hover:ease-in-out",
  "duration-default",
] as const;

const variants = {
  padding: {
    default: "p-md",
    sm: "p-2xs",
    none: "p-[0]",
  },
  actionable: {
    true: ["cursor-pointer"],
    false: [
      "bg-surface-default-elevated",
      "border-stroke-default",
      "border-stroke-thin",
    ],
  },
  selectedByElevation: {
    "elevated-not-selected": [
      "bg-surface-action-default-elevated-rest",
      "shadow-action-default-rest",
      // Hover effect
      "hover:bg-surface-action-default-elevated-hovered",
      "hover:shadow-action-default-hovered",
      // On click effect
      "active:bg-surface-action-default-elevated-pressed",
      "active:shadow-action-default-pressed",
    ],
    "elevated-selected": [
      "border-stroke-regular",
      "border-stroke-action-main-selected",
      "bg-surface-action-default-elevated-selected-rest",
      "shadow-action-default-rest",
      // Hover effect
      "hover:bg-surface-action-default-elevated-selected-hovered",
      "hover:shadow-action-default-hovered",
      // On click effect
      "active:bg-surface-action-default-elevated-selected-pressed",
      "active:shadow-action-default-pressed",
    ],
    "not-elevated-not-selected": [
      "bg-surface-action-default-weak-rest",
      // Hover effect
      "hover:bg-surface-action-default-weak-hovered",
      // On click effect
      "active:bg-surface-action-default-weak-pressed",
    ],
    "not-elevated-selected": [
      "bg-surface-action-main-selected-rest",
      // Hover effect
      "hover:bg-surface-action-main-selected-hovered",
      // On click effect
      "active:bg-surface-action-main-selected-pressed",
    ],
  },
} as const;

const card = cva(defaultClasses, {
  variants,
});

type InternalVariants = "selectedByElevation" | "interactibleByElevation";
type VariantCardProps = Omit<VariantProps<typeof card>, InternalVariants>;

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantCardProps & {
    actionable?: boolean;
    elevated?: boolean;
    onClick?: () => void;
    selected?: boolean;
  };

/**
 * A card container that can be displayed with children in it so that you can show
 * important information to user easily and efficiently within a container component.
 * @param props.className Classname to add to the modal container.
 * @param props.actionable Boolean to use if we want the card to be actionable
 * @param props.children Content in the middle of the modal.
 * @param props.elevated Boolean indicating whether the card should have elevated styling
 * @param props.onClick Function provided to the card to apply an effect when the card is being clicked on
 * @param props.padding Size of the padding of the card
 * @param props.selected Boolean to use if we want to show a selected state for the card, only works with item type
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-card--docs
 */
const Card: React.FC<CardProps> = ({
  className,
  actionable = false,
  children,
  elevated = false,
  onClick,
  padding = "default",
  selected = false,
  ...props
}) => {
  const selectedByElevation = useMemo(() => {
    const elevatedState = elevated ? "elevated" : "not-elevated";
    return `${elevatedState}-${selected ? "selected" : "not-selected"}`;
  }, [elevated, selected]);

  const handleClick = useCallback(() => {
    if (onClick && actionable) onClick();
  }, [actionable, onClick]);

  return (
    <div
      data-component="Kaizen-Card"
      onClick={handleClick}
      className={card({
        className,
        padding,
        actionable,
        selectedByElevation: actionable
          ? (selectedByElevation as keyof typeof variants.selectedByElevation)
          : null,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "KaizenCard";

export default Card;
