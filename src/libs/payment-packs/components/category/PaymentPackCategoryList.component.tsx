import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import PaymentPackCategoryItemWithPaymentPack from './PaymentPackCategoryItemWithPaymentPack.component';
import type { PaymentPack, PaymentPackCategory } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';
import { OptionCallback } from '../../../../state/types';

type OwnProps = {
  paymentPackByCategory: Array<PaymentPack>;
  onEdit: (pp: PaymentPack) => void;
  onDelete: (pp: PaymentPack) => void;
  onClick: (ppId: number) => void;
  onRestore: (ppId: number) => void;
  updatePack: (
    obj: { id: number; ordering_in_category: number },
    options?: OptionCallback,
  ) => void;
  // updateCategory: (category: PaymentPackCategory) => void;
  setSelectedCategory: (category: PaymentPackCategory) => void;
  showCategoryEditDialog: () => void;
  deletePaymentPackCategory: (category: PaymentPackCategory) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const PaymentPackListByCategory = (props: Props) => {
  const [
    frontendOrderingOverride,
    setFrontendOrederingOverride,
  ] = React.useState({});

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const packs = active.data.current.category.packs;
    let overrideIndex = frontendOrderingOverride;

    if (
      over &&
      active.id !== over.id &&
      packs.find((pp: PaymentPack) => pp.id === Number(over.id))
    ) {
      const newIndex = over.data.current.sortable.index;
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<PaymentPack> = null;
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
      if (arr) {
        arr.forEach((pp, index) => {
          if (pp.id !== packs[index].id) {
            const newOrdering = packs[index].ordering_in_category;
            overrideIndex = {
              ...overrideIndex,
              [pp.id]: newOrdering,
            };
            props.updatePack({
              id: pp.id,
              ordering_in_category: newOrdering,
            });
          }
        });
      }
    }
    setFrontendOrederingOverride(overrideIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
    >
      {props.paymentPackByCategory.map((ppcat) => (
        <PaymentPackCategoryItemWithPaymentPack
          orderingOverride={frontendOrderingOverride}
          key={ppcat.id}
          paymentPackCategory={ppcat}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
          onClick={props.onClick}
          onRestore={props.onRestore}
          setSelectedCategory={props.setSelectedCategory}
          showCategoryEditDialog={props.showCategoryEditDialog}
          deletePaymentPackCategory={props.deletePaymentPackCategory}
        />
      ))}
    </DndContext>
  );
};
const styles = (theme: Theme) => ({
  titleContainer: {
    marginBottom: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
)(PaymentPackListByCategory);
