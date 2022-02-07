import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useCallback, useState } from 'react';
// @ts-ignore
import memoize from 'memoize-one';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import CategoryItemWithItems, {
  PresentationalComponentCategory,
} from '#components/ordering/CategoryItem.component';
import { OptionCallback } from '../../state/types';
import {
  Category,
  CategoryWithItems,
  ListItem,
} from '#components/ordering/types';

export type Props = {
  selectedItem?: number;
  onClickItem: (id: number) => void;
  onEditItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
  onDuplicateItem?: (id: number) => void;
  updateItemOrder: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  itemLoading: boolean;

  categoryWithItems: Array<CategoryWithItems>;
  editCategory: (cat: Category) => void;
  deleteCategory: (category: CategoryWithItems) => void;
  updateCategoryOrder: (
    category: Array<{ id: number; category_ordering: number }>,
  ) => void;

  ListItemComponent: ListItem;
  width?: string | number;

  noCategoryHelper?: string;

  selectorItemOrder?: Array<{ id: number; ordering_in_category: number }>;
  filteredItems?: Array<number>;
  filteredCategories?: Array<number>;
};

const handleDragEndCategory = memoize(
  (
    categoryOrderingOverride: { [categoryId: number]: number },
    updateCategoryOrder: (
      category: Array<{ id: number; category_ordering: number }>,
    ) => void,
    items: Array<any>,
    event: { active: any; over: any },
  ) => {
    const { active, over } = event;

    let overrideIndex = categoryOrderingOverride;
    if (over && active.id !== over.id) {
      // new position of the dragged category
      const newIndex =
        over.data.current.sortable.index >= 0
          ? over.data.current.sortable.index
          : over.data.current.sortable.items.length - 1;
      // old position
      const oldIndex = active.data.current.sortable?.index || 0; // || top avoid random strange bug (rerendering ?)
      let arr: Array<number>;
      // all ids sorted in the right order
      const categoryIds =
        active.data.current.categoryIds || over.data.current.categoryIds; // || top avoid random strange bug (rerendering ?)
      // place the dropped category at the right position
      if (newIndex > oldIndex)
        arr = [
          ...categoryIds.slice(0, oldIndex),
          ...categoryIds.slice(oldIndex + 1, newIndex + 1),
          categoryIds[oldIndex],
          ...categoryIds.slice(newIndex + 1),
        ];
      else
        arr = [
          ...categoryIds.slice(0, newIndex),
          categoryIds[oldIndex],
          ...categoryIds.slice(newIndex, oldIndex),
          ...categoryIds.slice(oldIndex + 1),
        ];
      // build the list of categories that changed position and update them
      const toUpdate: { id: number; category_ordering: number }[] = [];
      arr.forEach((categoryId, index) => {
        if (categoryId !== categoryIds[index]) {
          const newOrdering =
            categoryOrderingOverride[categoryIds[index]] ||
            categoryOrderingOverride[categoryIds[index]] === 0
              ? categoryOrderingOverride[categoryIds[index]]
              : items.find((cat: any) => categoryIds[index] === cat.id)
                  .category_ordering;
          overrideIndex = {
            ...overrideIndex,
            [categoryId]: newOrdering,
          };
          toUpdate.push({
            id: categoryId,
            category_ordering: newOrdering,
          });
        }
      });
      updateCategoryOrder(toUpdate);
    }
    return overrideIndex;
  },
);

const handleDragEndItem = memoize(
  (
    frontendOrderingOverride: any,
    updateItemOrder: (
      items: { id: number; ordering_in_category: number }[],
    ) => void,
    event: { active: any; over: any },
  ) => {
    const { active, over } = event;
    let overrideIndex = frontendOrderingOverride;
    const items = [...active.data.current.category.items];
    if (
      over &&
      active.id !== over.id &&
      items.find((item) => item.id === Number(over.id))
    ) {
      // new position of the dragged item
      const newIndex = over.data.current.sortable.index;
      // old position
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<any> = null;
      // place the dropped item at the right position
      if (newIndex > oldIndex) {
        arr = [
          ...items.slice(0, oldIndex),
          ...items.slice(oldIndex + 1, newIndex + 1),
          items[oldIndex],
          ...items.slice(newIndex + 1),
        ];
      } else if (newIndex < oldIndex) {
        arr = [
          ...items.slice(0, newIndex),
          items[oldIndex],
          ...items.slice(newIndex, oldIndex),
          ...items.slice(oldIndex + 1),
        ];
      }
      // build the list of items that changed position and update them
      if (arr) {
        const toUpdate: { id: number; ordering_in_category: number }[] = [];
        arr.forEach((item, index) => {
          if (item.id !== items[index].id) {
            const newOrdering = items[index].ordering_in_category;
            overrideIndex = {
              ...overrideIndex,
              [item.id]: newOrdering,
            };
            toUpdate.push({
              id: item.id,
              ordering_in_category: newOrdering,
            });
          }
        });
        updateItemOrder(toUpdate);
      }
    }
    return overrideIndex;
  },
);

