import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { PrivatePass } from '../../types';
import { OptionCallback } from '../../../../state/types';
import PrivatePassListItem from '../pass/PrivatePassListItem.component';

type Props = {
  privatePassList: Array<PrivatePass>;
  goToPass: (id: number) => void;
  setOpenDeletePassDialog: (id: number) => void;
  updatePrivatePass: (data: any, id: number, options: OptionCallback) => void;
  updatePassOrder: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
};

export const PrivatePassCategory = (props: Props) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [
    frontendOrderingOverride,
    setFrontendOrderingOverride,
  ] = React.useState({});

  const handleDragEnd = (event) => {
    const { active, over } = event;
    let overrideIndex = frontendOrderingOverride;
    const passes = [...props.privatePassList].sort(
      (pp1, pp2) =>
        (frontendOrderingOverride[pp1.id] || pp1.ordering_in_category) -
        (frontendOrderingOverride[pp2.id] || pp2.ordering_in_category),
    );
    if (
      over &&
      active.id !== over.id &&
      passes.find((pp: PrivatePass) => pp.id === Number(over.id))
    ) {
      const newIndex = over.data.current.sortable.index;
      const oldIndex = active.data.current.sortable.index;
      let arr: Array<PrivatePass> = null;
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
        props.updatePassOrder(toUpdate);
      }
    }
    setFrontendOrderingOverride(overrideIndex);
  };

  const items = [...props.privatePassList].sort(
    (pp1, pp2) =>
      (frontendOrderingOverride[pp1.id] ||
      frontendOrderingOverride[pp1.id] === 0
        ? frontendOrderingOverride[pp1.id]
        : pp1.ordering_in_category) -
      (frontendOrderingOverride[pp2.id] ||
      frontendOrderingOverride[pp2.id] === 0
        ? frontendOrderingOverride[pp2.id]
        : pp2.ordering_in_category),
  );

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={items.map((pass: PrivatePass) => pass.id.toString(10))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((pass: PrivatePass) => (
          <PrivatePassListItem
            pass={pass}
            key={pass.id}
            divider
            onClick={() => {
              props.goToPass(pass.id);
            }}
            onDelete={() => props.setOpenDeletePassDialog(pass.id)}
            updatePrivatePass={props.updatePrivatePass}
            draggable
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
