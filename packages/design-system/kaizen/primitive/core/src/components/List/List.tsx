import { cva, cx } from "class-variance-authority";
import React from "react";

import { ChipProps } from "#src/components/Chip";
import type { PaginationProps } from "#src/components/private/Pagination";
import {
  CheckboxProvider,
  useCheckboxContext,
} from "#src/contexts/CheckboxContext";
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
  compactMode: {
    true: ["h-fit"],
    false: ["min-h-2xl"],
  },
} as const;

export const listItem = cva(defaultClasses, {
  variants,
  defaultVariants: { selected: false, compactMode: false },
});

export type ListItemChipsProps = Omit<ChipProps, "dismissible" | "onClick">;

// Common props for both List and ListContent
type CommonListProps = {
  paginationProps?: PaginationProps;
  emptyStateProps?: UseEmptyStateProps;
  isSelectable?: boolean;
};

// Discriminated union for the item/ListItem pair
type ListVariantProps<T extends { id: string }> =
  | {
      items?: ListItemProps[];
      ListItem?: undefined;
    }
  | {
      items: T[];
      /**
       * A custom component to render for each item in the list.
       * This component will receive all properties of the item object,
       * plus `isSelectable`, `selected`, and `onSelect` props.
       *
       * @example
       * ```tsx
       * const CustomListItem = ({ name, role, isSelectable, selected, onSelect }) => (
       *   <div>
       *     {isSelectable && <input type="checkbox" checked={selected} onChange={onSelect} />}
       *     <p>{name} - {role}</p>
       *   </div>
       * );
       *
       * <List items={customItems} ListItem={CustomListItem} />
       * ```
       */
      ListItem: React.ComponentType<
        T & {
          isSelectable?: boolean;
          selected?: boolean;
          onSelect?: () => void;
          isCompact?: boolean;
        }
      >;
    };

// ListContentProps combines common props and the variant
export type ListContentProps<T extends { id: string }> = CommonListProps &
  ListVariantProps<T> & {
    isCompact?: boolean;
  };

// ListProps has its own props, and also the common/variant props
export type ListProps<T extends { id: string } = ListItemProps> =
  CommonListProps &
    ListVariantProps<T> & {
      className?: string;
      id: string;
      header?: ListHeaderProps;
      loadingProps?: UseLoadingStateProps;
      collapsibleProps?: Omit<CollapseProps, "children">;
      isCompact?: boolean;
    };
/**
 * A flexible list component that can render either default or custom list items.
 * It supports selection, pagination, loading/empty states, and collapsible sections.
 * It manages the state of checked items and provides context for each `Item` regarding its checked state.
 * @param className Classname to add to the list container.
 * @param loadingProps [Optional] Dictionnary of props to manage the loading state rendering
 * - message [Optional] string of the loading message to display;
 * - className [Optional] string, tailwind css classes to add to the loading component;
 * - isLoading [Optional] Whether the fetch return a loading list;
 * @param emptyStateProps [Optional] Dictionnary of props to manage the empty state rendering
 * - emptyConfig [Optional] Configuration to display the empty state UI when isEmpty is true;
 * - emptySearchConfig [Optional] Configuration to display the empty search UI when isEmptySearch is true;
 * - isEmpty [Optional] Whether the fetch return an empty list;
 * - isEmptySearch [Optional] Whether the filtering return an empty list;
 * @param id Optional ID for the list.
 * @param header Optional header component to display at the top of the list.
 * @param items An array of objects to display in the list. Each object must have a unique `id`.
 * These items will be rendered using either the default `Item` component or the custom `ListItem` if provided.
 * @param ListItem [Optional] A custom React component to render each item. If not provided, a default `Item` component will be used.
 * @param paginationProps An object gathering all properties passed to Pagination component.
 * @param collapsibleProps Object allow the list to be transformed in a collapsible list and to hide its content.
 * If undefined, the Pagination will not be rendered and therefore the list will not be paginated.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-list--docs
 */
const List = <T extends { id: string }>(props: ListProps<T>) => {
  const {
    className,
    id,
    header,
    loadingProps,
    collapsibleProps,
    isSelectable = false,
    ...listContentProps
  } = props;
  const valueIds = listContentProps.items?.map((item) => item.id) ?? [];

  const { shouldRenderLoadingState, LoadingState } =
    useLoadingState(loadingProps);

  if (shouldRenderLoadingState) return <LoadingState />;

  return (
    <Collapse
      className={cx({
        "h-full": !collapsibleProps,
      })}
      {...collapsibleProps}
    >
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
              <ListContent<T>
                {...listContentProps}
                isSelectable={isSelectable}
              />
            </Collapse.Content>
          ) : (
            <ListContent<T> {...listContentProps} isSelectable={isSelectable} />
          )}
        </div>
      </CheckboxProvider>
    </Collapse>
  );
};

const ListContent = <T extends { id: string }>(props: ListContentProps<T>) => {
  const {
    isSelectable,
    emptyStateProps,
    paginationProps,
    ListItem,
    items,
    isCompact,
  } = props;
  const pagination = usePagination(paginationProps);
  const { shouldRenderEmptyState, EmptyState } = useEmptyState(emptyStateProps);
  const { getCheckboxState, toggleCheckbox } = useCheckboxContext();

  if (shouldRenderEmptyState) return <EmptyState />;

  if (ListItem) {
    return (
      <>
        {items.map((item) => {
          const selected = getCheckboxState(item.id) === "checked";
          const handleSelect = () => toggleCheckbox(item.id);

          return (
            <ListItem
              {...item}
              key={item.id}
              isSelectable={isSelectable}
              selected={selected}
              onSelect={handleSelect}
            />
          );
        })}
        {pagination}
      </>
    );
  }

  return (
    <>
      {items?.map((item) => (
        <Item
          {...item}
          key={item.id}
          isSelectable={isSelectable}
          compactMode={isCompact}
        />
      ))}
      {pagination}
    </>
  );
};

List.displayName = "KaizenList";

export default List;
