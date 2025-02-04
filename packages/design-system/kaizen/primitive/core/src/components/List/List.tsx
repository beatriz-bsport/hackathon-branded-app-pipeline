import React from "react";
import { cva } from "class-variance-authority";
import Header, { ListHeaderProps } from "./Header";
import Item, { ListItemProps } from "./Item";
import { ChipProps } from "#src/components/Chip";
import { CheckboxProvider } from "#src/contexts/CheckboxContext";
import type { PaginationProps } from "#src/components/private/Pagination";
import { usePagination } from "#src/hooks/use-pagination";

const defaultClasses = [
  "flex",
  "min-h-2xl",
  "py-xs",
  "px-md",
  "gap-xs",
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
  isLink: {
    true: "",
    false: "flex w-full justify-between items-center gap-xs self-stretch",
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
  paginationProps?: PaginationProps;
};

/**
 * A list component that can contain multiple `Item` components and one `Header` component.
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.
 * @param className Classname to add to the list container.
 * @param id Optional ID for the list.
 * @param header Optional header component to display at the top of the list.
 * @param items An array of `Item` components to display in the list.
 * @param paginationProps An object gathering all properties passed to Pagination component.
 * If undefined, the Pagination will not be rendered and therefore the list will not be paginated.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-list--docs
 */
const List: React.FC<ListProps> = ({
  className,
  id,
  header,
  items,
  isSelectable = false,
  paginationProps,
}: ListProps) => {
  const valueIds = items?.map((item) => item.id) ?? [];

  const pagination = usePagination(paginationProps);

  return (
    <CheckboxProvider valueIds={valueIds}>
      <div className={className} id={id}>
        {!!header && <Header {...header} isSelectable={isSelectable} />}
        {items?.map((item) => (
          <Item {...item} key={item.id} isSelectable={isSelectable} />
        ))}
        {pagination}
      </div>
    </CheckboxProvider>
  );
};

List.displayName = "KaizenList";

export default List;
