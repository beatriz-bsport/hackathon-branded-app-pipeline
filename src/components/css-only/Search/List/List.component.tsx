import React from 'react';

import {
  BaseAdditionalData,
  SearchItemData,
} from '#src/components/css-only/Search/Search.component';
import Item from '#src/components/css-only/Search/Item';

import './styles.css';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

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

export const ListForStorybook = marketplaceCssHoc()(List);

export default List;
