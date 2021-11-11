// @flow

import React from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ShopItemSummary from '../../../components/shop/ShopItemSummary.component';

import Selector from '../../../components/Selector.component';

import type { ShopItem } from '../../../api/types';

type Props = {
  shopItems: Array<ShopItem>,
  onChange: (item: ?number) => void,
  helperText: string,
  value: ?number,
  selectorClass: string,
  t: TFunction,
};

type OptionProps = {
  data: Object,
  innerRef: Object,
  innerProps: Object,
  isSelected: boolean,
  isFocused: boolean,
};
function ShopItemOption(props: OptionProps) {
  const { data, innerRef, innerProps, isSelected, isFocused } = props;
  return (
    <div ref={innerRef} {...innerProps}>
      <ShopItemSummary
        isFocused={isFocused}
        selected={isSelected}
        shopItem={data.si}
        button
      />
    </div>
  );
}

function ShopItemSelector(props: Props) {
  const { value, onChange, shopItems, selectorClass, helperText, t } = props;

  const suggestions = shopItems.asMutable().map((si) => ({
    value: si.id,
    label: si.name,
    si,
  }));

  return (
    <Selector
      searchIcon
      selected={value}
      suggestions={suggestions}
      components={{ Option: ShopItemOption }}
      className={selectorClass}
      onChange={(event) => onChange(event.value)}
      placeholder={helperText || t('select.placeholder')}
    />
  );
}

export default withTranslation(['shop'])(ShopItemSelector);
