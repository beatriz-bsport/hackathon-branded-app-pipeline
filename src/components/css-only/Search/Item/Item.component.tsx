import React from 'react';

import { BaseAdditionalData, SearchItemData } from '../Search.component';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './style.css';

export type Props = {
  item: SearchItemData<BaseAdditionalData>;
  renderItem: React.FC<any>;
};

const Item: React.FC<Props> = ({ item, renderItem }) => {
  return (
    <li key={item.id} className="bs-search-list-item">
      {renderItem ? renderItem(item) : <>{item.name}</>}
    </li>
  );
};

export const ItemForStorybook = marketplaceCssHoc()(Item);

export default Item;
