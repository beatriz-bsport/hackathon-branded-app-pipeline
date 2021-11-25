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
import React, { useState } from 'react';
import memoize from 'memoize-one';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
} from '../../types';
import { OptionCallback } from '../../../../state/types';
import PrivatePassCategoryItemWithPrivatePasses, {
  PresentationalComponentPassCategory,
} from './PrivatePassCategoryItemWithPrivatePasses';
import { ManagerOnly } from '#libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';

type Props = {
  goToPass: (id: number) => void;
  setOpenDeletePassDialog: (id: number) => void;
  updatePassOrder: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  updateCategoryOrder: (
    category: Array<{ id: number; category_ordering: number }>,
  ) => void;
  privatePassCategoryById: Array<PrivatePassCategoryWithPasses>;
  onEditPass: (pass: PrivatePass) => void;
  setSelectedCategory: (cat: PrivatePassCategory) => void;
  showCategoryEditDialog: () => void;
  deletePrivatePassCategory: (category: PrivatePassCategory) => void;
  filterManagerOnly: ManagerOnly;
  privatePassOrder: Array<{ id: number; ordering_in_category: number }>;
  filteredCategories: Array<number>;
};

const handleDragEndCategory = memoize(
  (categoryOrderingOverride, updateCategory, items, event) => {
    const { active, over } = event;

    let overrideIndex = categoryOrderingOverride;
    if (over && active.id !== over.id) {
      // new position of the dragged category
      const newIndex =
        over.data.current.sortable.index >= 0
          ? over.data.current.sortable.index
          : over.data.current.sortable.items.length - 1;
      // old position
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<number>;
      // all ids sorted in the right order
      const privatePassCategoryIds = active.data.current.categoryIds;
      // place the dropped category at the right position
      if (newIndex > oldIndex)
        arr = [
          ...privatePassCategoryIds.slice(0, oldIndex),
          ...privatePassCategoryIds.slice(oldIndex + 1, newIndex + 1),
          privatePassCategoryIds[oldIndex],
          ...privatePassCategoryIds.slice(newIndex + 1),
        ];
      else
        arr = [
          ...privatePassCategoryIds.slice(0, newIndex),
          privatePassCategoryIds[oldIndex],
          ...privatePassCategoryIds.slice(newIndex, oldIndex),
          ...privatePassCategoryIds.slice(oldIndex + 1),
        ];
      // build the list of categories that changed position and update them
      const toUpdate: { id: number; category_ordering: number }[] = [];
      arr.forEach((categoryId, index) => {
        if (categoryId !== privatePassCategoryIds[index]) {
          const newOrdering =
            categoryOrderingOverride[privatePassCategoryIds[index]] ||
            categoryOrderingOverride[privatePassCategoryIds[index]] === 0
              ? categoryOrderingOverride[privatePassCategoryIds[index]]
              : items.find((cat) => privatePassCategoryIds[index] === cat.id)
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
      updateCategory(toUpdate);
    }
    return overrideIndex;
  },
);

const handleDragEndPaymentPack = memoize(
  (frontendOrderingOverride, updatePassOrder, event) => {
    const { active, over } = event;
    let overrideIndex = frontendOrderingOverride;
    const passes = [...active.data.current.category.ppasses];
    if (
      over &&
      active.id !== over.id &&
      passes.find((pp: PrivatePass) => pp.id === Number(over.id))
    ) {
      // new position of the dragged pass
      const newIndex = over.data.current.sortable.index;
      // old position
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<PrivatePass> = null;
      // place the dropped pass at the right position
      if (newIndex > oldIndex) {
        arr = [
          ...passes.slice(0, oldIndex),
          ...passes.slice(oldIndex + 1, newIndex + 1),
          passes[oldIndex],
          ...passes.slice(newIndex + 1),
        ];
      } else if (newIndex < oldIndex) {
        arr = [
          ...passes.slice(0, newIndex),
          passes[oldIndex],
          ...passes.slice(newIndex, oldIndex),
          ...passes.slice(oldIndex + 1),
        ];
      }
      // build the list of passes that changed position and update them
      if (arr) {
        const toUpdate = [];
        arr.forEach((pp, index) => {
          if (pp.id !== passes[index].id) {
            const newOrdering = passes[index].ordering_in_category;
            overrideIndex = {
              ...overrideIndex,
              [pp.id]: newOrdering,
            };
            toUpdate.push({
              id: pp.id,
              ordering_in_category: newOrdering,
            });
          }
        });
        updatePassOrder(toUpdate);
      }
    }
    return overrideIndex;
  },
);

export const PrivatePassCategoryList = (props: Props) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [activeId, setActiveId] = useState(null);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);

  const [categoryOrderingOverride, setCategoryOrderingOverride] = useState({});

  const [frontendOrderingOverride, setFrontendOrderingOverride] =
    React.useState({});

  const renderOverlay = () => {
    if (!activeId) return null;
    const activeIdNum = parseInt(activeId, 10);
    const category = props.privatePassCategoryById.find(
      (cat) => cat.id === activeIdNum,
    );
    if (category)
      return (
        <PresentationalComponentPassCategory privatePassCategory={category} />
      );
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    if (
      props.privatePassCategoryById.find(
        (cat) => cat.id === parseInt(active.id, 10),
      )
    )
      setIsCategoryDragging(true);
  };

  const handleDragEnd = (event) => {
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
      setFrontendOrderingOverride(
        handleDragEndPaymentPack(
          frontendOrderingOverride,
          props.updatePassOrder,
          event,
        ),
      );
    }
    setActiveId(null);
  };

  let userOrder = {};
  props.privatePassOrder?.forEach((pass) => {
    userOrder[pass.id] = pass.ordering_in_category;
  });
  if (!props.privatePassOrder) userOrder = null;

  const items = [...props.privatePassCategoryById].sort(
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
          return !props.filteredCategories.length ||
            props.filteredCategories?.includes(category.id || -1) ? (
            <PrivatePassCategoryItemWithPrivatePasses
              key={category.id}
              privatePassOrder={userOrder}
              privatePassCategory={category}
              privatePassCategoryIds={items.map((cat) => cat.id)}
              orderingOverride={frontendOrderingOverride}
              filterManagerOnly={props.filterManagerOnly}
              isCategoryFiltered={!!props.filteredCategories.length}
              onClick={props.goToPass}
              onDelete={props.setOpenDeletePassDialog}
              onEdit={props.onEditPass}
              isCategoryDragging={isCategoryDragging}
              setSelectedCategory={props.setSelectedCategory}
              showCategoryEditDialog={props.showCategoryEditDialog}
              deletePrivatePassCategory={props.deletePrivatePassCategory}
            />
          ) : null;
        })}
      </SortableContext>
      <DragOverlay>{activeId ? renderOverlay() : null}</DragOverlay>
    </DndContext>
  );
};
