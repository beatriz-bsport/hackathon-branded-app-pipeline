// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';

import classNames from 'classnames';
import ShopItemListItem from './ShopItemListItem.component';

import Selector from '../../../components/Selector.component';

import type { ShopItem } from '../types';

type Props = {
  classes: Object,
  shopItemList: Array<ShopItem>,
  onChange: (?number) => void,
  helperText: string,
  nullCurrentValue?: boolean,
  value: ?number,
  selectorClass: string,
  t: TFunction,
  autofocus: boolean,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected?: boolean,
  isFocused: boolean,
};

function shopItemOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ShopItemListItem
        selected={isSelected}
        isFocused={isFocused}
        shopitem={data.pp}
        noDivider
        button
        dense
      />
    </div>
  );
}

const filterShopItem = (option, text) => {
  const searchtextLower = text.toLowerCase();
  if (
    option.label.toLowerCase().includes(searchtextLower) ||
    option.data.pp.barcode.toLowerCase().includes(searchtextLower)
  ) {
    return true;
  }
  return false;
};

export function ShopItemSelector(props: Props) {
  const {
    value,
    onChange,
    shopItemList,
    classes,
    selectorClass,
    helperText,
    nullCurrentValue,
    autofocus,
  } = props;
  const suggestions = shopItemList
    .asMutable()
    .sort((pp, pp_) => pp.name > pp_.name)
    .map((pp) => ({ value: pp.id, label: pp.name, pp }));

  return (
    <Selector
      autofocus={autofocus}
      searchIcon
      nullCurrentValue={nullCurrentValue}
      selected={value}
      suggestions={suggestions}
      className={classNames(classes, selectorClass)}
      components={{ Option: shopItemOption }}
      filterOption={filterShopItem}
      placeholder={helperText || props.t('shopitem.selector.placeholder')}
      onChange={(event) => onChange(event.value)}
    />
  );
}

export default withTranslation(['shop'])(ShopItemSelector);
