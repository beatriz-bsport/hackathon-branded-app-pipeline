import React, { memo, useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import memoize from 'memoize-one';

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
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import PaymentPackCategoryItemWithPaymentPack, {
  PresentationalComponentPackCategory,
} from './PaymentPackCategoryItemWithPaymentPack.component';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
} from '../../types';
import { MaterialStyleType } from '../../../../utils/types';
import { OptionCallback } from '../../../../state/types';
import { ManagerOnly } from '../PaymentPackFilterAndSortHeader.component';

type OwnProps = {
  paymentPackOrder: Array<{ id: number; ordering_in_category: number }>;
  filterManagerOnly: ManagerOnly;
  filteredCategories: Array<number>;
  paymentPackByCategory: Array<PaymentPackCategoryWithPacks>;
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  updatePack: (
    objs: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  updateCategory: (
    category: Array<{ id: number; category_ordering: number }>,
  ) => void;
  setSelectedCategory: (category: PaymentPackCategory) => void;
  showCategoryEditDialog: () => void;
  deletePaymentPackCategory: (category: PaymentPackCategory) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const handleDragEndCategory = memoize(
  (categoryOrderingOverride, updateCategory, items, event) => {
    const { active, over } = event;
    let overrideIndex = categoryOrderingOverride;
    if (over && active.id !== over.id) {
      // new position of the dragged category
      const newIndex = over.data.current.sortable.index;
      // old position
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<number>;
      // all ids sorted in the right order
      const paymentPackCategoryIds = active.data.current.categoryIds;
      // place the dropped category at the right position
      if (newIndex > oldIndex)
        arr = [
          ...paymentPackCategoryIds.slice(0, oldIndex),
          ...paymentPackCategoryIds.slice(oldIndex + 1, newIndex + 1),
          paymentPackCategoryIds[oldIndex],
          ...paymentPackCategoryIds.slice(newIndex + 1),
        ];
      else
        arr = [
          ...paymentPackCategoryIds.slice(0, newIndex),
          paymentPackCategoryIds[oldIndex],
          ...paymentPackCategoryIds.slice(newIndex, oldIndex),
          ...paymentPackCategoryIds.slice(oldIndex + 1),
        ];
      // build the list of categories that changed position and update them
      const toUpdate: { id: number; category_ordering: number }[] = [];
      arr.forEach((categoryId, index) => {
        if (categoryId !== paymentPackCategoryIds[index]) {
          const newOrdering =
            categoryOrderingOverride[paymentPackCategoryIds[index]] ||
            categoryOrderingOverride[paymentPackCategoryIds[index]] === 0
              ? categoryOrderingOverride[paymentPackCategoryIds[index]]
              : items.find((cat) => paymentPackCategoryIds[index] === cat.id)
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
  (frontendOrderingOverride, updatePack, event) => {
    const { active, over } = event;
    // packs of the right category sorted in the right order
    const packs = [...active.data.current.category.packs];
    let overrideIndex = frontendOrderingOverride;

    if (
      over &&
      active.id !== over.id &&
      packs.find((pp: PaymentPack) => pp.id === parseInt(over.id, 10))
    ) {
      // new position of the dragged pack
      const newIndex = over.data.current.sortable.index;
      // old position
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<PaymentPack> = null;
      // place the dropped pack at the right position
      if (newIndex > oldIndex) {
        arr = [
          ...packs.slice(0, oldIndex),
          ...packs.slice(oldIndex + 1, newIndex + 1),
          packs[oldIndex],
          ...packs.slice(newIndex + 1),
        ];
      } else if (newIndex < oldIndex) {
        arr = [
          ...packs.slice(0, newIndex),
          packs[oldIndex],
          ...packs.slice(newIndex, oldIndex),
          ...packs.slice(oldIndex + 1),
        ];
      }
      // build the list of categories that changed position and update them
      if (arr) {
        const toUpdate: { id: number; ordering_in_category: number }[] = [];
        arr.forEach((pp, index) => {
          if (pp.id !== packs[index].id) {
            const newOrdering =
              frontendOrderingOverride[packs[index].id] ||
              frontendOrderingOverride[packs[index].id] === 0
                ? frontendOrderingOverride[packs[index].id]
                : packs[index].ordering_in_category;
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
        updatePack(toUpdate);
      }
    }
    return overrideIndex;
  },
);

export const PaymentPackListByCategory = memo((props: Props) => {
  const [frontendOrderingOverride, setFrontendOrderingOverride] = useState({});

  const [activeId, setActiveId] = useState(null);
  const [isCategoryDragging, setIsCategoryDragging] = useState(false);

  const [categoryOrderingOverride, setCategoryOrderingOverride] = useState({});

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const renderOverlay = () => {
    if (!activeId) return null;
    const activeIdNum = parseInt(activeId, 10);
    const category = props.paymentPackByCategory.find(
      (cat) => cat.id === activeIdNum,
    );
    if (category)
      return (
        <PresentationalComponentPackCategory paymentPackCategory={category} />
      );
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    if (
      props.paymentPackByCategory.find(
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
          props.updateCategory,
          items,
          event,
        ),
      );
      setIsCategoryDragging(false);
    } else {
      setFrontendOrderingOverride(
        handleDragEndPaymentPack(
          frontendOrderingOverride,
          props.updatePack,
          event,
        ),
      );
    }
    setActiveId(null);
  };

  let userOrder = {};
  props.paymentPackOrder?.forEach((pack) => {
    userOrder[pack.id] = pack.ordering_in_category;
  });
  if (!props.paymentPackOrder) userOrder = null;

  const items = [...props.paymentPackByCategory].sort(
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
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={items.filter((cat) => cat.id).map((cat) => cat.id.toString(10))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((ppcat) => {
          return !props.filteredCategories.length ||
            props.filteredCategories?.includes(ppcat.id || -1) ? (
            <PaymentPackCategoryItemWithPaymentPack
              isCategoryFiltered={!!props.filteredCategories.length}
              paymentPackOrder={userOrder}
              filterManagerOnly={props.filterManagerOnly}
              orderingOverride={frontendOrderingOverride}
              key={ppcat.id}
              paymentPackCategory={ppcat}
              paymentPackCategoryIds={items.map((cat) => cat.id)}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
              onClick={props.onClick}
              onRestore={props.onRestore}
              setSelectedCategory={props.setSelectedCategory}
              showCategoryEditDialog={props.showCategoryEditDialog}
              deletePaymentPackCategory={props.deletePaymentPackCategory}
              isCategoryDragging={isCategoryDragging}
            />
          ) : null;
        })}
      </SortableContext>
      <DragOverlay>{activeId ? renderOverlay() : null}</DragOverlay>
    </DndContext>
  );
});
const styles = (theme: Theme) => ({
  titleContainer: {
    marginBottom: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackListByCategory);
