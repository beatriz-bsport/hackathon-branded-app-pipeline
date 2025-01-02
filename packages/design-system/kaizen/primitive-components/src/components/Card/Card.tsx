import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SetRequired } from "type-fest";

const defaultClasses = [
  "rounded-md",
  "flex",
  "flex-col",
  "gap-md",
  "border-stroke-action-default-rest",
] as const;

const variants = {
  padding: {
    default: "p-md",
    sm: "p-2xs",
    none: "p-[0]",
  },
  elevated: {
    true: ["bg-surface-default-elevated", "border-stroke-thin"],
    false: [],
  },
  interactibleByElevation: {
    "elevated-interactible": [
      // Hover effect
      "hover:ease-in-out duration-short",
      "hover:shadow-action-default-hovered",
      "hover:bg-surface-action-default-elevated-hovered",
      // on click effect
      "active:shadow-action-default-pressed",
      "active:bg-surface-action-default-elevated-pressed",
    ],
    "not-elevated-interactible": [
      // Hover effect
      "hover:ease-in-out duration-short",
      "hover:shadow-action-default-hovered",
      "hover:bg-onsurface-default-onstrong",
      // on click effect
      "active:shadow-action-default-pressed",
      "active:bg-surface-action-default-elevated-pressed",
      "active:bg-onsurface-default-onstrong",
    ],
    "elevated-not-interactible": [],
    "not-elevated-not-interactible": [],
  },
  selectedByElevation: {
    "elevated-selected": [
      "!bg-surface-action-default-elevated-selected",
      "!border-stroke-regular",
      "shadow-inner-action-default-selected",
      "border-stroke-action-default-selected",
    ],
    "not-elevated-selected": ["bg-surface-action-selected-rest"],
    "elevated-not-selected": [],
    "not-elevated-not-selected": [],
  },
} as const;

export const CardTypeValues = ["action", "info", "item"] as const;
export type CardType = (typeof CardTypeValues)[number];

const card = cva(defaultClasses, {
  variants,
});

type InternalVariants = "selectedByElevation" | "interactibleByElevation";

type VariantCardProps = SetRequired<
  Omit<VariantProps<typeof card>, InternalVariants>,
  // Required variants
  "elevated"
>;

/**
 * A card container that can be displayed with children in it so that you can show
 * important informations to user easily and efficiently within a container component.
 * @param props.className Classname to add to the modal container.
 * @param props.children Content in the middle of the modal.
 * @param props.elevated boolean to use if we want the card to have a bg or not
 * @param props.padding size of the padding of the card
 * @param props.onClick function provided to the card to apply an effect when the card is being clicked on
 * @param props.selected boolean to use if we want to show a selected state for the card, only works with item type
 * @param props.type type of the card to manage different behavior, can be "action", "info", "item"
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-card--docs
 */
export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantCardProps & {
    elevated?: boolean;
    padding?: "default" | "sm" | "none";
    onClick?: () => void;
    selected?: boolean;
    type: CardType;
  };

const Card: React.FC<CardProps> = ({
  className,
  children,
  elevated = true,
  padding = "default",
  onClick,
  selected,
  type,
  ...props
}) => {
  const selectedByElevation = React.useMemo(() => {
    const elevatedState = elevated ? "elevated" : "not-elevated";
    return `${elevatedState}-${selected && type === "item" ? "selected" : "not-selected"}`;
  }, [elevated, selected, type]);

  const interactibleByElevation = React.useMemo(() => {
    const elevatedState = elevated ? "elevated" : "not-elevated";
    return `${elevatedState}-${type !== "info" ? "interactible" : "not-interactible"}`;
  }, [elevated, type]);

  const handleClick = React.useCallback(() => {
    if (onClick && type !== "info") onClick();
  }, [onClick, type]);

  return (
    <div
      onClick={handleClick}
      className={card({
        className,
        elevated,
        padding,
        selectedByElevation:
          selectedByElevation as keyof typeof variants.selectedByElevation,
        interactibleByElevation:
          interactibleByElevation as keyof typeof variants.interactibleByElevation,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "KaizenCard";

export default Card;
