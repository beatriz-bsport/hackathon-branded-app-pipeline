// @ts-nocheck
import React from 'react';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';
import Item from '#components/css-only/Search/Item';

import './styles.css';

export type Props = {
  items: SearchItemData<BaseAdditionalData>[];
  renderItem: React.FC<any>;
};

const List: React.FC<Props> = React.memo(({ items, renderItem }) => {
  return (
    <ul className="bs-search-list">
      {items?.map((item) => (
        <Item key={item.id} item={item} renderItem={renderItem} />
      ))}
    </ul>
  );
});

export default marketplaceCssHoc()(List);