export const CategoryList = (props: Props) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCategoryDragging, setIsCategoryDragging] = useState<boolean>(false);

  const [categoryOrderingOverride, setCategoryOrderingOverride] = useState<{
    [id: number]: number;
  }>({});

  const [itemOrderingOverride, setItemOrderingOverride] = useState<{
    [id: number]: number;
  }>({});

  let userOrder: { [id: number]: number } = {};
  props.selectorItemOrder?.forEach((pass) => {
    userOrder[pass.id] = pass.ordering_in_category;
  });
  if (!props.selectorItemOrder) userOrder = null;

  const items = [...props.categoryWithItems].sort(
    (cat1, cat2) =>
      (categoryOrderingOverride[cat1.id] ||
      categoryOrderingOverride[cat1.id] === 0
        ? categoryOrderingOverride[cat1.id]
        : cat1.category_ordering) -
      (categoryOrderingOverride[cat2.id] ||
      categoryOrderingOverride[cat2.id] === 0
        ? categoryOrderingOverride[cat2.id]
        : cat2.category_ordering),
  );

  const renderOverlay = useCallback(() => {
    if (!activeId) return null;
    const activeIdNum = parseInt(activeId, 10);
    const category = props.categoryWithItems.find(
      (cat) => cat.id === activeIdNum,
    );
    if (category)
      return (
        <PresentationalComponentCategory
          category={category}
          width={props.width}
        />
      );
    return null;
  }, [activeId, props.categoryWithItems, props.width]);

  const handleDragStart = useCallback(
    ({ active }: any) => {
      setActiveId(active.id);
      if (
        props.categoryWithItems.find(
          (cat) => cat.id === parseInt(active.id, 10),
        )
      )
        setIsCategoryDragging(true);
    },
    [props.categoryWithItems],
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      if (isCategoryDragging) {
        setCategoryOrderingOverride(
          handleDragEndCategory(
            categoryOrderingOverride,
            props.updateCategoryOrder,
            items,
            event,
          ),
        );
        setIsCategoryDragging(false);
      } else {
        setItemOrderingOverride(
          handleDragEndItem(itemOrderingOverride, props.updateItemOrder, event),
        );
      }
      setActiveId(null);
    },
    [
      isCategoryDragging,
      categoryOrderingOverride,
      props.updateCategoryOrder,
      props.updateItemOrder,
      items,
      itemOrderingOverride,
    ],
  );

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items
          .filter((category) => category.id)
          .map((category) => category.id.toString(10))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((category) => {
          return !props.filteredCategories ||
            props.filteredCategories.includes(category.id) ? (
            <CategoryItemWithItems
              key={category.id}
              category={category}
              categoryIds={items.map((cat) => cat.id)}
              orderingOverride={itemOrderingOverride}
              onClick={props.onClickItem}
              onDelete={props.onDeleteItem}
              onEdit={props.onEditItem}
              onDuplicate={props.onDuplicateItem}
              isCategoryDragging={isCategoryDragging}
              editCategory={props.editCategory}
              deleteCategory={props.deleteCategory}
              ListItemComponent={props.ListItemComponent}
              selectedItem={props.selectedItem}
              noCategoryHelper={props.noCategoryHelper}
              selectorItemOrder={userOrder}
              isCategoryDraggable={!props.filteredCategories}
              filteredItems={props.filteredItems}
              width={props.width}
              itemLoading={props.itemLoading}
            />
          ) : null;
        })}
      </SortableContext>
      <DragOverlay>{activeId ? renderOverlay() : null}</DragOverlay>
    </DndContext>
  );
};
