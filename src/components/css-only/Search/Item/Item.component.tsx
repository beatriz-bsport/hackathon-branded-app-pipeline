import React from 'react';

import { BaseAdditionalData, SearchItemData } from '../Search.component';
import './style.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  item: SearchItemData<BaseAdditionalData>;
  renderItem: React.FC<any>;
};

const Item: React.FC<Props> = ({ item, renderItem }) => {
  return (
    <li className="bs-search-list-item" key={item.id}>
      {renderItem ? renderItem(item) : <>{item.name}</>}
    </li>
  );
};

export const ItemForStorybook = marketplaceCssHoc()(Item);

export default Item;
