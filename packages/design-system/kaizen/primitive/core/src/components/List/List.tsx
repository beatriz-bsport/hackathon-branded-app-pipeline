import { cva } from "class-variance-authority";
import React from "react";

import { ChipProps } from "#src/components/Chip";
import type { PaginationProps } from "#src/components/private/Pagination";
import { CheckboxProvider } from "#src/contexts/CheckboxContext";
import useEmptyState, {
  type UseEmptyStateProps,
} from "#src/hooks/use-empty-state.hook";
import {
  type UseLoadingStateProps,
  useLoadingState,
} from "#src/hooks/use-loading-state";
import { usePagination } from "#src/hooks/use-pagination";

import Collapse, { type CollapseProps } from "../Collapse";
import Header, { type ListHeaderProps } from "./Header";
import Item, { type ListItemProps } from "./Item";

const defaultClasses = [
  "relative",
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

export type ListContentProps = {
  items?: ListItemProps[];
  paginationProps?: PaginationProps;
  emptyStateProps?: UseEmptyStateProps;
  isSelectable?: boolean;
};

export type ListProps = {
  className?: string;
  id: string;
  header?: ListHeaderProps;
  loadingProps?: UseLoadingStateProps;
  collapsibleProps?: Omit<CollapseProps, "children">;
} & ListContentProps;
/**
 * A list component that can contain multiple `Item` components and one `Header` component.
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.
 * @param className Classname to add to the list container.
 * @param loadingProps [Optional] Dictionnary of props to manage the loading state rendering
 * - message [Optional] string of the loading message to display;
 * - className [Optional] string, tailwind css classes to add to the loading component;
 * - isLoading [Optional] Whether the fetch return a loading list;
 * @param emptyStateProps [Optional] Dictionnary of props to manage the empty state rendering
 * - emptyConfig Configuration to display the empty state UI when isEmpty is true;
 * - emptySearchConfig [Optional] Configuration to display the empty search UI when isEmptySearch is true;
 * - isEmpty Whether the fetch return an empty list;
 * - isEmptySearch [Optional] Whether the filtering return an empty list;
 * @param id Optional ID for the list.
 * @param header Optional header component to display at the top of the list.
 * @param items An array of `Item` components to display in the list.
 * @param paginationProps An object gathering all properties passed to Pagination component.
 * @param props.collapsibleProps Object allow the list to be transformed in a collapsible list and to hide its content.
 * If undefined, the Pagination will not be rendered and therefore the list will not be paginated.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-list--docs
 */
const List: React.FC<ListProps> = ({
  className,
  id,
  header,
  items,
  isSelectable = false,
  collapsibleProps,
  paginationProps,
  emptyStateProps,
  loadingProps,
}: ListProps) => {
  const valueIds = items?.map((item) => item.id) ?? [];

  const { shouldRenderLoadingState, LoadingState } =
    useLoadingState(loadingProps);

  if (shouldRenderLoadingState) return <LoadingState />;

  return (
    <Collapse {...collapsibleProps}>
      <CheckboxProvider valueIds={valueIds}>
        <div className={className} id={id}>
          {!!header && (
            <Collapse.Controller>
              {({ isCollapseOpen, setIsCollapseOpen }) => {
                const toggleOpen = () =>
                  setIsCollapseOpen((prevState) => !prevState);

                return (
                  <Header
                    {...header}
                    collapsibleProps={collapsibleProps}
                    isSelectable={isSelectable}
                    onCollapse={toggleOpen}
                    isCollapseOpen={isCollapseOpen}
                  />
                );
              }}
            </Collapse.Controller>
          )}
          {collapsibleProps ? (
            <Collapse.Content>
              <ListContent
                isSelectable={isSelectable}
                items={items}
                emptyStateProps={emptyStateProps}
                paginationProps={paginationProps}
              />
            </Collapse.Content>
          ) : (
            <ListContent
              isSelectable={isSelectable}
              items={items}
              emptyStateProps={emptyStateProps}
              paginationProps={paginationProps}
            />
          )}
        </div>
      </CheckboxProvider>
    </Collapse>
  );
};

const ListContent: React.FC<ListContentProps> = ({
  isSelectable,
  emptyStateProps,
  items,
  paginationProps,
}) => {
  const pagination = usePagination(paginationProps);

  const { shouldRenderEmptyState, EmptyState } = useEmptyState(emptyStateProps);

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <>
      {items?.map((item) => (
        <Item {...item} key={item.id} isSelectable={isSelectable} />
      ))}
      {pagination}
    </>
  );
};

List.displayName = "KaizenList";

export default List;
