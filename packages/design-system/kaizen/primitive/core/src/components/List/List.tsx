import React from "react";
import { cva } from "class-variance-authority";
import Header, { ListHeaderProps } from "./Header";
import Item, { ListItemProps } from "./Item";
import { ChipProps } from "#src/components/Chip";
import { CheckboxProvider } from "#src/contexts/CheckboxContext";

const defaultClasses = [
  "flex",
  "min-h-2xl",
  "py-xs",
  "px-md",
  "justify-between",
  "items-center",
  "gap-xs",
  "self-stretch",
  "border-b-stroke-thin",
  "border-b-stroke-divider",
] as const;

const variants = {
  selected: {
    true: [
      "bg-surface-action-main-selected-rest",
      "hover:bg-surface-action-main-selected-hovered",
      "active:bg-surface-action-main-selected-pressed",
    ],
    false: [
      "hover:bg-surface-action-default-weak-hovered",
      "active:bg-surface-action-default-weak-pressed",
    ],
  },
} as const;

export const listItem = cva(defaultClasses, {
  variants,
  defaultVariants: { selected: false },
});

export type ListItemChipsProps = Omit<ChipProps, "dismissible" | "onClick">;

export type ListProps = {
  className?: string;
  id: string;
  header?: ListHeaderProps;
  items?: ListItemProps[];
  isSelectable?: boolean;
};

/**
 * A list component that can contain multiple `Item` components and one `Header` component.
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.
 * @param className Classname to add to the list container.
 * @param id Optional ID for the list.
 * @param header Optional header component to display at the top of the list.
 * @param items An array of `Item` components to display in the list.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-list--docs
 */
const List: React.FC<ListProps> = ({
  className,
  id,
  header,
  items,
  isSelectable = false,
}: ListProps) => {
  const valueIds = items?.map((item) => item.id) ?? [];
  return (
    <CheckboxProvider valueIds={valueIds}>
      <div className={className} id={id}>
        {!!header && <Header {...header} isSelectable={isSelectable} />}
        {items?.map((item) => (
          <Item {...item} key={item.id} isSelectable={isSelectable} />
        ))}
      </div>
    </CheckboxProvider>
  );
};

List.displayName = "KaizenList";

export default List;
