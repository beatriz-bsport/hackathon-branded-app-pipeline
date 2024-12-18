import React from 'react';

import { Add, Remove } from '@material-ui/icons';

import Button from '#src/components/css-only/Fabrique/Button';

import './styles.css';

export type Props = {
  isAddingItemPossible: boolean;
  isItemEditionDisabled: boolean;
  itemQuantity: number;
  onAddOneItem: () => void;
  onRemoveOneItem: () => void;
};

export const ItemQuantity: React.FC<Props> = ({
  isAddingItemPossible,
  isItemEditionDisabled,
  itemQuantity,
  onAddOneItem,
  onRemoveOneItem,
}) => {
  return (
    <div className="bs-item_quantity_container">
      <Button isDisabled={isItemEditionDisabled} onClick={onRemoveOneItem}>
        <Remove className="bs-item_quantity_container--quantity_icon" />
      </Button>

      <p className="bs-item_quantity_container--quantity">{itemQuantity}</p>

      <Button
        isDisabled={isItemEditionDisabled || !isAddingItemPossible}
        onClick={onAddOneItem}
      >
        <Add className="bs-item_quantity_container--quantity_icon" />
      </Button>
    </div>
  );
};

export default React.memo(ItemQuantity);
