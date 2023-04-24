// @ts-nocheck
import { List, Paper } from '@material-ui/core';
import React from 'react';
import { Giftcard } from '../types';
import GiftcardListItem from './GiftcardListItem.component';

type Props = {
  giftcardList: Array<Giftcard>;
  onDuplicate?: (id: number) => void | null;
  onEdit?: (id: number) => void | null;
  onRemove?: (id: number) => void | null;
  onRestore?: (id: number) => void | null;
  onClick?: (id: number) => void;
};

export function GiftcardList(props: Props) {
  const { giftcardList, onDuplicate, onEdit, onRemove, onRestore, onClick } =
    props;
  if (!giftcardList.length) return null;
  return (
    <Paper>
      <List disablePadding>
        {giftcardList.map((card, i) => {
          const divider = i !== giftcardList.length - 1;
          return (
            <GiftcardListItem
              divider={divider}
              giftcard={card}
              onDuplicate={card.is_shared_giftcard ? undefined : onDuplicate}
              onEdit={onEdit}
              onRemove={card.is_shared_giftcard ? undefined : onRemove}
              onRestore={card.is_shared_giftcard ? undefined : onRestore}
              onClick={onClick}
              key={`${i}-${card.name}`}
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default GiftcardList;
