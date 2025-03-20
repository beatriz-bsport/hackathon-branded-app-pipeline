import React, { useMemo } from 'react';

import { withTranslation } from 'react-i18next';

import clsx from 'clsx';
import { TFunction } from 'i18next';
// @ts-expect-error
import ShopItemListItem from './ShopItemListItem.component';
// @ts-expect-error
import Selector from '../../../components/Selector.component';

import { getShopItemName } from '#src/libs/shop/utils';

import type { ShopItem } from '#src/libs/shop/types';

type Props = {
  classes: Object;
  shopItemList: Array<ShopItem>;
  onChange: (id?: number) => void;
  helperText: string;
  nullCurrentValue?: boolean;
  value?: number;
  selectorClass: string;
  t: TFunction;
  autofocus: boolean;
  disabled?: boolean;
};

type OptionProps = {
  data: Object;
  innerRef: Object;
  innerProps: Object;
  isSelected?: boolean;
  isFocused: boolean;
};

export function shopItemOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    // @ts-expect-error
    <div ref={innerRef} {...innerProps}>
      <ShopItemListItem
        button
        dense
        noDivider
        isFocused={isFocused}
        selected={isSelected}
        // @ts-expect-error
        shopitem={data.pp}
      />
    </div>
  );
}
// @ts-expect-error
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
  const suggestions = useMemo(
    () =>
      shopItemList
        // @ts-expect-error
        .asMutable()
        // @ts-expect-error
        .sort((pp, pp_) => pp.name.localeCompare(pp_.name))
        // @ts-expect-error
        .map((pp) => ({
          value: pp.id,
          label: getShopItemName({
            name: pp?.name ?? '',
            color: pp?.color ?? '',
            size: pp?.size ?? '',
          }),
          pp,
        })),
    [shopItemList],
  );

  return (
    <Selector
      searchIcon
      autofocus={autofocus}
      className={clsx(classes, selectorClass)}
      components={{ Option: shopItemOption }}
      filterOption={filterShopItem}
      isDisabled={!!props.disabled}
      nullCurrentValue={nullCurrentValue}
      // @ts-expect-error
      onChange={(event) => onChange(event.value)}
      placeholder={helperText || props.t('shopitem.selector.placeholder')}
      selected={value}
      suggestions={suggestions}
    />
  );
}
// @ts-expect-error
export default withTranslation(['shop'])(ShopItemSelector);
